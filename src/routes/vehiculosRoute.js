import { Router } from 'express';
import { 
    createVehiculo, 
    deleteVehiculo, getAllVehiculos, 
    getVehiculoById, updateVehiculo } from '../controllers/vehiculosController.js'
import { verifyAdmin, verifyToken, verifyUser } from '../middlewares/verifyAdmin.js';

const router = Router();

router.get("/todosVehiculos", [verifyToken, verifyUser ] , getAllVehiculos);
router.get("/encontrarById/:id",[verifyToken, verifyUser ], getVehiculoById);
router.post("/registrar", [verifyAdmin], createVehiculo);
router.put("/actualizar/:id", [verifyToken,verifyAdmin], updateVehiculo);
router.delete("/eliminar/:id", [verifyToken,verifyAdmin], deleteVehiculo);


export default router;

