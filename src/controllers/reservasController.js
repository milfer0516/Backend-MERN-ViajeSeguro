import  { request, response } from 'express'
import mongoose from 'mongoose'
import moment from 'moment';
import Reserva from '../models/Reserva.js';
import Usuario from '../models/Usuario.js'
import Vehiculo from '../models/Vehiculo.js';
import { createError } from '../utils/error.js';
import { obtenerCoordenadas, obtenerDirecciones } from '../utils/obtenerCoordenadas.js';
import { obtenerTiempoDistancia } from '../utils/obtenerTiempo.js';

/**
 * Creates a new reservation.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const crearReserva = async (req = request, res = response, next) => {
    const { vehiculo, horaReserva, fechaInicio, fechaFin, destinoInicial, destinoFinal, estado } = req.body;

    try {
        const vehiculoFound = await Vehiculo.findById(vehiculo);

        if (!vehiculoFound) {
            return next(createError(400, "Vehiculo no encontrado"));
        }

        const userId = req.user.id;

        if (!userId) {
            return next(createError(400, "Usuario no existe"));
        }

        const fechaInicioFormat = moment(fechaInicio).toISOString().substring(0, 10);
        const fechaFinFormat = moment(fechaFin).toISOString().substring(0, 10);
        const horaReservaFormat = moment(horaReserva, 'HH:mm').format('HH:mm').substring(0, 7);

        const reserva = await new Reserva({
            usuario: userId,
            vehiculo: vehiculoFound,
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


        if (respuestaCoordenadas && respuestaCoordenadas.body) {
            //console.log('Respuesta Coordenadas:', respuestaCoordenadas.body);

            // Resto del código aquí
            const distanciaTotal = Math.ceil(respuestaCoordenadas.body.routes[0].distance / 1000);
            const { horas, minutos } = obtenerTiempoDistancia(respuestaCoordenadas.body.routes[0].duration);

            // Resto del código aquí
            reserva.estado = true;
        
            reserva.coordenadasInicio = respuestaCoordenadas.body.waypoints[0].location;
            reserva.coordenadasFinales = respuestaCoordenadas.body.waypoints[1].location;

            reserva.distancia = distanciaTotal;
            reserva.tiempoRecorrido = [horas, minutos];

            const nuevaReserva = await reserva.save();
            console.log(nuevaReserva);
            res.status(201).json({
                nuevaReserva,
            });

        } else {
            console.error('La respuesta de coordenadas es nula o no tiene cuerpo.');
            // Puedes manejar este caso según tus necesidades
            return next(createError(400, "No hay rutas disponibles para las coordenadas proporcionadas"));
        }
        


    } catch (error) {
        next(error);
    }
};


export const getAllReservasByUser = async (req=request, res=response, next) => {

    try {
        const { id } = req.body
        //console.log(id)
        const reservas = await Reserva.find( id ).populate('usuario').populate('vehiculo')
        // const reservas = await Reserva.find({ usuario: userId }).populate('usuario')
        console.log("Reserva: ", reservas)
        
        res.status(200).json(
            {reservas}
        )
        
    } catch (error) {
        next();
    }

}

export const getByIdReserva = async (req=request, res=response, next) => {

    try {
        
        const { id } = req.params
        //console.log("ID servidor: ", id)

        //Verifico si el formato del ID enviado es el correcto
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de reserva no válido' });
        }

        const reservaPorId = await Reserva.findById( id ).populate('usuario').populate('vehiculo');
        //console.log("Reserva por ID: ",reservaPorId);

        if(!reservaPorId) return next(createError(404,`La reserva con el ${id} no se encontró`));

        res.status(201).json(reservaPorId);


    } catch (error) {
        next(error)
    }

}

export const updateReserva = async(req=request, res=response, next) => {

    try {

        const reservaActualizada = await Reserva.findByIdAndUpdate(req.params.id,
        { $set: req.body},
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