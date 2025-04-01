import UnauthorizedError from "../errors/unauthorized_error.js";
import jwt from 'jsonwebtoken';


export default function checkTokenAcceso(req, res, next) {
    req.sesion = {
        usuario: null
    };

    const tokenAcceso = req.cookies.access_token;
    if(!tokenAcceso)
        return next(new UnauthorizedError('Usuario no autorizado'));

    try {
        const payload = jwt.verify(tokenAcceso, process.env.JWT_SECRETO);
        req.sesion.usuario = {
            id: payload.id,
            nombre: payload.nombre,
            rol: payload.rol
        }
        return next();
    } catch (error) {
        if(error.name === 'TokenExpiredError')
            return next(new UnauthorizedError('El token ha expirado'));
        if(error.name === 'JsonWebTokenError')
            return next(new UnauthorizedError('El token no es valido'));
        return next(new Error(`Error la decodificar el token de acceso: ${error.message}`));
    }
}