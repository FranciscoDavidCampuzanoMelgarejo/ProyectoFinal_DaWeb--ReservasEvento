import express from "express";
import { isAdministador } from "../middleware/check_permisos.js";
import { checkCampos } from "../middleware/check_campos.js";
import checkToken from "../middleware/check_token.js";
import { crearEspacio, modificarEspacio } from "../controller/espacio_controller.js";

const router = express.Router();

router.post(
  "/",
  checkCampos(
    [
      "nombre",
      "propietario",
      "capacidad",
      "direccion",
      "descripcion",
      "estado",
    ],
    ["nombre", "propietario", "capacidad", "direccion", "descripcion"]
  ),
  checkToken(),
  isAdministador,
  crearEspacio
);

// End point para actualizar un espacio fisico
// Propiedades que se pueden cambiar: nombre, capacidad, descripcion, estado
router.patch(
  "/:id",
  checkCampos(["nombre", "capacidad", "descripcion", "estado"], []),
  checkToken(),
  isAdministador,
  modificarEspacio
);

export default router;
