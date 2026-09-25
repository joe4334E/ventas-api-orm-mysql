// ---------------------------------------------------------------
// ESTE ARCHIVO CAMBIARÁ ENTERO, Y EL CONTROLLER NO SE ENTERARÁ.
//
// Un ORM (Object-Relational Mapper) es una capa que traduce esto:
//
//   await query('SELECT * FROM productos ORDER BY id')
//
// en esto:
//
//   await Producto.findAll()
//
// Estas cinco funciones de aquí son exactamente las que un ORM
// automatiza. Cuando termine la unidad, el archivo habrá pasado de
// 40 líneas de SQL a menos de 25, y devuelven lo mismo: los mismos
// datos, en el mismo orden, con los mismos errores.
//
// La diferencia no es que el SQL desaparezca. El SQL sigue ahí, pero
// lo escribe el programa en vez de escribirlo tú.
// ---------------------------------------------------------------

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
