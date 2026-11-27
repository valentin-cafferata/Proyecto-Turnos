import { pool } from "../config/db.js";

const SELECT_CLASE = `
  SELECT id, nombre, instructor, horario, cupo_maximo AS cupoMaximo, activo
  FROM clases
`;

const mapClase = (clase) => ({ ...clase, activo: Boolean(clase.activo) });

export const getClases = async (req, res) => {
  try {
    const [rows] = await pool.query(`${SELECT_CLASE} ORDER BY id`);
    res.json(rows.map(mapClase));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las clases" });
  }
};

export const getClaseById = async (req, res) => {
  try {
    const [rows] = await pool.query(`${SELECT_CLASE} WHERE id = ?`, [
      Number(req.params.id),
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Clase no encontrada" });
    }

    res.json(mapClase(rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener la clase" });
  }
};

export const createClase = async (req, res) => {
  const { nombre, instructor, horario, cupoMaximo, activo } = req.body || {};

  if (!nombre || !instructor || !horario) {
    return res.status(400).json({
      mensaje: "Faltan datos obligatorios (nombre, instructor, horario)",
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO clases (nombre, instructor, horario, cupo_maximo, activo) VALUES (?, ?, ?, ?, ?)",
      [
        nombre,
        instructor,
        horario,
        cupoMaximo ?? 10,
        activo !== undefined ? Boolean(activo) : true,
      ],
    );

    const [rows] = await pool.query(`${SELECT_CLASE} WHERE id = ?`, [
      result.insertId,
    ]);

    res.status(201).json({ mensaje: "Clase creada", clase: mapClase(rows[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear la clase" });
  }
};

export const updateClase = async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, instructor, horario, cupoMaximo, activo } = req.body || {};

  try {
    const [rows] = await pool.query(`${SELECT_CLASE} WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Clase no encontrada" });
    }

    const actual = mapClase(rows[0]);

    await pool.query(
      `UPDATE clases
       SET nombre = ?, instructor = ?, horario = ?, cupo_maximo = ?, activo = ?
       WHERE id = ?`,
      [
        nombre ?? actual.nombre,
        instructor ?? actual.instructor,
        horario ?? actual.horario,
        cupoMaximo ?? actual.cupoMaximo,
        activo !== undefined ? Boolean(activo) : actual.activo,
        id,
      ],
    );

    const [updated] = await pool.query(`${SELECT_CLASE} WHERE id = ?`, [id]);

    res.json({
      mensaje: "Clase actualizada",
      clase: mapClase(updated[0]),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar la clase" });
  }
};

export const deleteClase = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query(`${SELECT_CLASE} WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Clase no encontrada" });
    }

    await pool.query("DELETE FROM clases WHERE id = ?", [id]);
    res.json({ mensaje: "Clase eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar la clase" });
  }
};
