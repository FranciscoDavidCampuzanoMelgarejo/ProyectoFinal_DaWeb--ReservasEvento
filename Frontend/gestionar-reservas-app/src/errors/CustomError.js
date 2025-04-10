export default class CustomError extends Error {
    constructor(mensaje, codigoEstado) {
        super(mensaje)
        this.codigoEstado = codigoEstado || null
    }
}