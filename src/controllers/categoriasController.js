import  { request, response } from 'express'
import Categoria from "../models/Categoria.js";
import Vehiculo from '../models/Vehiculo.js';

//Crear una Categoria
export const crearCategoria = async (req=request, res=response, next) => {
    
    try {
        const nuevaCategoria = new Categoria(req.body);

        const categoriaSinVehiculos = await nuevaCategoria.save();

        const vehiculosIds = req.body.vehiculos;

        vehiculosIds.forEach((vehiculoId) => {
        categoriaSinVehiculos.vehiculos.push(vehiculoId);
        });

        res.status(200).json({
            message: "Se creo la categoria con exito",
            categoriaSinVehiculos,
        });
        
    } catch (error) {
        next(error)
    }
}

//Obtener todas las Categorias
export const getAllCategorias = async (req=request, res=response, next) => {

    try {

        const categoria = await Categoria.find().populate('vehiculos');
        //console.log(categoria);
        return res.status(200).json({
            categoria
        });

        
    } catch (error) {
        next(error)
    }
};

// Obtener Categorias X ID
export const getCategoriaById = async (req=request, res=response, next) => {
    
    try {
        const categoriaId = req.params.id;
        const categoria = await Categoria.findById(categoriaId).populate('vehiculos');

        if(!categoria) return res.status(404).json("Categoria no encontrada");

        res.status(200).json(categoria)
    } catch (error) {
        next(error);
    }
}

//Eliminar una Categoria
export const deleteCategoria = async (req=request, res=response, next) => {
    
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if(!categoria) return res.status(404).json({message: "Categoria no encontrada"});
    
    return res.sendStatus(204);
}

//Update Categoria
export const updateCategoria = async (req=request, res=response, next) => {

    try {
        
        const categoriaId = req.params.id;
        const categoria = await Categoria.findByIdAndUpdate(categoriaId,
            { $set: req.body },
            { new: true }
        )
        
        if(!categoria) return res.status(404).json({message: "Categoria no se encontró"})
        
        res.status(200).json(categoria)
    } catch (error) {
        next(error)
    }
}