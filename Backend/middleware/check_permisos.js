import ForbiddenError from "../errors/forbidden_error.js";

const enumRol = {
    CLIENTE: 'CLIENTE',
    ADMINISTRADOR: 'ADMINISTRADOR'
}

export function isAdministador(req, res, next) {
    const usuario = req.session.usuario;
    
    if(usuario !== null && usuario.rol === enumRol.ADMINISTRADOR)
        return next();
    return next(new ForbiddenError(`El usuario no es administrador`));
}