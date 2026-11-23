import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para que Express entienda JSON en el body de las peticiones
app.use(express.json());

// Ruta de prueba para verificar que el servidor responde
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    mensaje: 'Servidor del Gestor de Turnos funcionando' 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});