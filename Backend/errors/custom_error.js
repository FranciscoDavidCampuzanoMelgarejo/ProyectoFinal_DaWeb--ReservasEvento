export default class CustomError extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.codigoEstado = null;
    }
}