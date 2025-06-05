import express from "express";
import { checkCampos } from "../middleware/check_campos.js";
import checkToken from "../middleware/check_token.js";
import { isAdministador } from "../middleware/check_permisos.js";
import {
  crearEvento,
  obtenerEventos,
  modificarEvento,
  obtenerEventosDisponibles
} from "../controller/evento_controller.js";

const router = express.Router();

// Crear Evento
router.post(
  "/",
  checkCampos(
    [
      "nombre",
      "descripcion",
      "organizador",
      "plazas",
      "categoria",
      "cancelado",
      "fecha_inicio",
      "fecha_fin",
      "id_espacio",
    ],
    [
      "nombre",
      "descripcion",
      "organizador",
      "plazas",
      "categoria",
      "fecha_inicio",
      "fecha_fin",
      "id_espacio",
    ]
  ),
  checkToken(),
  isAdministador,
  crearEvento
);

// Obtener todos los eventos
router.get("/", checkToken(), obtenerEventos);

// Actualizar evento
router.patch(
  "/:id",
  checkCampos(
    [
      "nombre",
      "descripcion",
      "organizador",
      "plazas",
      "categoria",
      "cancelado",
      "fecha_inicio",
      "fecha_fin",
      "id_espacio",
    ],
    []
  ),
  checkToken(),
  isAdministador,
  modificarEvento
);
//Para obtener eventos activos y no finalizados
router.get("/disponibles", obtenerEventosDisponibles);
export default router;
