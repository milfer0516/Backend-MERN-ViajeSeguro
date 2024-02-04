import  { request, response } from 'express'
import Categoria from "../models/Categoria.js";

//Crear una Categoria
export const crearCategoria = async (req=request, res=response, next) => {
    
    try {
        
        const nuevaCategoria = new Categoria(req.body);
        const guardarCategoria = await nuevaCategoria.save();

        res.status(200).json({
            message: "Se creo la categoria con exito",
            guardarCategoria
        })
        
    } catch (error) {
        next(error)
    }
}

export const getAllCategorias = async (req=request, res=response, next) => {

    try {

        const categoria = await Categoria.find();
        return res.status(200).json(categoria)
        
    } catch (error) {
        next(error)
    }
}
export const getCategoriaById = async (req=request, res=response, next) => {
    
    try {
        const categoriaId = req.params.id;
        const categoria = await Categoria.findById(categoriaId);

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