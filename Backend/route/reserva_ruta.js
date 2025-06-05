import express from "express";
import { checkCampos } from "../middleware/check_campos.js";
import checkToken from "../middleware/check_token.js";
import { isAdministador } from "../middleware/check_permisos.js";
import {
  crearReserva,
  obtenerReservas,
  modificarReserva,
  eliminarReserva,
  obtenerTodasLasReservas
} from "../controller/reserva_controller.js";

const router = express.Router();

//Crear Reserva
router.post(
    "/",
    checkCampos(
        [
            "id_evento",
            "plazas_reservadas"
        ],
        [
            "id_evento",
            "plazas_reservadas"
        ]
    ),
    checkToken(),
    crearReserva
);

router.get("/",
    checkToken(),
    obtenerReservas
);

//No se permite modificar el id del evento porque haría la gestion de eventos algo muy complejo
//y tampoco tiene sentido, ya que para eso creas una nueva reserva en el otro evento y eliminas el actual
router.patch(
    "/:id",
    checkCampos(
        [
            "plazas_reservadas"
        ],
        []
    ),
    checkToken(),
    modificarReserva
);

router.delete(
    "/:id",
    checkToken(),
    eliminarReserva
);

router.get("/admin",
    checkToken(),
    isAdministador,
    obtenerTodasLasReservas
);


export default router;