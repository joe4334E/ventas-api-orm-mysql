// Aquí vive lo que la API sabe hacer. server.js solo la pone a escuchar.

import express from 'express';
import productoRoutes from './routes/producto.routes.js';

const app = express();

app.use(express.json());

// /api/productos y lo que empieza por ahí lo resuelve producto.routes.js
app.use('/api/productos', productoRoutes);

export default app;
