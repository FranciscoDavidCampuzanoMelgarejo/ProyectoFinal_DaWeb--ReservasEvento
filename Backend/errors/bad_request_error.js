import { StatusCodes } from 'http-status-codes';
import CustomError from "./custom_error.js";

export default class BadRequestError extends CustomError {
    constructor(mensaje) {
        super(mensaje);
        this.codigoEstado = StatusCodes.BAD_REQUEST;
    }
}