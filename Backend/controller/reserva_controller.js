import pool from "../db/base_datos.js";
import CustomError from "../errors/custom_error.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not_found_error.js";
import ConflictError from "../errors/conflict_error.js";
import { sentenciaActualizacionSQL, sentenciaInsercionSQL } from "../utils/utils.js";


export async function crearReserva(req, res, next) {
    const idEvento = req.body.id_evento;
    const plazas_reservadas= parseInt(req.body.plazas_reservadas);
    const idUsuario=req.session.usuario.id;
    if(isNaN(plazas_reservadas) || plazas_reservadas <=0){
        return next(new ConflictError("El numero de plazas tiene que ser un número positivo"));
    }
    let conexion;

    try{
        conexion=await pool.getConnection();
        //coalesce se usa para que si no hay plazas reservadas, devuelve 0
        //y el left join permiteunir cada evento con sus posibles reservas
        let[resultado]=await conexion.execute(
            `SELECT e.plazas, e.cancelado, e.fecha_fin, e.fecha_inicio, COALESCE(SUM(r.plazas_reservadas),0) AS plazas_ocupadas
            FROM EVENTO e
            LEFT JOIN RESERVA r ON r.id_evento = e.id
            WHERE e.id=?
            GROUP BY e.id
            `
            ,[idEvento]
        );
        if (!resultado.length) {
              throw new NotFoundError("No existe el evento");
        }
        const evento=resultado[0];
        //comprobaciones de los datos recuperados
        if(evento.cancelado){
            throw new ConflictError("El evento está cancelado");
        }
        if(new Date()>= new Date(evento.fecha_fin)){
            throw new ConflictError("El evento ya ha terminado");
        }
        //El parseInt se hace porque si no lo puede tomar como una concatenacion de String
        const plazas_ocupadas=parseInt(evento.plazas_ocupadas);
        const plazas_disponibles = evento.plazas - plazas_ocupadas;
        if(plazas_disponibles<plazas_reservadas){
            throw new ConflictError("No hay suficientes plazas disponibles");
        }
        //Esto es para que un usuario no pueda reservar mas de una vez en una misma reserva
        const[existe]=await conexion.execute(
            'SELECT id FROM RESERVA WHERE id_usuario = ? AND id_evento = ?',
            [idUsuario,idEvento]
        );
        if(existe.length>0){
            throw new ConflictError("Ya has realizado una reserva sobre este evento");
        }
        
        const datos ={
            id_usuario: idUsuario,
            id_evento: idEvento,
            plazas_reservadas,
            fecha_reserva: new Date()
        };
        const [sentenciaSQL, valores] = sentenciaInsercionSQL("RESERVA", datos);
        
        await conexion.query("START TRANSACTION");
        await conexion.execute(sentenciaSQL, valores);
        await conexion.query("COMMIT");

        return res.status(StatusCodes.CREATED).json({
            mensaje:"Reserva creada correctamente"
        });


    } catch (error) {
        if (conexion) await conexion.query("ROLLBACK");
        if (error instanceof CustomError) return next(error);
        return next(new Error(`Error al crear la reserva: ${error.message}`));
    } finally {
        if (conexion) conexion.release();
    }
}

export async function obtenerReservas(req, res, next){
    console.log("OBTENER RESERVAS");
    const idUsuario = req.session.usuario.id;
    const actual=new Date();
    let conexion;
    try{
        conexion=await pool.getConnection();
        const[activas] = await conexion.execute(
            `SELECT r.*, e.nombre AS nombre_evento, e.fecha_inicio, e.fecha_fin
            FROM RESERVA r
            JOIN EVENTO e on e.id = r.id_evento
            WHERE r.id_usuario = ? AND e.fecha_inicio > ? 
            `, [idUsuario, actual]
        );

        const [anteriores]= await conexion.execute(
            `SELECT r.*, e.nombre AS nombre_evento, e.fecha_inicio, e.fecha_fin
            FROM RESERVA r
            JOIN EVENTO e ON e.id= r.id_evento
            WHERE r.id_usuario = ? AND e.fecha_inicio <= ?
            `, [idUsuario, actual]
            
        );
        return res.status(StatusCodes.OK).json({
            reservas_activas: activas,
            reservas_previas: anteriores
        });
    }catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(
          new Error(`Error al obtener todas las reservas: ${error.message}`)
        );
    } finally {
        if (conexion) conexion.release();
    }
    
}

export async function modificarReserva(req, res, next){
    console.log("MODIFICAR RESERVA");
    const id= parseInt(req.params.id);
    const idUsuario= req.session.usuario.id;
    const nuevasPlazas=parseInt(req.body.plazas_reservadas);

    if(isNaN(nuevasPlazas) || nuevasPlazas <=0){
        return next(new ConflictError("El numero de plazas tiene que ser un número positivo"));
    }
    let conexion;
    try{
        conexion=await pool.getConnection();
        //con la subconsulta es para sumar todas las reservasm hechas para ese evento excepto la actual
        let [resultado]=await conexion.execute(
            `SELECT r.id, r.plazas_reservadas, e.id As id_evento, e.plazas AS capacidad_total, e.fecha_inicio,
            (e.plazas - COALESCE((SELECT SUM(R2.plazas_reservadas) FROM RESERVA R2 WHERE R2.id_evento = e.id AND R2.id !=r.id),0)) AS plazas_disponibles
            FROM RESERVA r
            JOIN EVENTO e ON r.id_evento=e.id
            WHERE r.id = ? AND r.id_usuario= ?
            `,[id, idUsuario]
        );
        if(!resultado.length){
            throw new NotFoundError("No existe la reserva o no pertenece al usuario");
        }
        const reserva=resultado[0];
        if(new Date()>= new Date(reserva.fecha_inicio)){
            throw new ConflictError("No se puede modificar una reserva de un evento que ya ha comenzado");
        }
        
        const [resul] = await conexion.execute(
            `SELECT COALESCE(SUM(plazas_reservadas),0) AS total_reservadas
            FROM RESERVA
            WHERE id_evento = ? AND id != ?`,
            [reserva.id_evento,id]
        );
        const plazasReservadasPorOtros=parseInt(resul[0].total_reservadas);
        const totalOcupadasModificandolo=plazasReservadasPorOtros + nuevasPlazas;
        console.log({
            id,
            idUsuario,
            nuevasPlazas,
            plazasReservadasPorOtros,
            totalOcupadasModificandolo,
            capacidad: reserva.capacidad_total,
        });
        if(totalOcupadasModificandolo>reserva.capacidad_total){
            throw new ConflictError("No hay suficientes plazas");
        }

        const campos ={
            plazas_reservadas:nuevasPlazas
        };
        const [sentenciaSQL, valores]= sentenciaActualizacionSQL("RESERVA", campos, "WHERE id=?", id);
        await conexion.query("START TRANSACTION");
        await conexion.execute(sentenciaSQL, valores);
        await conexion.query("COMMIT");
        return res.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
        if (conexion) await conexion.query("ROLLBACK");
        if (error instanceof CustomError) return next(error);
        return next(new Error(`Error al modificar la reserva: ${error.message}`));
    } finally {
        if (conexion) conexion.release();
    }
}

export async function eliminarReserva(req, res, next){
    console.log("ELIMINAR RESERVA");
    const id= parseInt(req.params.id);
    const idUsuario= req.session.usuario.id;
    let conexion;
    try{
        conexion=await pool.getConnection();
        const usuario = req.session.usuario;
        const[resultado]= await conexion.execute(
            `SELECT r.id, r.id_usuario, e.fecha_inicio
            FROM RESERVA r
            JOIN EVENTO e ON e.id = r.id_evento
            WHERE r.id = ?
            `, [id]
        );

    if (!resultado.length) {
      throw new NotFoundError("La reserva no existe");
    }
    const{id_usuario, fecha_inicio}=resultado[0];
    if(usuario.rol!== "ADMINISTRADOR" && usuario.id !==id_usuario){
        throw new ConflictError("No tienes permisos para eliminar la reserva");
    }
    if(new Date()>= new Date(fecha_inicio)){
        throw new ConflictError("No se puede anular una reserva de un evento que ya ha comenzado");
    }
    await conexion.query("START TRANSACTION");
    await conexion.execute("DELETE FROM RESERVA WHERE id = ?",[id]);
    await conexion.query("COMMIT"); 
    return res.status(StatusCodes.NO_CONTENT).end();

    } catch (error) {
        if (conexion) await conexion.query("ROLLBACK");
        if (error instanceof CustomError) return next(error);
        return next(new Error(`Error al eliminar la reserva: ${error.message}`));
    } finally {
        if (conexion) conexion.release();
    }
}
//Para que el administrador pueda ver todas las reservas de todos los usuarios
export async function obtenerTodasLasReservas(req, res, next){
    let conexion;
    try{
        conexion=await pool.getConnection();
        const [reservas]=await conexion.execute(
            `SELECT r.id, r.plazas_reservadas, r.fecha_reserva, e.nombre AS nombre_evento, e.fecha_inicio, e.fecha_fin, u.email AS email_usuario
            FROM RESERVA r
            JOIN EVENTO e ON e.id = r.id_evento 
            JOIN USUARIO u ON u.id = r.id_usuario
            `
        );
        return res.status(StatusCodes.OK).json({
            total: reservas.length, reservas
        });
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new Error(`Error al obtener todas las reservas: ${error.message}`));
    } finally {
        if (conexion) conexion.release();
    }
}
