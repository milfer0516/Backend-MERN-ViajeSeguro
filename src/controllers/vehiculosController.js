import { request, response } from 'express';
import  Vehiculo  from '../models/Vehiculo.js';
import Categoria from '../models/Categoria.js';
import { createError } from '../utils/error.js';

// Obtener todos los vehiculos
export const getAllVehiculos = async (req=request, res=response, next) => {
    
    try {

        const vehiculos = await Vehiculo.find().populate('categoria');
        res.status(200).json(vehiculos);

    } catch (error) {
        next(error);
    }
}
// Obtener un vehiculo por ID
export const getVehiculoById = async (req = request, res = response, next) => {
    try {

        const vehiculo = await Vehiculo.findById(req.params.id).populate('categoria');
        if(!vehiculo) {
            return next(createError(404, 'Vehiculo no encontrado'));
        }
        
        res.status(201).json(vehiculo);

    } catch (error) {
        res.status(500).json(error);
    }
}


// Registrar un vehiculo
export const createVehiculo = async (req=request, res=response, next) => {

    const { nombre, placa, estado, categoria ,foto, nombre_conductor } = req.body
    try {
        
        const findCategoria = await Categoria.findById(categoria);
        if(!findCategoria) {
            return res.status(400).json({
                message: "la categoria no existe!"
            })
        } 
        
        const vehiculo = new Vehiculo({ nombre, placa, estado, foto, nombre_conductor, categoria:findCategoria });
        
        const newVehiculo = await vehiculo.save();
        res.status(201).json({
            message: "Vehiculo registrado con exito!",
            newVehiculo
        })
        
    } catch (error) {
        next(error)
    }
}

// Actualizar un vehiculo
export const updateVehiculo = async (req =request, res=response, next) => {

    try {

        const updateVehiculo = await Vehiculo.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body },
            { new: true }
        )
        res.status(200).json(updateVehiculo);
        
    } catch (error) {
        next(error)
    }
}

// Eliminar un vehiculo
export const deleteVehiculo = async (req = request, res = response, next) => {

    try {

        await Vehiculo.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message: "El vehiculo ha sido eliminado"
        });
        
    } catch (error) {
        next(error)
    }
}

