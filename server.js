// Este es el archivo que arranca el proyecto: `npm start` ejecuta este archivo.
//
// Un servidor web hace exactamente tres cosas:
//
//   1. RECIBIR   una petición (qué pide el cliente, por qué dirección)
//   2. RESPONDER devolver algo (datos, un error, una página)
//
//   3. ESCUCHAR  quedarse esperando en un puerto, un número que el sistema
//                operativo reserva para esta aplicación.
//
// Las dos primeras ya no están aquí: viven en src/app.js. Aquí solo
// queda la tercera, poner a escuchar.

import app from './src/app.js';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
