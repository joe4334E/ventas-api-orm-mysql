// Tercera copia del mismo patrón. Los mensajes cambian, la forma no.

import * as vendedorModel from '../models/vendedor.model.js';

function esIdValido(valor) {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0;
}

export const obtenerVendedores = async (req, res) => {
  const vendedores = await vendedorModel.listar();
  return res.json(vendedores);
};

export const obtenerVendedor = async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({
      error: { message: 'El identificador debe ser un número entero positivo' },
    });
  }

  const vendedor = await vendedorModel.buscarPorId(req.params.id);

  if (!vendedor) {
    return res.status(404).json({ error: { message: 'Vendedor no encontrado' } });
  }

  return res.json(vendedor);
};

export const crearVendedor = async (req, res) => {
  const { nombre } = req.body ?? {};

  if (nombre === undefined) {
    return res.status(400).json({
      error: { message: 'El nombre es obligatorio' },
    });
  }

  const vendedor = await vendedorModel.crear(req.body);
  return res.status(201).json(vendedor);
};

export const actualizarVendedor = async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({
      error: { message: 'El identificador debe ser un número entero positivo' },
    });
  }

  const { nombre } = req.body ?? {};

  if (nombre === undefined) {
    return res.status(400).json({
      error: { message: 'El nombre es obligatorio' },
    });
  }

  const vendedor = await vendedorModel.actualizar(req.params.id, req.body);
  return res.json(vendedor);
};

export const eliminarVendedor = async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({
      error: { message: 'El identificador debe ser un número entero positivo' },
    });
  }

  const borrados = await vendedorModel.borrar(req.params.id);

  if (borrados === 0) {
    return res.status(404).json({ error: { message: 'Vendedor no encontrado' } });
  }

  return res.status(204).send();
};
