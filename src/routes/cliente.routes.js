// Idéntico a producto.routes.js con otras cinco líneas.
// Las rutas nunca cambian: siempre son las mismas cinco.

import { Router } from 'express';
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  obtenerCliente,
  obtenerClientes,
} from '../controllers/cliente.controller.js';

const router = Router();

router.get('/', obtenerClientes);
router.get('/:id', obtenerCliente);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;
