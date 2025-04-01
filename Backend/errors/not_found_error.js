import { StatusCodes } from "http-status-codes";
import CustomError from "./custom_error.js";

export default class NotFoundError extends CustomError {
    constructor(mensaje) {
        super(mensaje);
        this.codigoEstado = StatusCodes.NOT_FOUND;
    }
}