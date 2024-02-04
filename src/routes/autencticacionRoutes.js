import { Router } from 'express'
import  { 
        confirmarCuentaUsuario, 
        logingUsuarios,
        verificarToken,
        logoutUsuario, 
        olvidePassword, 
        registrarUsuario, 
        nuevoPassword,
        perfilUsuario}  from '../controllers/autenticacionController.js';
import { validationFields } from '../middlewares/validatorExpress.js';
import { body, check } from 'express-validator';
import { validEmail, validPhoneUsuario, validUsuario } from '../utils/CustomValidator.js';
import { verifyToken, verifyUser } from '../middlewares/verifyAdmin.js';


const router = Router();
/* Autenticació, Registro y Confirmación de Usuarios */
router.post("/registrarse" ,[
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre', 'El nombre debe tener minimo 5 caracteres').isLength({min: 5}),
    check('correo', 'El correo no es valido').isEmail(),
    check("telefono", "El número telefónico es obligatorio").notEmpty(),
    body("correo").custom(validUsuario ),
    body("correo").custom(validEmail ),
    body("correo").custom(validPhoneUsuario ),
    check('password', "la contraseña debe tener minimo 6 caracteres").isLength({min: 6}),
], validationFields ,registrarUsuario);// Registro o Creación de Usuarios

router.post("/login",logingUsuarios); // Ingreso de usuarios Autenticados

router.get("/confirmar/:tokenID", confirmarCuentaUsuario); //Confirmación via email

router.post("/olvide-password", olvidePassword);


router.route("/olvide-password/:tokenID")
        .get(verificarToken)//validar envio del token unico aleatorio
        .post(nuevoPassword) //Validar y leer el token enviado

router.get("/perfil-usuario",verifyToken, verifyUser, perfilUsuario);

router.post("/logout", logoutUsuario); // Cerrrar la sesión de un Usuario

export default router;