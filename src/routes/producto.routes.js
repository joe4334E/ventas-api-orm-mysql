// Las rutas del recurso "producto". De momento los datos están en un array
// de este archivo: cuando la base de datos llegue (unidad 5), este mismo
// archivo no cambiará, solo cambiarán los datos que devuelve.

import { Router } from 'express';

const router = Router();

// Array en memoria. Vive mientras el proceso viva: si reinicias el
// servidor, todo lo creado aquí desaparece.
let productos = [
  { id: 1, nombre: 'Teclado mecánico', precio: 89.9, stock: 12 },
  { id: 2, nombre: 'Mouse inalámbrico', precio: 34.5, stock: 20 },
];
let siguienteId = 3;

// GET /api/productos → lista todos
router.get('/', (req, res) => {
  res.json(productos);
});

// GET /api/productos/1 → uno por su id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  // 404 = "no existe". Es distinto de 500 (error mío) y de 400 (petición
  // mal formada). Cada código dice algo distinto sobre qué pasó.
  if (!producto) {
    return res.status(404).json({ error: { message: 'Producto no encontrado' } });
  }

  return res.json(producto);
});

// POST /api/productos → crea uno
router.post('/', (req, res) => {
  const { nombre, precio, stock } = req.body ?? {};

  if (nombre === undefined || precio === undefined || stock === undefined) {
    return res.status(400).json({
      error: { message: 'Nombre, precio y stock son obligatorios' },
    });
  }

  const producto = { id: siguienteId, nombre, precio, stock };
  siguienteId += 1;
  productos.push(producto);

  // 201 = "creado". No es un 200: el servidor no solo devolvió algo,
  // además fabricó un recurso que no existía.
  return res.status(201).json(producto);
});

// PUT /api/productos/1 → lo actualiza entero
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = productos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: { message: 'Producto no encontrado' } });
  }

  const { nombre, precio, stock } = req.body ?? {};

  if (nombre === undefined || precio === undefined || stock === undefined) {
    return res.status(400).json({
      error: { message: 'Nombre, precio y stock son obligatorios' },
    });
  }

  productos[indice] = { id, nombre, precio, stock };

  return res.json(productos[indice]);
});

// DELETE /api/productos/1 → lo borra
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = productos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: { message: 'Producto no encontrado' } });
  }

  productos.splice(indice, 1);

  // 204 = "hecho, y no hay nada que devolver". Es el único que no lleva cuerpo.
  return res.status(204).send();
});

export default router;
