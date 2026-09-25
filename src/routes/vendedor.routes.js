// Las mismas cinco rutas. Siempre son las mismas cinco.

import { Router } from 'express';
import {
  actualizarVendedor,
  crearVendedor,
  eliminarVendedor,
  obtenerVendedor,
  obtenerVendedores,
} from '../controllers/vendedor.controller.js';

const router = Router();

router.get('/', obtenerVendedores);
router.get('/:id', obtenerVendedor);
router.post('/', crearVendedor);
router.put('/:id', actualizarVendedor);
router.delete('/:id', eliminarVendedor);

export default router;
