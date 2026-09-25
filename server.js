// Este es el archivo que arranca el proyecto: `npm start` ejecuta este archivo.
//
// Un servidor web hace exactamente tres cosas:
//
//   1. RECIBIR   una petición (qué pide el cliente, por qué dirección)
//   2. RESPONDER devolver algo (datos, un error, una página)
//
//   3. ESCUCHAR  quedarse esperando en un puerto, un número que el sistema
//                operativo reserva para esta aplicación.

import express from 'express';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const app = express();

// Una ruta: el método y la dirección. Si alguien pide exactamente eso,
// ejecuta lo que hay entre llaves.
app.get('/', (req, res) => {
  res.send('Hola, soy el servidor del taller');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
