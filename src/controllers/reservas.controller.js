import { clases } from "./clases.controller.js";

const reservas = [
  {
    id: 1,
    claseId: 1,
    nombreCliente: "Lucía Gómez",
    fecha: "2026-11-27",
    estado: "confirmada",
  },
  {
    id: 2,
    claseId: 2,
    nombreCliente: "Mateo Díaz",
    fecha: "2026-11-27",
    estado: "confirmada",
  },
  {
    id: 3,
    claseId: 1,
    nombreCliente: "Sofía Pérez",
    fecha: "2026-11-28",
    estado: "cancelada",
  },
];

let nextId = reservas.length + 1;

// 1. READ ALL: Obtener todas las reservas
export const getReservas = (req, res) => {
  res.status(200).json(reservas);
};

// 2. READ ONE: Obtener una reserva por ID
export const getReservaById = (req, res) => {
  const id = Number(req.params.id);
  const reservaEncontrada = reservas.find((reserva) => reserva.id === id);

  if (!reservaEncontrada) {
    return res.status(404).json({ mensaje: "Reserva no encontrada" });
  }

  return res.status(200).json(reservaEncontrada);
};

// 3. CREATE: Crear una reserva nueva validando existencia, estado y cupo de la clase
export const createReserva = (req, res) => {
  const { claseId, nombreCliente, fecha, estado } = req.body || {};

  if (!claseId || !nombreCliente || !fecha) {
    return res.status(400).json({
      mensaje: "Faltan datos obligatorios (claseId, nombreCliente, fecha)",
    });
  }

  const idClase = Number(claseId);
  const clase = clases.find((c) => c.id === idClase);

  if (!clase) {
    return res.status(404).json({ mensaje: "La clase indicada no existe" });
  }

  if (!clase.activo) {
    return res.status(400).json({ mensaje: "La clase no está activa" });
  }

  const cuposOcupados = reservas.filter(
    (r) => r.claseId === idClase && r.estado === "confirmada",
  ).length;

  if (cuposOcupados >= clase.cupoMaximo) {
    return res
      .status(400)
      .json({ mensaje: "No quedan cupos disponibles para esta clase" });
  }

  const nuevaReserva = {
    id: nextId++,
    claseId: idClase,
    nombreCliente,
    fecha,
    estado: estado || "confirmada",
  };

  reservas.push(nuevaReserva);
  return res
    .status(201)
    .json({ mensaje: "Reserva creada", reserva: nuevaReserva });
};

// 4. UPDATE: Actualizar una reserva existente
export const updateReserva = (req, res) => {
  const id = Number(req.params.id);
  const reservaEncontrada = reservas.find((reserva) => reserva.id === id);

  if (!reservaEncontrada) {
    return res.status(404).json({ mensaje: "Reserva no encontrada" });
  }

  const { claseId, nombreCliente, fecha, estado } = req.body || {};

  if (claseId !== undefined) {
    const idClase = Number(claseId);
    const clase = clases.find((c) => c.id === idClase);
    if (!clase) {
      return res.status(404).json({ mensaje: "La clase indicada no existe" });
    }
    reservaEncontrada.claseId = idClase;
  }

  reservaEncontrada.nombreCliente =
    nombreCliente || reservaEncontrada.nombreCliente;
  reservaEncontrada.fecha = fecha || reservaEncontrada.fecha;
  reservaEncontrada.estado = estado || reservaEncontrada.estado;

  return res
    .status(200)
    .json({ mensaje: "Reserva actualizada", reserva: reservaEncontrada });
};

// 5. DELETE: Eliminar una reserva
export const deleteReserva = (req, res) => {
  const id = Number(req.params.id);
  const indice = reservas.findIndex((reserva) => reserva.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: "Reserva no encontrada" });
  }

  reservas.splice(indice, 1);
  return res.status(200).json({ mensaje: "Reserva eliminada" });
};
