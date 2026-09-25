#!/usr/bin/env bash
# Comprueba que las tres herramientas del taller están listas.
# Uso: bash scripts/verificar-entorno.sh
set -u

fallos=0

ok()   { printf '  \033[32m✓\033[0m %-22s %s\n' "$1" "$2"; }
fail() { printf '  \033[31m✗\033[0m %-22s %s\n' "$1" "$2"; fallos=$((fallos + 1)); }

echo "Node"
if command -v node >/dev/null 2>&1; then
  version=$(node --version)
  mayor=${version#v}; mayor=${mayor%%.*}
  if [ "$mayor" -ge 20 ]; then ok "node" "$version"; else fail "node" "$version (se necesita 20 o superior)"; fi
else
  fail "node" "no está instalado"
fi

echo "npm"
if command -v npm >/dev/null 2>&1; then ok "npm" "$(npm --version)"; else fail "npm" "no está instalado"; fi

echo "Base de datos"
if [ ! -f .env ]; then
  fail ".env" "falta (copia .env.example)"
else
  set -a; . ./.env; set +a
  if [ -z "${DB_NAME:-}" ]; then
    fail ".env" "falta DB_NAME"
  elif mariadb -u "${DB_USER:-root}" ${DB_PASSWORD:+-p"$DB_PASSWORD"} -h "${DB_HOST:-localhost}" -e "USE \`$DB_NAME\`; SELECT COUNT(*) FROM productos;" >/dev/null 2>&1; then
    total=$(mariadb -N -u "${DB_USER:-root}" ${DB_PASSWORD:+-p"$DB_PASSWORD"} -h "${DB_HOST:-localhost}" -e "USE \`$DB_NAME\`; SELECT COUNT(*) FROM productos;" 2>/dev/null)
    ok "$DB_NAME" "conectada, $total productos"
  else
    fail "$DB_NAME" "no responde (¿importaste ventas.sql?)"
  fi
fi

echo "Repositorio"
commits=$(git rev-list --count HEAD 2>/dev/null || echo 0)
ok "commits" "$commits"

echo
if [ "$fallos" -eq 0 ]; then
  printf '\033[32mEntorno listo.\033[0m Pasa a la unidad 1.\n'
else
  printf '\033[31mFaltan %s cosa(s) por arreglar.\033[0m\n' "$fallos"
  exit 1
fi
