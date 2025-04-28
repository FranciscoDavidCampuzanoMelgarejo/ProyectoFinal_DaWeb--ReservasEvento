import pool from "../db/base_datos.js";
import CustomError from "../errors/custom_error.js";
import ConflictError from "../errors/conflict_error.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not_found_error.js";
import jwt from "jsonwebtoken";

export async function registrar(req, res, next) {
  const { nombre, apellidos, email, password } = req.body;

  let conexion;

  try {
    conexion = await pool.getConnection();

    let resultadoQuery;

    try {
      [resultadoQuery] = await conexion.execute(
        "SELECT COUNT(*) as usuario_existente FROM USUARIO WHERE email = ?",
        [email]
      );
    } catch (error) {
      throw new Error(
        `Error al consultar a la base de datos: ${error.message}`
      );
    }

    if (resultadoQuery[0].usuario_existente > 0)
      throw new ConflictError("El correo electronico ya esta usado");

    let passwordCifrada;

    try {
      passwordCifrada = await bcrypt.hash(password, 10);
    } catch (error) {
      throw new Error(`Error al cifrar la contraseña: ${error.message}`);
    }

    try {
      await conexion.query("START TRANSACTION");

      [resultadoQuery] = await conexion.execute(
        "INSERT INTO USUARIO (nombre, apellidos, email, password) VALUES (?, ?, ?, ?)",
        [nombre, apellidos, email, passwordCifrada]
      );
      await conexion.query("COMMIT");
    } catch (error) {
      if (conexion) await conexion.query("ROLLBACK");
      throw new Error(
        `Error insertando al usuario en base de datos: ${error.message}`
      );
    }

    return res.status(StatusCodes.CREATED).json({
      id: resultadoQuery.insertId,
      nombre,
      apellidos,
      // Email opcional
    });
  } catch (error) {
    if (error instanceof CustomError) return next(error);
    return next(new Error(`Error al registar usuario: ${error.message}`));
  } finally {
    if (conexion) conexion.release();
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  let conexion;

  try {
    conexion = await pool.getConnection();

    let resultadoQuery;

    try {
      [resultadoQuery] = await conexion.execute(
        "SELECT * FROM USUARIO WHERE email = ?",
        [email]
      );
    } catch (error) {
      throw new Error(
        `Error al consultar a la base de datos: ${error.message}`
      );
    }

    if (!resultadoQuery.length)
      throw new NotFoundError("No existe ningun usuario con esas credenciales");

    const usuario = resultadoQuery[0];
    let match;

    try {
      match = await bcrypt.compare(password, usuario.password);
    } catch (error) {
      throw new Error(`Error al comparar contraseñas: ${error.message}`);
    }

    if (!match)
      throw new NotFoundError("No existe ningun usuario con esas credenciales");

    let tokenAcceso, tokenRefresco;
    try {
      tokenAcceso = jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, apellidos: usuario.apellidos, rol: usuario.rol },
        process.env.JWT_SECRETO,
        {
          expiresIn: "1h",
        }
      );

      tokenRefresco = jwt.sign({ id: usuario.id }, process.env.JWT_SECRETO, {
        expiresIn: 3 * 30 * 24 * 3600,
      });
    } catch (error) {
      throw new Error(`No se pudo generar el token: ${error.message}`);
    }

    return res
      .status(StatusCodes.OK)
      .cookie("access_token", tokenAcceso, {
        httpOnly: true,
        secure: false,
        maxAge: 3600 * 1000, // En milisegundos
        sameSite: "strict",
      })
      .cookie("refresh_token", tokenRefresco, {
        httpOnly: true,
        secure: false,
        maxAge: 3 * 30 * 24 * 3600 * 1000, // En milisegundos
        sameSite: "strict",
      })
      .json({
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        rol: usuario.rol,
      });
  } catch (error) {
    if (error instanceof CustomError) return next(error);
    return next(new Error(`Error al iniciar sesion: ${error.message}`));
  } finally {
    if (conexion) conexion.release();
  }
}

export function logout(req, res, next) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.status(StatusCodes.OK).json({
    mensaje: "Cerrando sesion con exito",
  });
}

export async function refreshToken(req, res, next) {
  const { id } = req.session.usuario;
  let conexion;

  try {
    conexion = await pool.getConnection();

    const [resultadoQuery] = await conexion.execute(
      "SELECT nombre, rol FROM USUARIO WHERE id = ?",
      [id]
    );
    if (!resultadoQuery.length) throw new NotFoundError("No existe el usuario");

    const usuario = resultadoQuery[0];
    let tokenAcceso;
    try {
      tokenAcceso = jwt.sign(
        { id, nombre: usuario.nombre, rol: usuario.rol },
        process.env.JWT_SECRETO,
        {
          expiresIn: "1h",
        }
      );
    } catch (error) {
      throw new Error(`No se pudo generar el token: ${error.message}`);
    }

    return res
      .status(StatusCodes.OK)
      .cookie("access_token", tokenAcceso, {
        httpOnly: true,
        secure: false,
        maxAge: 3600 * 1000,
        sameSite: "strict",
      })
      .json({ ok: true });
  } catch (error) {
    if (error instanceof CustomError) return next(error);
    return next(new Error(`Error al refrescar el token de acceso`));
  } finally {
    if (conexion) conexion.release();
  }
}
