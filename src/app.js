// Aquí vive lo que la API sabe hacer. server.js solo la pone a escuchar.
//
// Lo que hay en public/ lo sirve el propio Express: quien pide / recibe
// public/index.html, y quien pide /css/styles.css recibe el CSS.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import productoRoutes from './routes/producto.routes.js';
import clienteRoutes from './routes/cliente.routes.js';

const app = express();
const carpetaActual = path.dirname(fileURLToPath(import.meta.url));
const carpetaPublica = path.resolve(carpetaActual, '../public');

// Quita la cabecera 'X-Powered-By: Express'. No es seguridad, es no decir
// en qué está escrito.
app.disable('x-powered-by');

// Sin esto, req.body sería undefined y no se podría crear nada.
app.use(express.json({ limit: '100kb' }));

// /api/productos y lo que empieza por ahí lo resuelve producto.routes.js
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);

// Lo de public/ sale tal cual, sin pasar por una ruta.
app.use(express.static(carpetaPublica));

// Este es el ÚLTIMO. Solo se llega aquí si ninguna ruta anterior respondió.
// Por eso el orden importa: si se pusiera antes, se comería todo.
app.use((req, res) => {
  return res.status(404).json({
    error: {
      message: `No existe la ruta ${req.method} ${req.originalUrl}`,
    },
  });
});

// Y este va después del 404. Express distingue los manejadores de error por
// tener CUATRO argumentos. Aunque no se use 'next', el cuarto debe estar:
// si se quita, Express cree que es un middleware normal y no lo usa.
app.use((error, req, res, next) => {
  // Sequelize lanza un tipo de error propio cuando una regla del modelo no
  // se cumple. Si no se distingue, un nombre vacío saldría como 500 cuando
  // en realidad es un 400: culpa del que envía los datos, no del servidor.
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: { message: error.errors[0].message } });
  }

  // Este es OTRO tipo de error, y no es lo mismo. La regla 'unique' la
  // vigila la BASE DE DATOS, no Sequelize: por eso llega como
  // UniqueConstraintError y no como ValidationError.
  //
  // Si dos peticiones llegan con el mismo email en el mismo milisegundo,
  // el if de JavaScript no sirve de nada: las dos pasan el mismo filtro.
  // Solo la base puede parar la segunda.
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: { message: 'Ya existe un registro con ese valor' } });
  }

  // No se filtra el error al cliente: un mensaje de MySQL puede contener
  // nombres de tabla, de columna o incluso la contraseña en algunos casos.
  console.error('Error no controlado:', error.message);

  return res.status(500).json({
    error: {
      message: 'Error interno del servidor',
    },
  });
});

export default app;
