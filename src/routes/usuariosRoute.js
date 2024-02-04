import { Router } from 'express'
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/usuariosController.js';
import { verifyAdmin, verifyToken, verifyUser } from '../middlewares/verifyAdmin.js';
import { validationFields } from '../middlewares/validatorExpress.js';
import { check } from 'express-validator';

const router = Router();

/* router.get("/checkautentication", verifyToken, (req, res, next) => {
    res.send("Hola usuario, Tu estas conectado");
    
})
router.get("/checkaUser/:id", verifyUser, (req, res, next) => {
    res.send("Hola usuario, Tu estas conectado y puedes eliminar tu cuenta");
    
}) */

router.get("/getAllUsers",[verifyToken ,verifyAdmin], getAllUsers);
router.get("/findUserById/:id",[verifyToken, verifyUser], getUserById);
router.put("/updateUser/:id", [verifyToken, verifyUser], updateUser);
router.delete("/deleteUser/:id", 
[verifyToken, verifyAdmin,check('id', "El ID no es válido").isMongoId()], 
validationFields, deleteUser);

export default router;