import pool from "../db/base_datos.js";
import { StatusCodes } from "http-status-codes";
import { sentenciaActualizacionSQL, sentenciaInsercionSQL } from "../utils/utils.js";

export async function crearEspacio(req, res, next) {
  // 1. Recuperar los campos del req.body
  // 2. Obtener una conexion con la base de datos
  // 3. Crear el espacio en base de datos

  const { nombre, propietario, capacidad, direccion, descripcion, estado } = req.body;

  const [sentenciaSQL, valores] = sentenciaInsercionSQL('ESPACIO_FISICO', req.body);
  console.log(sentenciaSQL);
  console.log(valores);

  let conexion;
  try {
    conexion = await pool.getConnection();

    await conexion.query("START TRANSACTION");
    const [resultado] = await conexion.execute(sentenciaSQL, valores);
    await conexion.query('COMMIT');

    return res.status(StatusCodes.CREATED)
        .json({
            id: resultado.insertId,
            nombre,
            propietario,
            capacidad,
            direccion,
            descripcion,
            estado: Boolean(estado)
        })

  } catch (error) {
    if(conexion) {
        await conexion.query('ROLLBACK');
        return next(new Error('Error al insertar el espacio fisico en base de datos'));
    }
    return next(new Error(`Error al crear el espacio fisico: ${error.message}`));
  } finally {
    if (conexion) conexion.release();
  }
}

export async function modificarEspacio(req, res, next) {
    // 1. Obtener el id del espacio a modificar (req.params)
    // 2. Obtener los campos que se quieren modificar (tiene que haber alguno)
    // 3. Actualizar los campos
    console.log("ACTUALIZANDO ESPACIO FISICO");
    const { id } = req.params;
    // const {nombre, capacidad, descripcion, estado} = req.body;
    const [sentenciaSQL, valores] = sentenciaActualizacionSQL('ESPACIO_FISICO', req.body, 'WHERE id = ?', id);
    console.log(sentenciaSQL);
    console.log(valores);

    let conexion;
    try {
        conexion = await pool.getConnection();

        await conexion.query('START TRANSACTION');
        const [resultado] = await conexion.execute(sentenciaSQL, valores);
        await conexion.query('COMMIT');
        
        console.log(resultado);
        return res.status(StatusCodes.NO_CONTENT)
          .end();
        
    } catch (error) {
      if(conexion) {
        await conexion.query('ROLLBACK');
        return next(new Error(`Error al actualizar el espacio físico en base de datos: ${id}`));
      }
      return next(new Error(`Error al modificar el espacio fisicio: ${error.message}`));
        
    } finally {
        if (conexion)
            conexion.release();
    }
}
