# ventas-api-orm-mysql

API REST de un catálogo de productos con **Node.js, Express, MySQL y Sequelize**.

Es el repositorio del taller
[astrolight](https://astrolight.dev/unidades/00-prepara-tu-maquina/): una API
construida en 33 pasos, uno por to-do.

## Cómo se usa

Este repositorio **no se descarga hecho**. El código está en el historial: cada
to-do del taller es un commit, y cada unidad es un tag.

```bash
git clone <url-del-repo>
cd ventas-api-orm-mysql
npm install
npm start
```

Y para ver el proyecto en otro punto del taller:

```bash
git log --oneline            # los 33 pasos, en orden
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

En construcción: la unidad 0 de 9.
