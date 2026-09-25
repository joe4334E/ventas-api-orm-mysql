# ventas-api-orm-mysql

API REST de un catálogo de productos con **Node.js, Express, MySQL y Sequelize**.

Es el repositorio del taller
[astrolight](https://astrolight.dev/unidades/00-prepara-tu-maquina/): una API
construida en 35 pasos, uno por to-do.

## Cómo se usa

Este repositorio **no se descarga hecho**. El código está en el historial: cada
to-do del taller es un commit, y cada unidad es un tag.

```bash
git clone https://github.com/joe4334E/ventas-api-orm-mysql.git
cd ventas-api-orm-mysql
npm install
npm start
```

Y para ver el proyecto en otro punto del taller:

```bash
git log --oneline            # los 35 pasos, en orden
git checkout unidad-05       # el estado al terminar la unidad 5
```

## Puesta en marcha

Necesitas Node 20 o superior y MySQL o MariaDB con la base `ventas` importada
(ver `ventas.sql`).

```bash
cp .env.example .env     # y ajusta tus credenciales
mysql -u root < ventas.sql
npm install
npm start
```

## Estado

Completo. Las 9 unidades están publicadas y las 35 etapas verificadas.

| | |
|---|---|
| 35 to-dos | un commit cada uno, en orden de lectura, más 1 commit de extras |
| 11 tags | `unidad-00` … `unidad-08`, más `solucion` y `extras` |
| `solucion` | el proyecto terminado, idéntico a `unidad-08` |

`solucion` y `unidad-08` apuntan al mismo commit a propósito: al final del
taller ya no queda nada por añadir, solo leer lo que hiciste.

Para comprobar que el historial entero sigue vivo:

```bash
bash scripts/verificar-tags.sh
```

Crea un worktree por tag, levanta cada versión de la API, le hace el CRUD
completo y comprueba lo que esa unidad tiene que tener y no lo que tendrá
después. Es la red de seguridad: si un to-do deja el proyecto roto, salta
ahí y no dos capítulos más adelante.

## Para quién es

Si vienes del taller, no clones esto para seguir el curso: sigue las unidades
y el repositorio se va construyendo contigo, commit a commit. Este README es
para quien ya lo terminó o quiere ver el resultado.

