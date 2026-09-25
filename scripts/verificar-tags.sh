#!/usr/bin/env bash
#
# Verifica que CADA tag del taller arranca y responde.
#
#   bash scripts/verificar-tags.sh            todos
#   bash scripts/verificar-tags.sh unidad-05  uno solo
#
# Usa 'git worktree' para no ensuciar el directorio de trabajo: cada tag
# se comprueba en una copia aparte y se tira al terminar.
#
# Qué se comprueba en cada tag:
#   - que los .js no tienen errores de sintaxis
#   - que la base tiene 10 productos
#   - a partir de la unidad 3, que el servidor levanta
#   - a partir de la unidad 4, que habla con MySQL de verdad
#   - en la unidad 6, que el modelo ya no tiene SQL dentro
#   - a partir de la unidad 7, que los tres recursos responden
#   - en la unidad 8, que la página y su CSS se sirven
#
set -uo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
PUERTO="${PUERTO_VERIFICACION:-3999}"
BASE="http://localhost:$PUERTO"

cd "$RAIZ"

if [ -t 1 ]; then
  VERDE=$'\033[32m'; ROJO=$'\033[31m'; GRIS=$'\033[90m'; FIN=$'\033[0m'
else
  VERDE=''; ROJO=''; GRIS=''; FIN=''
fi

solo="${1:-}"
tags=$(git tag | grep -E '^(unidad-|solucion)' | sort)
[ -n "$solo" ] && tags="$solo"

fallos=0
tmp_raiz=$(mktemp -d)
trap 'rm -rf "$tmp_raiz"' EXIT

# ── utilidades ────────────────────────────────────────────────────────────
pide() { # pide RUTA CODIGO_ESPERADO
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$BASE$1" 2>/dev/null)
  [ "$code" = "$2" ] && return 0
  return 1
}

sintaxis() { # sintaxis CARPETA
  local fallos_sintaxis=0 f
  while IFS= read -r f; do
    node --check "$f" >/dev/null 2>&1 || {
      echo "      ${ROJO}error de sintaxis:${FIN} ${f#$RAIZ/}"
      fallos_sintaxis=1
    }
  done < <(find "$1" -name '*.js' -not -path '*/node_modules/*' 2>/dev/null)
  return $fallos_sintaxis
}

arranca() { # arranca CARPETA  → deja el servidor en $SERVIDOR_PID
  [ -f "$1/server.js" ] || return 1
  # El exec no es cosmético. Sin él, este subshell lanza node como hijo
  # suyo: al matar el subshell, el node se queda vivo y sigue ocupando el
  # puerto. Entonces el tag siguiente arranca 'su' servidor, no puede
  # coger el puerto, y el sondeo de abajo lo da por bueno porque le
  # contesta el del tag ANTERIOR. Todas las comprobaciones de ese tag
  # acabarían en verde mintiendo.
  (cd "$1" && PORT=$PUERTO exec node server.js >/dev/null 2>&1) &
  SERVIDOR_PID=$!
  local i
  for i in $(seq 1 60); do
    sleep 0.25
    kill -0 "$SERVIDOR_PID" 2>/dev/null || return 1
    curl -s -o /dev/null --max-time 1 "$BASE/api/productos" 2>/dev/null && return 0
  done
  return 1
}

para() {
  [ -n "${SERVIDOR_PID:-}" ] && kill "$SERVIDOR_PID" 2>/dev/null
  wait "${SERVIDOR_PID:-}" 2>/dev/null
  SERVIDOR_PID=""
}

ok()   { printf '    %s✓%s %s\n' "$VERDE" "$FIN" "$1"; }
mal()  { printf '    %s✗%s %s\n' "$ROJO" "$FIN" "$1"; fallos=$((fallos + 1)); }

# ── por cada tag ──────────────────────────────────────────────────────────
for tag in $tags; do
  dir="$tmp_raiz/$tag"
  numero="${tag#unidad-}"; numero="${numero#0}"

  echo
  printf '%s▸ %s%s  %s\n' "$GRIS" "$tag" "$FIN" "$(git log -1 --format='%s' "$tag")"

  git worktree add -q --detach "$dir" "$tag" 2>/dev/null || { mal "no se pudo crear el worktree"; continue; }

  # 1. sintaxis de todo el .js
  if sintaxis "$dir"; then ok "sintaxis"; else mal "sintaxis"; fi

  # 2. la base de datos
  if sudo mariadb -N -u root -e "USE ventas; SELECT COUNT(*) FROM productos;" >/dev/null 2>&1; then
    n=$(sudo mariadb -N -u root -e "USE ventas; SELECT COUNT(*) FROM productos;" 2>/dev/null)
    [ "$n" = "10" ] && ok "base con $n productos" || mal "base con $n productos (deben ser 10)"
  else
    mal "no se puede leer la base 'ventas'"
  fi

  # 3. dependencias, solo si hay package-lock
  if [ -f "$dir/package-lock.json" ]; then
    (cd "$dir" && npm ci --silent >/dev/null 2>&1) \
      && ok "npm ci" || mal "npm ci"
    [ -f "$dir/.env" ] || cp "$RAIZ/.env" "$dir/.env" 2>/dev/null
  fi

  case "$tag" in
    unidad-00)
      [ -f "$dir/ventas.sql" ] && ok "ventas.sql presente" || mal "falta ventas.sql"
      [ -x "$dir/scripts/verificar-entorno.sh" ] && ok "script de entorno" || mal "falta el script de entorno"
      ;;
    unidad-01)
      [ -f "$dir/ENUNCIADO.md" ] && ok "ENUNCIADO.md" || mal "falta ENUNCIADO.md"
      grep -q 'api/productos' "$dir/ENUNCIADO.md" && ok "el contrato está escrito" || mal "el contrato no está"
      ;;
    unidad-02)
      grep -q '"type": *"module"' "$dir/package.json" && ok "type module" || mal "falta type module"
      ;;
    unidad-03|unidad-04|unidad-05|unidad-06|unidad-07|unidad-08|solucion)
      if arranca "$dir"; then ok "el servidor levanta"; else mal "el servidor NO levanta"; para; continue; fi

      pide / 200              && ok "GET /"                || mal "GET /"
      pide /api/productos 200 && ok "GET /api/productos"   || mal "GET /api/productos"
      pide /api/productos/1 200 && ok "GET /api/productos/1" || mal "GET /api/productos/1"
      pide /api/productos/999 404 && ok "404 de recurso"    || mal "404 de recurso"
      pide /no-existe 404     && ok "404 de ruta"           || mal "404 de ruta"

      # crear y borrar de verdad, con la base de datos de por medio
      nuevo=$(curl -s --max-time 5 -X POST "$BASE/api/productos" \
        -H 'Content-Type: application/json' \
        -d '{"nombre":"Producto de verificación","precio":1.5,"stock":1}')
      id=$(printf '%s' "$nuevo" | sed -n 's/.*"id":\([0-9]*\).*/\1/p')
      if [ -n "$id" ]; then
        ok "POST crea (id $id)"
        pide "/api/productos/$id" 200 && ok "el creado existe" || mal "el creado no existe"
        code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -X PUT "$BASE/api/productos/$id" \
          -H 'Content-Type: application/json' -d '{"nombre":"Verificado","precio":2.5,"stock":9}')
        [ "$code" = "200" ] && ok "PUT actualiza" || mal "PUT devolvió $code"
        code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -X DELETE "$BASE/api/productos/$id")
        [ "$code" = "204" ] && ok "DELETE borra" || mal "DELETE devolvió $code"
      else
        mal "POST no devolvió un id"
      fi

      # Validaciones del enunciado. SOLO a partir de la unidad 6: antes de
      # que Sequelize entre en escena no hay nada que valide, y un nombre
      # vacío se guarda sin quejarse. Eso es correcto en su momento, así
      # que aquí no se comprueba (ni se crea nada que luego hay que limpiar).
      case "$tag" in
        unidad-04|unidad-05)
          code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -X POST "$BASE/api/productos" \
            -H 'Content-Type: application/json' -d '{"nombre":"","precio":1,"stock":1}')
          [ "$code" = "201" ] \
            && ok "aún no valida nada (todavía no hay Sequelize)" \
            || mal "se esperaba 201: en estas unidades no hay validación"
          ;;
      esac

      case "$tag" in
        unidad-06|unidad-07|unidad-08|solucion)
          code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -X POST "$BASE/api/productos" \
            -H 'Content-Type: application/json' -d '{"nombre":"","precio":1,"stock":1}')
          [ "$code" = "400" ] && ok "400 con nombre vacío" || mal "nombre vacío devolvió $code"
          code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -X POST "$BASE/api/productos" \
            -H 'Content-Type: application/json' -d '{"nombre":"Algo","precio":-1,"stock":1}')
          [ "$code" = "400" ] && ok "400 con precio negativo" || mal "precio negativo devolvió $code"
          ;;
      esac

      case "$tag" in
        unidad-03)
          # En memoria: ni una fila toca la base, y el arranque empieza
          # con 2. Se comprueba DESPUÉS del bloque de CRUD de arriba,
          # que crea uno y lo borra, así que deben quedar 2.
          n=$(curl -s --max-time 5 "$BASE/api/productos" | grep -o '"id"' | wc -l)
          [ "$n" = "2" ] && ok "datos en memoria (2, aún sin base)" || mal "esperaba 2 en memoria, hay $n"
          ;;
        unidad-04)
          (cd "$dir" && node sandbox/crud-mysql2.js >/dev/null 2>&1) \
            && ok "sandbox/crud-mysql2.js corre" || mal "sandbox/crud-mysql2.js falla"
          ;;
        unidad-05)
          grep -q 'query(' "$dir/src/models/producto.model.js" \
            && ok "el modelo todavía lleva SQL (correcto aquí)" \
            || mal "el modelo ya no lleva SQL en la unidad 5"
          ;;
        unidad-06|unidad-07|unidad-08|solucion)
          if grep -qE "^[^/]*query\(" "$dir/src/models/producto.model.js"; then
            mal "queda SQL en el modelo (solo debería estar en comentarios)"
          else
            ok "el modelo ya no tiene SQL"
          fi
          grep -q "SequelizeValidationError" "$dir/src/app.js" \
            && ok "el manejador conoce ValidationError" || mal "falta ValidationError"
          ;;
      esac

      case "$tag" in
        unidad-07|unidad-08|solucion)
          pide /api/clientes 200   && ok "GET /api/clientes"   || mal "GET /api/clientes"
          pide /api/vendedores 200 && ok "GET /api/vendedores" || mal "GET /api/vendedores"
          ;;
      esac

      case "$tag" in
        unidad-08|solucion)
          pide /js/productos.js 200  && ok "GET /js/productos.js" || mal "falta productos.js"
          pide /css/styles.css 200   && ok "GET /css/styles.css"  || mal "falta styles.css"
          ;;
      esac

      para
      ;;
  esac

  # dejar la base como estaba
  sudo mariadb -u root -e "USE ventas; DELETE FROM productos WHERE id > 10;" >/dev/null 2>&1
  sudo mariadb -u root -e "USE ventas; DELETE FROM clientes WHERE id > 3;" >/dev/null 2>&1
  sudo mariadb -u root -e "USE ventas; DELETE FROM vendedores WHERE id > 3;" >/dev/null 2>&1

  git worktree remove --force "$dir" 2>/dev/null
done

echo
if [ "$fallos" -eq 0 ]; then
  printf '%sTodos los tags arrancan y responden.%s\n' "$VERDE" "$FIN"
else
  printf '%s%s comprobación(es) fallaron.%s\n' "$ROJO" "$fallos" "$FIN"
  exit 1
fi
