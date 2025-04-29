// Esta funcion se encarga de realizar la peticion FETCH
// que le pasan como callback.
// Primero, realiza la peticion, si todo ha ido bien devuelve el resultado del fetch
// Si se devuelve un 401 (no autorizado), entonces el refresh token ha caducado o no es valido, así que se busca
// renovarlo (refresh)
// Si se ha podido renovar el access token, entonces se vuelve a hacer la peticion
// Si no se ha podido renovar, entonces notificar el error para redirigir al login

import CustomError from "../errors/CustomError.js";

export async function checkAuth (callback) {
    try {
        let respuestaCallback = await callback(); // Este callback debe ser un FETCH al servidor
        if(respuestaCallback.ok)
            return respuestaCallback;

        if(respuestaCallback.status === 401) {
            // PETICION A /refresh     
                const respuestaRefresh = await fetch('/api/v1/user/refresh', {
                    method: 'POST',
                    credentials: "include"
                })

                if(!respuestaRefresh.ok) {
                    // Lanzar error para redirigir al login
                    throw new CustomError('El token de acceso no se ha podido renovar', 401);
                }

                // Reintentar la peticion original
                respuestaCallback = await callback();
                return respuestaCallback
        }
        throw new CustomError('Error en la peiticion', respuestaCallback.status);
    } catch (error) {
        if(error instanceof CustomError) {
            throw error;
        }
            
        throw new CustomError('Error interno del servidor', 500);
    }
}