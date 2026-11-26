CREATE TABLE IF NOT EXISTS clases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  instructor VARCHAR(100) NOT NULL,
  horario VARCHAR(100) NOT NULL,
  cupo_maximo INT NOT NULL DEFAULT 10,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clase_id INT NOT NULL,
  nombre_cliente VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  estado ENUM('confirmada', 'cancelada') NOT NULL DEFAULT 'confirmada',
  FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE CASCADE
);

-- Datos iniciales de prueba (INSERT IGNORE evita duplicados si volvés a correr el script)
INSERT IGNORE INTO clases (id, nombre, instructor, horario, cupo_maximo, activo) VALUES
  (1, 'Peluqueria', 'gaby', 'Lunes 18:00', 4, TRUE),
  (2, 'Yoga', 'maria', 'Martes 19:00', 6, TRUE),
  (3, 'Spinning', 'juan', 'Miércoles 20:00', 8, FALSE);

INSERT IGNORE INTO reservas (id, clase_id, nombre_cliente, fecha, estado) VALUES
  (1, 1, 'Lucía Gómez', '2026-11-27', 'confirmada'),
  (2, 2, 'Mateo Díaz', '2026-11-27', 'confirmada'),
  (3, 1, 'Sofía Pérez', '2026-11-28', 'cancelada');
