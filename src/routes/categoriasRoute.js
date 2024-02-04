import { Router } from 'express';
import { crearCategoria, deleteCategoria, getAllCategorias, getCategoriaById, updateCategoria } from '../controllers/categoriasController.js';
import { verifyAdmin, verifyToken } from '../middlewares/verifyAdmin.js';

const router = Router(); 

router.post("/crearCategoria", [verifyToken, verifyAdmin], crearCategoria);
router.get("/encontrarCategoria/:id", [verifyToken], getCategoriaById);
router.get("/encontrarCategorias", [verifyToken], getAllCategorias);
router.put("/actualizarCategoria/:id", [verifyToken, verifyAdmin], updateCategoria);
router.delete("/eliminarCategoria/:id", [verifyToken, verifyAdmin], deleteCategoria);

export default router;
