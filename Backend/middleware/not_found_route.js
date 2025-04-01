import NotFoundError from "../errors/not_found_error.js";

export default function notFound(req, res, next) {
    return next(new NotFoundError(`No existe la ruta: ${req.path}`));
}