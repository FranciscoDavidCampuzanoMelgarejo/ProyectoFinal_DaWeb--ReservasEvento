import express from "express";
import { isAdministador } from "../middleware/check_permisos.js";
import { checkCampos } from "../middleware/check_campos.js";
import checkToken from "../middleware/check_token.js";
import { crearEspacio, modificarEspacio, listarEspacios , obtenerEspacioPorId, eliminarEspacio} from "../controller/espacio_controller.js";

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

router.get(
  "/:id",
  checkToken(),
  obtenerEspacioPorId
);
// End point para actualizar un espacio fisico
// Propiedades que se pueden cambiar: nombre, capacidad, descripcion, estado
//Voy a poner tmb propietario y direccion pero sino lo queremos lo quitamos y ya (quiero entender que un local puede cambiar de propietario ya sea porq se vende o lo q sea y tambien puede
//cambiar de lugar)
router.patch(
  "/:id",
  checkCampos(["nombre", "propietario", "capacidad","direccion", "descripcion", "estado"], []),
  checkToken(),
  isAdministador,
  modificarEspacio
);

router.get(
  "/",
  checkToken(),
  listarEspacios
);

router.delete(
  "/:id",
  checkToken(),
  isAdministador,
  eliminarEspacio
);
export default router;
