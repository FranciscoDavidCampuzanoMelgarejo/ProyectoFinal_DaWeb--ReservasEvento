import pool from "../db/base_datos.js";
import CustomError from "../errors/custom_error.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not_found_error.js";
import ConflictError from "../errors/conflict_error.js";
import { sentenciaInsercionSQL } from "../utils/utils.js";

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
    console.log(eventos);

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
