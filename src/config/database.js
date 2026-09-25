// La conexión con MySQL. Todo lo que hable con la base pasa por aquí.

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

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

export default pool;   // el default sigue siendo el pool: es lo que usa el modelo actual

// ---------------------------------------------------------------
// Sequelize todavía no hace nada. Vive aquí, junto al pool, y se
// usará a partir del siguiente to-do. La conexión de mysql2 sigue
// viva: hasta que las cinco funciones del modelo cambien, el pool es
// el que trabaja.
// ---------------------------------------------------------------

export const sequelize = new Sequelize(nombre, usuario, process.env.DB_PASSWORD ?? '', {
  dialect: 'mysql',
  host,
  port: puerto,
  // false no imprime nada. Poner DB_LOGGING=true en el .env enciende el
  // log, que es la única forma de ver el SQL que escribe Sequelize.
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  // Sin esto, un precio guardado como 89.90 vuelve como la cadena
  // '89.90'. Con esto, vuelve como el número 89.9.
  dialectOptions: { decimalNumbers: true },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    freezeTableName: true,
    timestamps: false,
  },
});

