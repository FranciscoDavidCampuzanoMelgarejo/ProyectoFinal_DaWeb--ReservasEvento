import { StatusCodes, getReasonPhrase } from "http-status-codes";
export default function errorHandler(err, req, res, next) {

    const codigoEstado = err.codigoEstado || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(codigoEstado).json({
        codigo_error: codigoEstado,
        frase_error: getReasonPhrase(codigoEstado),
        mensaje_error: err.message || "Error interno del servidor"
    });
}