import express from 'express';
import 'dotenv/config';
import clasesRoutes from './routes/clases.routes.js';

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

app.use('/clases', clasesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});