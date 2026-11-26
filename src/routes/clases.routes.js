import { Router } from 'express';
// Acá importamos las 2 de Valen (getClases, getClaseById) + las 3 nuevas tuyas:
import { 
  getClases, 
  getClaseById, 
  createClase, 
  updateClase, 
  deleteClase 
} from '../controllers/clases.controller.js';

const router = Router();

router.get('/', getClases);          // De Valen
router.get('/:id', getClaseById);    // De Valen
router.post('/', createClase);       // Tuya
router.put('/:id', updateClase);     // Tuya
router.delete('/:id', deleteClase);  // Tuya

export default router;