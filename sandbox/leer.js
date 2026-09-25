// El SELECT más simple que existe: pedir filas y enseñarlas.
//
//   node sandbox/leer.js

import { query, pool } from '../src/config/database.js';

async function listar() {
  const productos = await query('SELECT * FROM productos');

  console.log(`${productos.length} productos:`);

  for (const producto of productos) {
    console.log(`  ${producto.id}  ${producto.nombre}  ${producto.precio}  stock ${producto.stock}`);
  }
}

try {
  await listar();
} catch (error) {
  // Sin esto, Node imprimiría la pila entera de 20 líneas. Con esto, una.
  console.error('No se pudo leer:', error.message);
  process.exitCode = 1;
} finally {
  // Sin pool.end() el proceso no terminaría: sigue esperando conexiones.
  await pool.end();
}
