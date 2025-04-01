import CustomError from "./custom_error.js";
import { StatusCodes } from "http-status-codes";

export default class ConflictError extends CustomError {
    constructor(mensaje) {
        super(mensaje);
        this.codigoEstado = StatusCodes.CONFLICT;
    }
}