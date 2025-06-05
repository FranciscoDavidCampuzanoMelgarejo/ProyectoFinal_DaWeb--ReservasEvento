export const getEventosDisponibles=()=>{
    return fetch("/api/v1/evento/disponibles",{
        method:"GET",
        credentials:"include"
    });
};