import BadRequestError from "../errors/bad_request_error.js";

export function checkCampos(camposValidos, camposRequeridos) {
  return function (req, res, next) {
    /* 
        Primero comprobar si los campos del body
        estan incluidos en los campos validos
    */

    let camposErroneos = [];
    Object.keys(req.body).forEach((campo) => {
      if (!camposValidos.includes(campo)) camposErroneos.push(campo);
    });

    if (camposErroneos.length) {
      const error = `Los siguientes campos no son validos: ${camposErroneos.join(
        ", "
      )}`;
      return next(new BadRequestError(error));
    }

    camposErroneos = [];

    /* 
        Segundo, comprobar que el body contiene los campos
        requeridos 
    */
    camposRequeridos.forEach((campo) => {
      if (
        !Object.keys(req.body).includes(campo) ||
        req.body[campo] === undefined
      )
        camposErroneos.push(campo);
    });

    if (camposErroneos.length) {
      const error = `Los siguientes campos son requeridos: ${camposErroneos.join(
        ", "
      )}`;
      return next(new BadRequestError(error));
    }
    next();
  }
}
