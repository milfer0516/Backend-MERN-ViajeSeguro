import { request, response } from 'express'
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';
import { createToken } from '../utils/jwtToken.js';
import { validEmail } from '../utils/CustomValidator.js';
import generarID from '../utils/generarID.js';
import { emailConfirmarCuenta, emailNuevoPassword } from '../utils/emailEnvios.js';


const registrarUsuario = async ( req=request, res=response, next ) => {

    try {

        const { nombre, correo, password, telefono } = req.body;

        /* const usuarioEncontrado = await Usuario.findOne({correo});
        const telefonoEncontrado = await Usuario.findOne({telefono}); */

        /* if( usuarioEncontrado ) return next(createError(400, `Usuario con el correo ${correo} ya se enecuentra registrado`))

        if(telefonoEncontrado) return next(createError(400, `El télefono número ${telefono} ya se enecuentra registrado`)) */
    

        //Crear un Usuario
        const usuario = new Usuario({ nombre, correo, password, telefono });
        usuario.tokenID = generarID();
        
        const usuarioNuevo = await usuario.save();

        //Guardar el usuario en MongoDB
        const token = await createToken({id: usuarioNuevo._id, isAdmin: usuarioNuevo.isAdmin});
        
        // Enviar email de confirmación
        await emailConfirmarCuenta(usuario.correo, usuario.tokenID, usuario.nombre);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true
        }).status(201).json({
            message: "Usuario Creado con Exito, Revisa tu Email para confirmar tu cuenta"
        })
        
        
    } catch (error) {

        return next(error)
    }

};

const confirmarCuentaUsuario = async (req=request, res=response , next) => {

    const tokenID  = req.params.tokenID;
    //console.log( tokenID )
    const usuarioConfirmado = await Usuario.findOne({ tokenID });
    
    if(!usuarioConfirmado ) return next(createError(403, "Error en el token de confirmación"));

    try {
        
        usuarioConfirmado.confirmado = true;
        usuarioConfirmado.tokenID = '';

        await usuarioConfirmado.save()
        res.status(200).json({
            message: "Usuario Confirmado Correctamente!",
        })
    } catch (error) {
        console.error("Error:", error);
        next(error)
    }

}

const olvidePassword = async (req=request, res=response, next) => {

    const { correo } = req.body

    const esCorreoValido = validEmail(correo);
    if(!esCorreoValido) return next(createError(404, "El correo ingresado no es valido"));

    const usuario = await Usuario.findOne({ correo });
    if(!usuario) return next(createError(404, `El usuario ${correo} no existe`));

    try {
        usuario.tokenID = generarID();
        await usuario.save()

        //Enviar email u correo electronico
        emailNuevoPassword(usuario.correo, usuario.tokenID, usuario.nombre);

        res.json({
            message: "Hemos enviado un correo con las instrucciones"
        })
    } catch (error) {
        next(error)
    }
}

const verificarToken = async (req=request, res=response, next) => {

    const { tokenID } = req.params

    const tokenValido = await Usuario.findOne({ tokenID })
    if(!tokenValido) return next(createError(403, "Token no válido."));

    res.json({
        msg: "Token válido! El usuario existe."
    })
}

const nuevoPassword = async (req=request, res=response, next) => { 

    // Extraer los datos 
    const { tokenID } = req.params;
    const { password } = req.body;


    const usuario = await Usuario.findOne({ tokenID })
    if(!usuario) return next(createError(404, "El token no es válido"));

    try {

        usuario.password = password;
        usuario.tokenID = "";
        await usuario.save();
        res.status(200).json({ msg:"Contraseña Modificada Correctamente."});
    } catch (error) {
        next(error)
    };

};

const perfilUsuario = async (req=request, res=response, next) => {
    const { user } = req

    const usuario = await Usuario.findById(  user.id  )
    if(usuario === " ") return next(createError(400, "Todos los campos son abligatorios"));
    if(!usuario) return next(createError(400, "Usuario con el ID no esta registrado"));

    try {

        res.status(201).json({
            id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo
        })
        
    } catch (error) {
        next(error)
    }
};

const logingUsuarios = async (req=request, res=response, next) => {

    try {
        const { correo, password } = req.body;
        //Verificar si el Usuario existe en la DB
        const userFound = await Usuario.findOne({ correo });


        if (!correo || !password ) {
            return next(createError(403, "Todos los campos son obligatorios"));
        };

        if(!userFound) {
           return next(createError( 404, "Usuario no se encuentra registrado!" ))
        }
        // Comprobar si el Usuario esta confirmado
        if(!userFound.confirmado) {
            return next(createError(403, "Tu cuenta no ha sido confirmada!"));
        }

        const correctPassword = await bcrypt.compare(password, userFound.password);

        if(!correctPassword) {
            return next(createError( 403, "Password o Correo son incorrectos" ))
        }

        const token = await createToken( { id: userFound._id, isAdmin: userFound.isAdmin } )
        

        //console.log(token)
        const {password:_ , isAdmin, _v, ...otherDetails} = userFound._doc
        res.status(200).json({
            token,
            id: userFound._id,
            nombre: userFound.nombre,
            correo: userFound.correo
        })

    } catch (error) {
         next(error)
    }
};

const logoutUsuario = async ( req=request, res=response, next ) => {

    res.cookie('token', " ", {
        expires: new Date(0)
    })

    return res.sendStatus(200);
};


export {
    registrarUsuario,
    logingUsuarios,
    confirmarCuentaUsuario,
    olvidePassword,
    verificarToken,
    nuevoPassword,
    perfilUsuario,
    logoutUsuario,
}