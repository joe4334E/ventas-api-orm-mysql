-- =========================================================
-- Taller: API + ORM (Sequelize) sobre MySQL
-- Esquema y datos de ejemplo.
--
-- Importar (una sola vez):
--   mysql -u root < ventas.sql
-- =========================================================

CREATE DATABASE IF NOT EXISTS ventas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ventas;

DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS vendedores;

CREATE TABLE productos (
  id     INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255)   NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock  INT            NOT NULL DEFAULT 0
) ENGINE = InnoDB;

CREATE TABLE clientes (
  id       INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(255) NOT NULL,
  telefono VARCHAR(30),
  email    VARCHAR(255) UNIQUE
) ENGINE = InnoDB;

CREATE TABLE vendedores (
  id       INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(255) NOT NULL,
  telefono VARCHAR(30),
  activo   BOOLEAN      NOT NULL DEFAULT TRUE
) ENGINE = InnoDB;

-- -----------------------------------------
-- Datos de ejemplo
-- -----------------------------------------

INSERT INTO productos (nombre, precio, stock) VALUES
  ('Teclado mecánico',      89.90,  12),
  ('Mouse inalámbrico',     34.50,  20),
  ('Monitor 24 pulgadas', 199.00,   6),
  ('Audífonos USB',         45.00,  15),
  ('Webcam HD',             59.90,   8),
  ('Impresora láser',      149.00,   3),
  ('Disco duro 1TB',        79.00,  10),
  ('Lámpara de escritorio', 25.50,  18),
  ('Silla ergonómica',     219.90,   4),
  ('Micrófono condensador', 95.00,   0);

INSERT INTO clientes (nombre, telefono, email) VALUES
  ('Ana Torres',   '555-1001', 'ana.torres@correo.com'),
  ('Luis Ramírez',  '555-1002', 'luis.ramirez@correo.com'),
  ('Sofía Díaz',   '555-1003', 'sofia.diaz@correo.com');

INSERT INTO vendedores (nombre, telefono, activo) VALUES
  ('Carlos Gómez', '555-2001', TRUE),
  ('María López',  '555-2002', TRUE),
  ('Jorge Pérez',  '555-2003', FALSE);
