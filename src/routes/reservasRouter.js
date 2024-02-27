import { Router } from 'express'
import { crearReserva, deleteReserva, getAllReservasByUser, getByIdReserva, updateReserva } from '../controllers/reservasController.js';
import { verifyAdmin, verifyToken, verifyUser } from '../middlewares/verifyAdmin.js';

const router = Router();

router.post("/crearReserva", verifyToken,verifyUser, crearReserva);
router.get("/getAllReservationsByUser", [verifyToken, verifyUser ], getAllReservasByUser);
router.get("/obtenerReservasPorId/:id", [verifyToken, verifyUser ], getByIdReserva);
router.put("/actualizarReserva/:id", [verifyToken, verifyUser ], updateReserva);
router.delete("/eliminarRerserva/:id", [verifyToken, verifyAdmin ], deleteReserva);

export default router