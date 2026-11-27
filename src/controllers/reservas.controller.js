import { pool } from "../config/db.js";

const ESTADOS_VALIDOS = ["confirmada", "cancelada"];

const SELECT_RESERVA = `
  SELECT id, clase_id AS claseId, nombre_cliente AS nombreCliente, fecha, estado
  FROM reservas
`;

const esFechaValida = (fecha) => {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const date = new Date(`${fecha}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === fecha
  );
};

// 1. READ ALL: Obtener todas las reservas
export const getReservas = async (req, res) => {
  try {
    const [rows] = await pool.query(`${SELECT_RESERVA} ORDER BY id`);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las reservas" });
  }
};

// 2. READ ONE: Obtener una reserva por ID
export const getReservaById = async (req, res) => {
  try {
    const [rows] = await pool.query(`${SELECT_RESERVA} WHERE id = ?`, [
      Number(req.params.id),
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener la reserva" });
  }
};

// 3. CREATE: Crear una reserva nueva validando existencia, estado y cupo de la clase
export const createReserva = async (req, res) => {
  const { claseId, nombreCliente, fecha, estado } = req.body || {};

  if (!claseId || !nombreCliente || !fecha) {
    return res.status(400).json({
      mensaje: "Faltan datos obligatorios (claseId, nombreCliente, fecha)",
    });
  }

  if (!esFechaValida(fecha)) {
    return res
      .status(400)
      .json({ mensaje: "La fecha debe tener formato YYYY-MM-DD" });
  }

  if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
    return res
      .status(400)
      .json({ mensaje: "El estado debe ser 'confirmada' o 'cancelada'" });
  }

  const idClase = Number(claseId);

  if (!Number.isInteger(idClase)) {
    return res
      .status(400)
      .json({ mensaje: "claseId debe ser un número entero" });
  }

  try {
    const [clasesRows] = await pool.query(
      "SELECT id, activo, cupo_maximo AS cupoMaximo FROM clases WHERE id = ?",
      [idClase],
    );

    if (clasesRows.length === 0) {
      return res.status(404).json({ mensaje: "La clase indicada no existe" });
    }

    const clase = clasesRows[0];

    if (!clase.activo) {
      return res.status(400).json({ mensaje: "La clase no está activa" });
    }

    const [cupoRows] = await pool.query(
      `SELECT COUNT(*) AS ocupados
       FROM reservas
       WHERE clase_id = ? AND estado = 'confirmada'`,
      [idClase],
    );

    if (Number(cupoRows[0].ocupados) >= clase.cupoMaximo) {
      return res
        .status(400)
        .json({ mensaje: "No quedan cupos disponibles para esta clase" });
    }

    const [result] = await pool.query(
      `INSERT INTO reservas (clase_id, nombre_cliente, fecha, estado)
       VALUES (?, ?, ?, ?)`,
      [idClase, nombreCliente, fecha, estado ?? "confirmada"],
    );

    const [rows] = await pool.query(`${SELECT_RESERVA} WHERE id = ?`, [
      result.insertId,
    ]);

    res.status(201).json({ mensaje: "Reserva creada", reserva: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear la reserva" });
  }
};

// 4. UPDATE: Actualizar una reserva existente
export const updateReserva = async (req, res) => {
  const id = Number(req.params.id);
  const { claseId, nombreCliente, fecha, estado } = req.body || {};

  if (fecha !== undefined && !esFechaValida(fecha)) {
    return res
      .status(400)
      .json({ mensaje: "La fecha debe tener formato YYYY-MM-DD" });
  }

  if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
    return res
      .status(400)
      .json({ mensaje: "El estado debe ser 'confirmada' o 'cancelada'" });
  }

  try {
    const [rows] = await pool.query(`${SELECT_RESERVA} WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    const actual = rows[0];
    let nuevoClaseId = actual.claseId;

    if (claseId !== undefined) {
      const idClase = Number(claseId);

      if (!Number.isInteger(idClase)) {
        return res
          .status(400)
          .json({ mensaje: "claseId debe ser un número entero" });
      }

      const [clasesRows] = await pool.query(
        "SELECT id FROM clases WHERE id = ?",
        [idClase],
      );

      if (clasesRows.length === 0) {
        return res.status(404).json({ mensaje: "La clase indicada no existe" });
      }

      nuevoClaseId = idClase;
    }

    await pool.query(
      `UPDATE reservas
       SET clase_id = ?, nombre_cliente = ?, fecha = ?, estado = ?
       WHERE id = ?`,
      [
        nuevoClaseId,
        nombreCliente ?? actual.nombreCliente,
        fecha ?? actual.fecha,
        estado ?? actual.estado,
        id,
      ],
    );

    const [updated] = await pool.query(`${SELECT_RESERVA} WHERE id = ?`, [id]);

    res.status(200).json({ mensaje: "Reserva actualizada", reserva: updated[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar la reserva" });
  }
};

// 5. DELETE: Eliminar una reserva
export const deleteReserva = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query(`${SELECT_RESERVA} WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    await pool.query("DELETE FROM reservas WHERE id = ?", [id]);
    res.status(200).json({ mensaje: "Reserva eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar la reserva" });
  }
};
