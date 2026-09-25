// Todo lo que se le puede preguntar a la tabla productos.
// Ninguna función de aquí sabe qué es una petición ni una respuesta:
// eso es del controller. Aquí solo hay SQL.

import { query } from '../config/database.js';

export async function listar() {
  return query('SELECT * FROM productos ORDER BY id');
}

export async function buscarPorId(id) {
  const [producto] = await query('SELECT * FROM productos WHERE id = ?', [id]);
  return producto ?? null;
}

export async function crear({ nombre, precio, stock }) {
  const resultado = await query(
    'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
    [nombre, precio, stock],
  );

  return buscarPorId(resultado.insertId);
}

export async function actualizar(id, { nombre, precio, stock }) {
  await query('UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?', [
    nombre,
    precio,
    stock,
    id,
  ]);

  return buscarPorId(id);
}

export async function borrar(id) {
  const resultado = await query('DELETE FROM productos WHERE id = ?', [id]);
  return resultado.affectedRows;
}

export default { listar, buscarPorId, crear, actualizar, borrar };
