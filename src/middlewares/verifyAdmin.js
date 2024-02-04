import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js'

/* Para verificar si el token existe en la cookies y si es correcto */
export const verifyToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      return next(createError(403, "No se proporcionó un token o el formato del token es incorrecto."));
    }

    const token = authorizationHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return next(createError(403, "El token ha expirado."));
        } else {
          return next(createError(403, "El token no es válido."));
        }
      }
      req.user = user;
      return next();
    });
  } catch (error) {
    return next(createError(500, "Error interno del servidor."));
  }
};

/* Para verificar si el usuario se enecuentra logueado */
export const verifyUser = (req, res, next) => {

    verifyToken(req, res,() => {

        if (!req.user || req.user === " ") {
            return next(createError(401, "Usted no está autenticado"));
            
        }

        if(req.user.id === req.user.id || req.user.isAdmin) {
            
            next()
        } else {
            return next(createError(401, "Usted no esta autorizado - autenticado para realizar esta actulización."));
        }

    });
};

/* Para verificar el usuario si es Administrador */
export const verifyAdmin = (req, res, next) => {

    verifyToken(req, res,() => {

        if(req.user.isAdmin) {
            next()
        } else {
            return next(createError(403, "Usted no esta autorizado!"));
        }

    })
}