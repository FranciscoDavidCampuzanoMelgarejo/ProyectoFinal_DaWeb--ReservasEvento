import express from "express";

/* Importamos los middlewares */
import { checkCampos } from "../middleware/check_campos.js";
import checkToken from "../middleware/check_token.js";

/* Importamos los controladores */
import { registrar, login, logout, refreshToken } from "../controller/usuario_controller.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.post('/register', checkCampos(['nombre', 'apellidos', 'email', 'password'], ['nombre', 'apellidos', 'email', 'password']), registrar);
router.post('/login', checkCampos(['email', 'password'], ['email', 'password']), login);
router.post('/logout', checkToken(), logout);

router.post('/check-auth', checkToken(), (req, res) => {
    console.log("CHECK-AUTH");
    return res.status(StatusCodes.NO_CONTENT).end();
})

router.post('/refresh', checkToken('refresh_token'), refreshToken);

router.get('/protegida', checkToken(), (req, res) => {
    console.log("RUTA PROTEGIDA");
    
    res.send('<h1>Ruta protegida</h1>');
});

export default router;