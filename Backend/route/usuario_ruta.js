import express from "express";


/* Importamos los middlewares */
import { checkCampos } from "../middleware/check_campos.js";
import checkTokenAcceso from "../middleware/check_token.js";

/* Importamos los controladores */
import { registrar, login, logout } from "../controller/usuario_controller.js";

const router = express.Router();

router.post('/register', checkCampos(['nombre', 'apellidos', 'email', 'password'], ['nombre', 'apellidos', 'email', 'password']), registrar);
router.post('/login', checkCampos(['email', 'password'], ['email', 'password']), login);
router.post('/logout', checkTokenAcceso, logout);

router.get('/protegida', checkTokenAcceso, (req, res) => {
    console.log("RUTA PROTEGIDA");
    
    res.send('<h1>Ruta protegida</h1>');
});

export default router;