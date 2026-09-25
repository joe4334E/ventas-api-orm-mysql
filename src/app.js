// Aquí vive lo que la API sabe hacer. server.js solo la pone a escuchar.

import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hola, soy el servidor del taller');
});

export default app;
