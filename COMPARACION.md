# SQL a mano frente a ORM

Las cinco operaciones del recurso `producto`, escritas de las dos formas.
Este archivo es el resultado medido de la unidad 6, no un ejemplo inventado.

## Las líneas, contadas

| | mysql2 | Sequelize |
|---|---|---|
| Las 5 funciones | 30 líneas (23 con SQL) | 35 líneas (0 con SQL) |
| Declaración del modelo | — | 35 líneas |
| **Archivo entero** | **41 líneas** | **112 líneas** |

El ORM **no** acortó nada. Todo lo contrario. Si el taller te ha dejado con
esa impresión, este archivo está para quitarla.

## Entonces, ¿para qué sirve?

El ahorro no está en las líneas de hoy. Está en tres cosas concretas.

### 1. El esquema se declara una vez y se respeta en todas partes

Con mysql2, el esquema vivía repartido:

```
SELECT * FROM productos          ← una tabla
INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)
```

Las columnas estaban escritas en texto dentro de cinco cadenas distintas. Si
mañana la columna `precio` pasa a llamarse `importe`, había que encontrarlas
las cinco.

Con `define`, el esquema está en un sitio, y a partir de ahí `create`,
`findAll` y `update` lo usan todos. Se renombra en un archivo.

### 2. Las reglas del negocio viajan con el modelo

Las seis reglas del enunciado (`ENUNCIADO.md`) están en `validate`. Antes
vivían en el controller, escritas a mano, y solo se comprobaban en el POST.

Ahora cualquier vía que escriba en la tabla las comprueba. El día que
llegue un `POST /api/importar` que inserte 500 filas, no se va a saltar las
reglas.

### 3. Cambia lo que hay que recordar, no lo que hay que escribir

`Producto.findByPk(id)` devuelve `null` si no está. Con `pool.execute` había
que acordarse de que `destructure` sobre un array vacío da `undefined`, y
convertirlo a `null` a mano. Ese `?? null` desapareció.

Son detalles pequeños por separado. Juntos son la diferencia entre un CRUD y
una aplicación que se puede mantener.

## Dónde NO conviene un ORM

- **Consultas simples de una tabla.** Este CRUD. El SQL a mano es más corto y
  más rápido de escribir.
- **Cuando el SQL es el producto.** Informes, agregaciones complejas
  (`GROUP BY`,funciones de ventana), consultas que una persona afina a mano. Ahí el
  ORM estorba: terminas peleándote con `literal()` y `query()`.
- **Cuando el problema es el arranque.** Sequelize tiene su coste: una
  conexión, un `sync()`, un modelo que cargar. Para un script de 40 líneas,
  `mysql2` es más simple.

## El SQL que Sequelize escribió por ti

Con `DB_LOGGING=true` en el `.env` puedes verlo. Un `GET /api/productos` de la
unidad 6 produce:

```sql
SELECT `id`, `nombre`, `precio`, `stock` FROM `productos` AS `Producto`
WHERE `Producto`.`id` = '2';
```

Tal cual, con el id entrecomillado y sin LIMIT 1: Sequelize confía en que
la búsqueda por clave primaria ya es única y no lo pone.

Y un `PUT` de la unidad 4, escrito a mano, era:

```sql
UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?
```

Mismo trabajo. Una de las dos se la escribió el programa.

Prueba esto: pon `DB_LOGGING=true` en el `.env`, reinicia, haz un `POST`, y
compara lo que ves en el terminal con lo que habrías escrito tú.
