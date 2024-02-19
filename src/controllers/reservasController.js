import  { request, response } from 'express'
import mongoose from 'mongoose'
import moment from 'moment';
import Reserva from '../models/Reserva.js';
import Categoria from '../models/Categoria.js'
import { createError } from '../utils/error.js';
import { obtenerDirecciones } from '../utils/obtenerCoordenadas.js';
import { obtenerTiempoDistancia } from '../utils/obtenerTiempo.js';

/**
 * Creates a new reservation.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const crearReserva = async (req = request, res = response, next) => {
    const { categoria, horaReserva, fechaInicio, fechaFin, destinoInicial, destinoFinal, estado } = req.body;

    const { ObjectId } = mongoose.Types
    
    try {
         
        if(!categoria) {
            return next(createError(400, "Debes proporcionar una categoria válida"))
        }

        const categoriID = new ObjectId(categoria)
        const categoriaFound = await Categoria.findById(categoriID);
        console.log("Categoria encontrada: ",categoriaFound)
        
        const userId = req.user.id;

        if (!userId) {
            return next(createError(400, "Usuario no existe"));
        }

        const fechaInicioFormat = moment(fechaInicio).toISOString().substring(0, 10);
        const fechaFinFormat = moment(fechaFin).toISOString().substring(0, 10);
        const horaReservaFormat = moment(horaReserva, 'HH:mm').format('HH:mm').substring(0, 7);

        const reserva = new Reserva({
            usuario: userId,
            categoria: categoriaFound,
            fechaInicio: fechaInicioFormat,
            horaReserva: horaReservaFormat,
            fechaFin: fechaFinFormat,
            destinoInicial,
            destinoFinal,
            estado,
        });
        

        reserva.destinoInicial = destinoInicial
        reserva.destinoFinal = destinoFinal
        const respuestaCoordenadas = await obtenerDirecciones(destinoInicial, destinoFinal);

        //console.log("respuestaCoordenadas: ",respuestaCoordenadas)

        if (respuestaCoordenadas && respuestaCoordenadas.body) {
            //console.log('Respuesta Coordenadas:', respuestaCoordenadas.body);

            // Resto del código aquí
            const distanciaTotal = Math.ceil(respuestaCoordenadas.body.routes[0].distance / 1000);
            const { horas, minutos } = obtenerTiempoDistancia(respuestaCoordenadas.body.routes[0].duration);
        
            /* The code `reserva.coordenadasInicio = respuestaCoordenadas.body.waypoints[0].location;`
            is assigning the starting coordinates of the route to the `coordenadasInicio` property
            of the `reserva` object. */
            reserva.coordenadasInicio = respuestaCoordenadas.body.waypoints[0].location;
            reserva.coordenadasFinales = respuestaCoordenadas.body.waypoints[1].location;
            
            reserva.distancia = distanciaTotal;
            reserva.tiempoRecorrido = [horas, minutos];
            console.log("Reserva solicitada: ",reserva);
            

        } else {
            console.error('La respuesta de coordenadas es nula o no tiene cuerpo.');
            // Puedes manejar este caso según tus necesidades
            return next(createError(400, "No hay rutas disponibles para las coordenadas proporcionadas"));
        }

        const nuevaReserva = await reserva.save();
        console.log("Reserva Nueva: ",nuevaReserva);
        res.status(201).json(nuevaReserva);

    } catch (error) {
        next(error);
    }
};


export const getAllReservasByUser = async (req=request, res=response, next) => {

    try {
        const { id } = req.body
        //console.log(id)
        const reservas = await Reserva.find( id ).populate('usuario').populate('categoria')
        //console.log("Desde el controlador ReservByUser: ",reservas)
        // const reservas = await Reserva.find({ usuario: userId }).populate('usuario')
        
        res.status(200).json(
            {reservas}
        )
        
    } catch (error) {
        next();
    }

}

export const getByIdReserva = async (req=request, res=response, next) => {

    try {
        
        const { id } = req.params;

        //Verifico si el formato del ID enviado es el correcto
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de reserva no válido' });
        }

        const reservaPorId = await Reserva.findById( id ).populate('usuario').populate('categoria');
        //console.log("Reserva por ID: ",reservaPorId);

        if(!reservaPorId) return next(createError(404,`La reserva con el ${id} no se encontró`));

        res.status(201).json(reservaPorId);


    } catch (error) {
        next(error)
    }

}

export const updateReserva = async(req=request, res=response, next) => {

    const { id } = req.params
    const { body } = req.body
    try {

        const reservaActualizada = await Reserva.findByIdAndUpdate(id,
        { $set: body},
        { new: true}
        )

        if(!reservaActualizada) return next(createError("Reserva no encontrada"));

        res.status(200).json(reservaActualizada);
        
    } catch (error) {
        next(error)
    }
}

export const deleteReserva = async(req=request, res=response, next) => {

    try {

        await Reserva.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "La reserva ha sido eliminada"
        })
        
    } catch (error) {
        next(error)
    }

}