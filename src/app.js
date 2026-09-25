// Aquí vive lo que la API sabe hacer. server.js solo la pone a escuchar.
//
// Lo que hay en public/ lo sirve el propio Express: quien pide / recibe
// public/index.html, y quien pide /css/styles.css recibe el CSS.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import productoRoutes from './routes/producto.routes.js';

const app = express();
const carpetaActual = path.dirname(fileURLToPath(import.meta.url));
const carpetaPublica = path.resolve(carpetaActual, '../public');

app.use(express.json());

// /api/productos y lo que empieza por ahí lo resuelve producto.routes.js
app.use('/api/productos', productoRoutes);

// Lo de public/ sale tal cual, sin pasar por una ruta.
app.use(express.static(carpetaPublica));

export default app;
