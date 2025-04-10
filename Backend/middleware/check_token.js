import UnauthorizedError from "../errors/unauthorized_error.js";
import jwt from "jsonwebtoken";

// Token de acceso: access_token
// Token de refresco: refresh_token
export default function checkToken(tokenName = 'access_token') {
  return function (req, res, next) {
    console.log("COMPROBANDO TOKEN");
    req.session = {
      usuario: null,
    }

    const token = req.cookies[tokenName];
    if (!token) return next(new UnauthorizedError("Usuario no autorizado"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRETO);
      req.session.usuario = {
        id: payload.id,
        nombre: payload.nombre,
        rol: payload.rol
      }

      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError")
        return next(new UnauthorizedError("El token ha expirado"));
      if (error.name === "JsonWebTokenError")
        return next(new UnauthorizedError("El token no es valido"));
      return next(
        new Error(`Error la decodificar el token de acceso: ${error.message}`)
      );
    }
  }
}