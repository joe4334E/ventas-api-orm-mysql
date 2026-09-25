// Las mismas cinco funciones que en producto.controller.js, con otros
// mensajes. Copiar, cambiar nombres, y ya.

import * as clienteModel from '../models/cliente.model.js';

function esIdValido(valor) {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0;
}

function faltanCampos(body) {
  const { nombre } = body ?? {};
  return nombre === undefined;
}

export const obtenerClientes = async (req, res) => {
  const clientes = await clienteModel.listar();
  return res.json(clientes);
};

export const obtenerCliente = async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({
      error: { message: 'El identificador debe ser un número entero positivo' },
    });
  }

  const cliente = await clienteModel.buscarPorId(req.params.id);

  if (!cliente) {
    return res.status(404).json({ error: { message: 'Cliente no encontrado' } });
  }

  return res.json(cliente);
};

export const crearCliente = async (req, res) => {
  if (faltanCampos(req.body)) {
    return res.status(400).json({
      error: { message: 'El nombre es obligatorio' },
    });
  }

  const cliente = await clienteModel.crear(req.body);
  return res.status(201).json(cliente);
};

export const actualizarCliente = async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({
      error: { message: 'El identificador debe ser un número entero positivo' },
    });
  }

  if (faltanCampos(req.body)) {
    return res.status(400).json({
      error: { message: 'El nombre es obligatorio' },
    });
  }

  const cliente = await clienteModel.actualizar(req.params.id, req.body);
  return res.json(cliente);
};

export const eliminarCliente = async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({
      error: { message: 'El identificador debe ser un número entero positivo' },
    });
  }

  const borrados = await clienteModel.borrar(req.params.id);

  if (borrados === 0) {
    return res.status(404).json({ error: { message: 'Cliente no encontrado' } });
  }

  return res.status(204).send();
};
