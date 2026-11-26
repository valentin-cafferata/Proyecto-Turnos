import { Router } from "express";
// Acá importamos las 2 de Valen (getClases, getClaseById) + las 3 nuevas tuyas:
import {
  getClases,
  getClaseById,
  createClase,
  updateClase,
  deleteClase,
} from "../controllers/clases.controller.js";

const router = Router();

router.get("/", getClases);
router.get("/:id", getClaseById);
router.post("/", createClase);
router.put("/:id", updateClase);
router.delete("/:id", deleteClase);

export default router;
