import pool from "../db/base_datos.js";
import { StatusCodes } from "http-status-codes";
import { sentenciaActualizacionSQL, sentenciaInsercionSQL } from "../utils/utils.js";

export async function crearEspacio(req, res, next) {
  // 1. Recuperar los campos del req.body
  // 2. Obtener una conexion con la base de datos
  // 3. Crear el espacio en base de datos

  let { nombre, propietario, capacidad, direccion, descripcion, estado } = req.body;
  if (estado === 'ACTIVO') {
    estado = 1;
  } else if (estado === 'CERRADO') {
    estado = 0;
  } else {
    estado = 1;
  }
  capacidad = Number(capacidad);
  if (isNaN(capacidad)) {
    return next(new Error('La capacidad debe ser un número'));
  }
  const datos = { nombre, propietario, capacidad, direccion, descripcion, estado };
  const [sentenciaSQL, valores] = sentenciaInsercionSQL('ESPACIO_FISICO', datos);
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
            estado
        });

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
    const estadoNuevo=req.body.estado;
    let cerrarEspacio=false;
    let eventosActivos=[];
  
    if(estadoNuevo!== undefined){
      if( estadoNuevo===0 || estadoNuevo==="CERRADO"){
          req.body.estado=0;
          cerrarEspacio=true;
      }else if(estadoNuevo==="ACTIVO" || estadoNuevo===1){
          req.body.estado=1;
        } 
    } 
    

    let conexion;
    try {
        conexion = await pool.getConnection();

        if(cerrarEspacio){
          [eventosActivos]=await conexion.execute(
            `SELECT id FROM EVENTO WHERE id_espacio= ? AND cancelado=false AND fecha_fin>NOW()`,
            [id]
          );
        }
        if(eventosActivos.length>0){
          return res.status(StatusCodes.CONFLICT).json({
            mensaje:"No se puede cerrar el espacio fisico porque hay eventos activos que lo estan usando"
          });
        }
        
        const[sentenciaSQL, valores]= sentenciaActualizacionSQL("ESPACIO_FISICO",req.body, "WHERE id=?",id);
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

export async function listarEspacios(req, res, next) {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const [espacios] = await conexion.query('SELECT * FROM ESPACIO_FISICO');

    return res.status(StatusCodes.OK).json(espacios);
  } catch (error) {
    return next(new Error(`Error al listar los espacios físicos: ${error.message}`));
  } finally {
    if (conexion) conexion.release();
  }
}

export async function eliminarEspacio(req, res, next) {
  const { id } = req.params;

  let conexion;
  try {
    conexion = await pool.getConnection();
    await conexion.query("START TRANSACTION");
    await conexion.execute('DELETE FROM ESPACIO_FISICO WHERE id = ?', [id]);
    await conexion.query("COMMIT");

    return res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    if (conexion) await conexion.query('ROLLBACK');
    return next(new Error(`Error al eliminar espacio físico: ${error.message}`));
  } finally {
    if (conexion) conexion.release();
  }
}


export async function obtenerEspacioPorId(req, res, next) {
  const { id } = req.params;

  let conexion;
  try {
    conexion = await pool.getConnection();
    const [espacios] = await conexion.query(
      'SELECT * FROM ESPACIO_FISICO WHERE id = ?',
      [id]
    );

    if (espacios.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ mensaje: 'Espacio no encontrado' });
    }

    return res.status(StatusCodes.OK).json(espacios[0]);
  } catch (error) {
    return next(new Error(`Error al obtener el espacio físico: ${error.message}`));
  } finally {
    if (conexion) conexion.release();
  }
}