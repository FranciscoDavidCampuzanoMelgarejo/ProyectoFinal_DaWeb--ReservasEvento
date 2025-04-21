import express from "express";
import { checkCampos } from "../middleware/check_campos.js";
import checkToken from "../middleware/check_token.js";
import { isAdministador } from "../middleware/check_permisos.js";
import { crearEvento } from "../controller/evento_controller.js";

const router = express.Router();

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

export default router;
