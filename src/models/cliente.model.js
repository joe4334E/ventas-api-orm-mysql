// Mismo esquema que producto.model.js, otra tabla.
// Copiar y cambiar los nombres es el 90% del trabajo.

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Cliente = sequelize.define(
  'Cliente',
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
    // Nullable a propósito: el enunciado no obliga a dar teléfono.
    // Si se dejara sin allowNull, la columna sería NOT NULL y habría que
    // mandar siempre un teléfono, o un texto vacío.
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // unique: true es una restricción de la BASE DE DATOS, no de Node.
      // Si dos peticiones llegan a la vez, la base la para.
      unique: { msg: 'Ya existe un cliente con ese email' },
      validate: {
        isEmail: { msg: 'El email no tiene un formato válido' },
      },
    },
  },
  { tableName: 'clientes' },
);

export async function listar() {
  return Cliente.findAll({ order: [['id', 'ASC']] });
}

export async function buscarPorId(id) {
  return Cliente.findByPk(id);
}

export async function crear({ nombre, telefono, email }) {
  return Cliente.create({ nombre, telefono, email });
}

export async function actualizar(id, { nombre, telefono, email }) {
  const cliente = await Cliente.findByPk(id);

  if (!cliente) {
    return null;
  }

  await cliente.update({ nombre, telefono, email });
  return cliente;
}

export async function borrar(id) {
  const cliente = await Cliente.findByPk(id);

  if (!cliente) {
    return 0;
  }

  await cliente.destroy();
  return 1;
}

export default { listar, buscarPorId, crear, actualizar, borrar };
