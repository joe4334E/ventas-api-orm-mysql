// El CRUD completo escrito a mano: crear, leer, actualizar y borrar.
// Esto es lo que, en la unidad 6, va a hacer Sequelize en nueve líneas.
//
//   node sandbox/crud-mysql2.js

import { query, pool } from '../src/config/database.js';

async function crear() {
  // INSERT. Los '?' son huecos: los valores van aparte, en el array.
  // Nunca se mete el dato dentro del texto del SQL.
  const resultado = await query(
    'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
    ['Teclado de prueba', 49.9, 7],
  );

  // insertId es el id que le puso MySQL al producto recién creado.
  // Todavía no lo sabemos, así que no se puede inventar.
  const idNuevo = resultado.insertId;
  console.log(`  creado con id ${idNuevo}`);

  return idNuevo;
}

async function leer(id) {
  const [producto] = await query('SELECT * FROM productos WHERE id = ?', [id]);
  console.log(`  leido: ${producto.nombre}  ${producto.precio}  stock ${producto.stock}`);
  return producto;
}

async function actualizar(id) {
  await query('UPDATE productos SET precio = ?, stock = ? WHERE id = ?', [44.9, 5, id]);
  console.log(`  actualizado`);
}

async function borrar(id) {
  await query('DELETE FROM productos WHERE id = ?', [id]);
  console.log(`  borrado`);
}

const id = await crear();
await leer(id);
await actualizar(id);
await leer(id);
await borrar(id);

// Al final, el producto tiene que seguir ahí, con el precio nuevo.
const [restante] = await query('SELECT COUNT(*) AS total FROM productos WHERE id = ?', [id]);
console.log(`\nQuedan ${restante.total} filas con ese id (debe ser 0).`);

await pool.end();
