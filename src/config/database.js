// La conexión con MySQL. Todo lo que hable con la base pasa por aquí.

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// quiet: true evita que dotenv imprima 'injected env from .env'.
// Ese ruido confunde: parece un mensaje de error y no lo es.
dotenv.config({ quiet: true });

// mysql2/promise usa async/await. La alternativa es mysql2 normal, con
// callbacks: es lo mismo pero cada función necesita un tercer argumento.

const nombre = process.env.DB_NAME;
const usuario = process.env.DB_USER;
const host = process.env.DB_HOST;
const puerto = Number.parseInt(process.env.DB_PORT ?? '3306', 10);

if (!nombre || !usuario || !host) {
  throw new Error('Faltan DB_NAME, DB_USER o DB_HOST en el archivo .env');
}

// Un "pool" es un grupo de conexiones abiertas y reutilizables.
// Abrir y cerrar una conexión en cada petición sería lentísimo; con el
// pool, MySQL ya la tiene abierta y solo hay que pedirla.
export const pool = mysql.createPool({
  host,
  port: puerto,
  user: usuario,
  password: process.env.DB_PASSWORD ?? '',
  database: nombre,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
});

// query() hace el trabajo sucio de liberar la conexión al terminar.
// Con callbacks habría que acordarse de hacerlo siempre a mano.
export async function query(sql, parametros = []) {
  const [resultado] = await pool.execute(sql, parametros);
  return resultado;
}

export default pool;
