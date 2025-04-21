import { StatusCodes } from "http-status-codes";
import CustomError from "./custom_error.js";

export default class ForbiddenError extends CustomError {
    constructor(mensaje) {
        super(mensaje);
        this.codigoEstado = StatusCodes.FORBIDDEN;
    }
}