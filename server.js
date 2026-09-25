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
// Nada de aquí necesita MySQL ni Express todavía. Un servidor es solo eso:
// alguien llama, alguien contesta, y se queda esperando al siguiente.

import express from 'express';

// ¿En qué puerto? 3000 por defecto, pero se puede cambiar con PORT.
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

// La aplicación en sí: aquí irá todo lo que sabe hacer.
const app = express();

// La línea que de verdad pone el servidor en marcha. Sin esto, el archivo
// termina y el proceso muere.
