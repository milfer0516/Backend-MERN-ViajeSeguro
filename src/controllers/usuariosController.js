import { request, response } from 'express';
import  Usuario from '../models/Usuario.js';
import { createError } from '../utils/error.js';

// Obtener todos los vehiculos
export const getAllUsers = async (req=request, res = response, next) => {
    const page = parseInt(req.query.page) || 1;
    const limite = parseInt(req.query.limite) || 5;
    try {

        const skip = (page - 1) * limite

        /* const totalUsuarios = await Usuario.countDocuments({estado: true});
        const usuarios = await Usuario.find({ estado: true })
            .skip(skip)
            .limit(limite) */

        const [ totalUsuarios, usuarios ] = await Promise.all([
            Usuario.countDocuments({estado: true}),
            Usuario.find({ estado: true })
                .skip(skip)
                .limit(limite)
        ])

        res.status(200).json({
        totalUsuarios,
        usuarios,    
        });

    } catch (err) {
        next(err);
    }
}
// Obtener un vehiculo por ID
export const getUserById = async (req = request, res = response, next) => {
    try {

        const usuario = await Usuario.findById(req.params.id);
        if(!usuario ) {
            return next(createError(403, "Hubo un error en el ID del Usuario"))
        } 
        
        res.status(201).json(usuario);

    } catch (error) {
        next(error)
    }
}


// Actualizar un vehiculo
export const updateUser = async (req = request, res = response, next) => {

    try {

        const updateUsuario = await Usuario.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body },
            { new: true }
        )
        res.status(200).json(updateUsuario);
        
    } catch (error) {
        next(error)
    }
}

// Eliminar un Usuario
export const deleteUser = async (req=request, res=response, next) => {
    const { id } = req.params;
  
    try {

        /* Aca para mejor manejo de la consistencia de los datos no se debe borrar un usuario de una DB la mejor es manejar un estado de activo=true o inactivo=false */
        //const usuarioDeleted = await Usuario.findOne({estado})
        const usuario = await Usuario.findById(
            id);
            
        if( !usuario ) return next(createError(400, "Usuario no encontrado."));
        if( !usuario.estado ) return next(createError(400, "Usuario ya no esta activo."));

        usuario.estado = false
        await usuario.save()
        
        res.status(200).json({
            msg: "El usuario ha sido eliminado.",
            usuario
        });
        
        
        
    } catch (error) {
        next(error)
    }
}