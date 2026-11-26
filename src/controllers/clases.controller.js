const clases = [
    {id: 1, nombre: "Peluqueria", instructor: "gaby", horario:"Lunes 18:00", cupoMaximo: 4, activo: true},
    {id: 2, nombre: "Yoga", instructor: "maria", horario:"Martes 19:00", cupoMaximo: 6, activo: true},
    {id: 3, nombre: "Spinning", instructor: "juan", horario:"Miércoles 20:00", cupoMaximo: 8, activo: false}
]

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