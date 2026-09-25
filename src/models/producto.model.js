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

import { DataTypes } from 'sequelize';
import { query } from '../config/database.js';
import { sequelize } from '../config/database.js';

export async function listar() {
  return Producto.findAll({ order: [['id', 'ASC']] });
}

export async function buscarPorId(id) {
  const [producto] = await query('SELECT * FROM productos WHERE id = ?', [id]);
  return producto ?? null;
}

export async function crear({ nombre, precio, stock }) {
  return Producto.create({ nombre, precio, stock });
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

// ---------------------------------------------------------------
// El modelo del ORM. Se declara UNA VEZ y de aquí salen las cinco
// funciones de arriba, cuando se cambien en los siguientes to-dos.
//
// 'Producto' es el nombre con el que Sequelize sabrá llamar a la tabla
// productos. freezeTableName: true, puesto en la configuración de la
// conexión, evita que la convierta en Productos.
//
// DataTypes.UNSIGNED  = entero sin signo (0 y positivos)
// DataTypes.DECIMAL   = número con decimales exactos, como en la tabla
// DataTypes.STRING(n) = texto de hasta n caracteres
// ---------------------------------------------------------------

export const Producto = sequelize.define(
  'Producto',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacío' },
        len: { args: [2, 120], msg: 'El nombre debe tener entre 2 y 120 caracteres' },
      },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'El precio debe ser un número decimal válido' },
        min: { args: [0], msg: 'El precio no puede ser negativo' },
      },
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        isInt: { msg: 'El stock debe ser un número entero' },
        min: { args: [0], msg: 'El stock no puede ser negativo' },
      },
    },
  },
  { tableName: 'productos' },
);
