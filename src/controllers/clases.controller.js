const clases = [
    {id: 1, nombre: "Peluqueria", instructor: "gaby", horario:"Lunes 18:00", cupoMaximo: 4, activo: true},
    {id: 2, nombre: "Yoga", instructor: "maria", horario:"Martes 19:00", cupoMaximo: 6, activo: true},
    {id: 3, nombre: "Spinning", instructor: "juan", horario:"Miércoles 20:00", cupoMaximo: 8, activo: false}
]

let nextId = clases.length + 1;

export const getClases = (req, res) => {
    res.status(200).json(clases);
}

export const getClaseById = (req, res) => {
    const id = Number(req.params.id);
    const claseEncontrada = clases.find((clase) => clase.id === id);

    if(!claseEncontrada){
        return res.status(404).json({ mensaje: 'Clase no encontrada' });
    }

    return res.status(200).json(claseEncontrada);
}
// 3. CREATE: Crear una clase nueva (Va DEBAJO de getClaseById)
export const createClase = (req, res) => {
  const { nombre, instructor, horario, cupoMaximo, activo } = req.body || {};

  if (!nombre || !instructor || !horario) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios (nombre, instructor, horario)' });
  }

  const nuevaClase = {
    id: nextId++,
    nombre,
    instructor,
    horario,
    cupoMaximo: cupoMaximo ?? 10,
    activo: activo !== undefined ? activo : true
  };

  clases.push(nuevaClase);
  return res.status(201).json({ mensaje: 'Clase creada', clase: nuevaClase });
};

// 4. UPDATE: Actualizar una clase existente (Va DEBAJO de createClase)
export const updateClase = (req, res) => {
  const id = Number(req.params.id);
  const claseEncontrada = clases.find((clase) => clase.id === id);

  if (!claseEncontrada) {
    return res.status(404).json({ mensaje: 'Clase no encontrada' });
  }

  const { nombre, instructor, horario, cupoMaximo, activo } = req.body || {};

  claseEncontrada.nombre = nombre || claseEncontrada.nombre;
  claseEncontrada.instructor = instructor || claseEncontrada.instructor;
  claseEncontrada.horario = horario || claseEncontrada.horario;
  claseEncontrada.cupoMaximo = cupoMaximo || claseEncontrada.cupoMaximo;
  if (activo !== undefined) claseEncontrada.activo = activo;

  return res.status(200).json({ mensaje: 'Clase actualizada', clase: claseEncontrada });
};

// 5. DELETE: Eliminar una clase (Va DEBAJO de updateClase, al final del archivo)
export const deleteClase = (req, res) => {
  const id = Number(req.params.id);
  const indice = clases.findIndex((clase) => clase.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Clase no encontrada' });
  }

  clases.splice(indice, 1);
  return res.status(200).json({ mensaje: 'Clase eliminada' });
};
