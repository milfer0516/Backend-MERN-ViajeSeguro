import mapbox from '@mapbox/mapbox-sdk';
import geocoding from "@mapbox/mapbox-sdk/services/geocoding.js"
import directions from "@mapbox/mapbox-sdk/services/directions.js";
import { tokenMabBox } from '../middlewares/tokenMapBox.js';

//const accessToken = process.env.MAPBOX_TOKEN
const mapboxClient = mapbox({ accessToken: tokenMabBox });

// Configura el cliente de direcciones
const directionsClient = directions(mapboxClient);

// Configura el cliente de geocodificación
const geocodingClient = geocoding(mapboxClient);

/**
 * Obtiene las coordenadas de un lugar dado su nombre.
 *
 * @param {string} nombreLugar Nombre del lugar para obtener las coordenadas.
 * @returns {Promise<Array<number>>} Coordenadas del lugar, en el formato [latitud, longitud].
 * @throws {Error} Si no se pueden obtener las coordenadas.
 */
async function obtenerCoordenadas(nombreLugar) {
  try {
    const respuesta = await geocodingClient.forwardGeocode({
      query: nombreLugar,
      limit: 5,
      types: ['address'],
    }).send();

    if (respuesta.body.features.length > 0) {
      const coordenadas = respuesta.body.features[0].geometry.coordinates;
        
      //console.log('Coordenadas:', coordenadas);
      //console.log('Respuesta:', respuesta.body);
      return coordenadas;

    } else {
      console.error('No se encontraron coordenadas para:', nombreLugar);
      return null;
    }

  } catch (error) {
    console.error('Error al obtener coordenadas:', error);
    return null;
  }
}
/**
 * Obtiene las coordenadas de un lugar dado su nombre.
 *
 * @param {string} nombreLugar Nombre del lugar para obtener las coordenadas.
 * @returns {Promise<Array<number>>} Coordenadas del lugar, en el formato [latitud, longitud].
 * @throws {Error} Si no se pueden obtener las coordenadas.
 */
async function obtenerDirecciones(coordenadaA, coordenadaB) {
  try {
    if (coordenadaA && coordenadaB) {
      /* console.log('Obteniendo coordenadas para:', coordenadaA, 'y', coordenadaB); */

      const puntoInicial = await obtenerCoordenadas(coordenadaA);
      const puntoFinal = await obtenerCoordenadas(coordenadaB);

      /* console.log('Punto Inicial:', puntoInicial);
      console.log('Punto Final:', puntoFinal); */

      const response = await directionsClient
        .getDirections({
          profile: 'driving',
          waypoints: [
            { coordinates: puntoInicial },
            { coordinates: puntoFinal },
          ],
          geometries: 'geojson',
        })
        .send();

      //console.log('Respuesta del servicio de direcciones:', response.body);

      if (!response.body.routes || response.body.routes.length === 0) {
        console.error('No hay rutas disponibles para las coordenadas proporcionadas');
        return null;
      }

      return response;
    } else {
      console.error('Error al obtener coordenadas de puntos.');
    }
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    return null;
  }
};


export {
  obtenerCoordenadas,
  obtenerDirecciones
}