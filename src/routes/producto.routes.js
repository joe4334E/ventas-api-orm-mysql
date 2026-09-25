// Las rutas del recurso "producto": qué dirección hace qué.
// Este archivo no ha cambiado desde la unidad 3. Sigue siendo el mismo:
// cinco direcciones. Lo único que cambió es a quién llama.

import { Router } from 'express';
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProducto,
  obtenerProductos,
} from '../controllers/producto.controller.js';

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

export default router;
