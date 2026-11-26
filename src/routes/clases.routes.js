import { Router } from 'express';
import { getClases } from '../controllers/clases.controller.js';
import { getClaseById} from '../controllers/clases.controller.js';

const router = Router();

router.get('/', getClases);
router.get('/:id', getClaseById);

export default router;