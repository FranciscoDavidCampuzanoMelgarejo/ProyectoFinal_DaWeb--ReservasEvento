import pool from "../db/base_datos.js";
import CustomError from "../errors/custom_error.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not_found_error.js";
import ConflictError from "../errors/conflict_error.js";
import { sentenciaActualizacionSQL, sentenciaInsercionSQL } from "../utils/utils.js";

export async function crearEvento(req, res, next) {
  const idEspacio = req.body.id_espacio;
  const {
    nombre,
    descripcion,
    organizador,
    plazas,
    categoria,
    cancelado,
    fecha_inicio,
    fecha_fin,
  } = req.body;
  let conexion;

  try {
    conexion = await pool.getConnection();

    let [resultado] = await conexion.execute(
      "SELECT capacidad, estado FROM ESPACIO_FISICO WHERE id = ?",
      [idEspacio]
    );

    if (!resultado.length) {
      throw new NotFoundError("No existe el espacio fisico");
    }

    const espacioFisico = resultado[0];

    [resultado] = await conexion.execute(
      `
      SELECT COUNT(*) AS eventos_coincidentes 
      FROM EVENTO e JOIN ESPACIO_FISICO ef ON e.id_espacio = ef.id 
      WHERE e.cancelado = ? AND e.fecha_inicio <= ? AND e.fecha_fin >= ? AND ef.id = ?
      `,
      [false, fecha_fin, fecha_inicio, idEspacio]
    );

    if (!espacioFisico.estado)
      throw new ConflictError("El espacio fisico está cerrado");
    if (espacioFisico.capacidad < plazas)
      throw new ConflictError(
        "La capacidad del espacio fisico es menor que el numero de plazas del evento"
      );
    if (resultado[0].eventos_coincidentes > 0)
      throw new ConflictError("Ya existen eventos para esas fechas");

    const [sentenciaSQL, valores] = sentenciaInsercionSQL("EVENTO", req.body);

    await conexion.query("START TRANSACTION");
    [resultado] = await conexion.execute(sentenciaSQL, valores);
    await conexion.query("COMMIT");

    return res.status(StatusCodes.OK).json({
      id: resultado.insertId,
      nombre,
      descripcion,
      organizador,
      plazas,
      categoria,
      cancelado: Boolean(cancelado),
      fecha_inicio,
      fecha_fin,
      id_espacio: idEspacio,
    });
  } catch (error) {
    if (conexion) await conexion.query("ROLLBACK");
    if (error instanceof CustomError) return next(error);
    return next(new Error(`Error al crear el evento: ${error.message}`));
  } finally {
    if (conexion) conexion.release();
  }
}

export async function obtenerEventos(req, res, next) {
  console.log("OBTENER EVENTOS");
  let conexion;

  try {
    conexion = await pool.getConnection();

    const [eventos] = await conexion.execute(
      `
      SELECT E.*, EF.nombre AS espacio, E.plazas - COALESCE(SUM(R.plazas_reservadas), 0) AS plazas_libres
      FROM EVENTO E
      INNER JOIN ESPACIO_FISICO EF ON E.id_espacio = EF.id
      LEFT JOIN RESERVA R ON R.id_evento = E.id
      GROUP BY E.id
      `);
    // console.log(eventos);

    return res.status(StatusCodes.OK).json({
      num_eventos: eventos.length,
      eventos: eventos.map((e) => {
        return {
          ...e,
          cancelado: Boolean(e.cancelado)
        }
      })
    });
  } catch (error) {
    if (error instanceof CustomError) return next(error);
    return next(
      new Error(`Error al obtener todos los eventos: ${error.message}`)
    );
  } finally {
    if (conexion) conexion.release();
  }
}

export async function modificarEvento(req, res, next) {
  console.log("MODIFICAR EVENTO");
  const id = parseInt(req.params.id);
  const cancelado = req.body.cancelado;

  let conexion;
  try {
    conexion = await pool.getConnection();
    let [resultadoQuery] = await conexion.execute('SELECT * FROM EVENTO WHERE id = ?', [id]);

    if(!resultadoQuery.length) {
      throw new NotFoundError(`No existe el evento con id: ${id}`);
    }

    const evento = resultadoQuery[0];

    const idEspacio = req.body.id_espacio ?? evento.id_espacio;
    const plazas = isNaN(parseInt(req.body.plazas)) ? evento.plazas : parseInt(req.body.plazas);

    [resultadoQuery] = await conexion.execute('SELECT * FROM ESPACIO_FISICO WHERE id = ?', [idEspacio]);

    if(!resultadoQuery.length) {
      throw new NotFoundError(`No existe el espacio fisico con id: ${idEspacio}`);
    }

    const espacio = resultadoQuery[0];

    if(plazas > espacio.capacidad)
      throw new ConflictError('La capacidad del espacio fisico es menor que el numero de plazas del evento');

    const fechaInicio = evento.fecha_inicio;
    if(cancelado && new Date() > fechaInicio)
      throw new ConflictError('El evento no puede cambiar su estado si ya ha terminado o está realizandose');

    if(req.body.fecha_inicio && req.body.fecha_fin) {
      if(new Date(req.body.fecha_inicio) >= new Date(req.body.fecha_fin))
        throw new ConflictError('La fecha de inicio del evento es posterior a la fecha de finalizacion del evento');

      if(new Date() >= new Date(req.body.fecha_inicio)) 
        throw new ConflictError('El evento no puedo cambiar sus fechas si ya ha termiando o está realizandose');
    }

    const[sentenciaSQL, valores] = sentenciaActualizacionSQL('EVENTO', req.body, 'WHERE id = ?', id);

    try {
      await conexion.query('START TRANSACTION');
      [resultadoQuery] = await conexion.execute(sentenciaSQL, valores);
      //para eliminar las reservas asociadas al evento cuando pasa a estar cancelado
      if(req.body.cancelado===true && !evento.cancelado){
        await conexion.execute(`DELETE FROM RESERVA WHERE id_evento = ?`, [id]);
      }
      await conexion.query('COMMIT');
    } catch (error) {
      if(conexion)
        await conexion.query('ROLLBACK');
      throw new Error(`Error al actualizar el evento: ${id}`);
    }
    
    return res.status(StatusCodes.NO_CONTENT)
      .json({})

  } catch (error) {
    if(error instanceof CustomError)
      return next(error);
    return next(new Error(`Error al modificar el evento: ${error.message}`));
    
  } finally {
    if(conexion)
      conexion.release();
  }
}
//para obtener eventos activos y no finalizados
export async function obtenerEventosDisponibles(req, res, next){
  let conexion;
  try{
    conexion = await pool.getConnection();
    //selecciona 
    const [eventos] =await conexion.execute(
      `SELECT e.id, e.nombre, e.fecha_inicio, e.fecha_fin, e.plazas, e.plazas - COALESCE(SUM(r.plazas_reservadas),0) AS plazas_libres
      FROM EVENTO e
      LEFT JOIN RESERVA r ON r.id_evento = e.id
      WHERE e.cancelado=false AND e.fecha_fin > NOW()
      GROUP BY e.id
      `
    );
    return res.status(200).json(eventos);
  }catch (error) {
    if (error instanceof CustomError) return next(error);
    return next(
      new Error(`Error al obtener todos los eventos: ${error.message}`)
    );
  } finally {
    if (conexion) conexion.release();
  }
}