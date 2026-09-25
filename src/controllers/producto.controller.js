// Qué hacer con cada petición. Aquí se decide el código de respuesta:
// 200, 201, 204, 400, 404. Y nada más: ni SQL, ni nada de Express.

import * as productoModel from '../models/producto.model.js';

// Un id tiene que ser un entero positivo. 'abc', -1, 1.5 y vacío no valen.
function esIdValido(valor) {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0;
}

function faltanCampos(body) {
  const { nombre, precio, stock } = body ?? {};
  return nombre === undefined || precio === undefined || stock === undefined;
}

export const obtenerProductos = async (req, res) => {
  const productos = await productoModel.listar();
  return res.json(productos);
};

export const obtenerProducto = async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({
      error: { message: 'El identificador debe ser un número entero positivo' },
    });
  }

  const producto = await productoModel.buscarPorId(req.params.id);

  if (!producto) {
    return res.status(404).json({ error: { message: 'Producto no encontrado' } });
  }

  return res.json(producto);
};

export const crearProducto = async (req, res) => {
  if (faltanCampos(req.body)) {
    return res.status(400).json({
      error: { message: 'Nombre, precio y stock son obligatorios' },
    });
  }

  const producto = await productoModel.crear(req.body);
  return res.status(201).json(producto);
};

export const actualizarProducto = async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({
      error: { message: 'El identificador debe ser un número entero positivo' },
    });
  }

  if (faltanCampos(req.body)) {
    return res.status(400).json({
      error: { message: 'Nombre, precio y stock son obligatorios' },
    });
  }

  const producto = await productoModel.actualizar(req.params.id, req.body);
  return res.json(producto);
};

export const eliminarProducto = async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.status(400).json({
      error: { message: 'El identificador debe ser un número entero positivo' },
    });
  }

  const borrados = await productoModel.borrar(req.params.id);

  if (borrados === 0) {
    return res.status(404).json({ error: { message: 'Producto no encontrado' } });
  }

  return res.status(204).send();
};
