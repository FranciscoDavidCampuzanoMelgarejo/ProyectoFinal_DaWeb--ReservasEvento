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
    const usuario = req.session.usuario;
    return res.status(StatusCodes.OK)
        .json({
            id: usuario.id,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            rol: usuario.rol
        })
})

router.post('/refresh', checkToken('refresh_token'), refreshToken);

router.get('/protegida', checkToken(), (req, res) => {
    console.log("RUTA PROTEGIDA");
    
    res.send('<h1>Ruta protegida</h1>');
});

export default router;