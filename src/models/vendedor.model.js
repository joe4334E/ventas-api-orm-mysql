// El tercer recurso. Ya no hace falta explicar nada: se copia.

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Vendedor = sequelize.define(
  'Vendedor',
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
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      // La tabla dice DEFAULT TRUE, así que si no mandan nada, activo
      // vale true. En MySQL un BOOLEAN es un TINYINT(1): vale 1 o 0,
      // y Sequelize lo traduce a true/false al salir.
      defaultValue: true,
    },
  },
  { tableName: 'vendedores' },
);

export async function listar() {
  return Vendedor.findAll({ order: [['id', 'ASC']] });
}

export async function buscarPorId(id) {
  return Vendedor.findByPk(id);
}

export async function crear({ nombre, telefono, activo }) {
  return Vendedor.create({ nombre, telefono, activo });
}

export async function actualizar(id, { nombre, telefono, activo }) {
  const vendedor = await Vendedor.findByPk(id);

  if (!vendedor) {
    return null;
  }

  await vendedor.update({ nombre, telefono, activo });
  return vendedor;
}

export async function borrar(id) {
  const vendedor = await Vendedor.findByPk(id);

  if (!vendedor) {
    return 0;
  }

  await vendedor.destroy();
  return 1;
}

export default { listar, buscarPorId, crear, actualizar, borrar };
