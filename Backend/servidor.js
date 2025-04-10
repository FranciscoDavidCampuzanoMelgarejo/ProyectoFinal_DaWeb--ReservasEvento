import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import 'dotenv/config';

/* Importar middleware de gestion de errores */
import errorHandler from "./middleware/error_handler.js";
import notFound from "./middleware/not_found_route.js";

/* Importar el router de usuario */
import usuario_ruta from './route/usuario_ruta.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use('/api/v1/user', usuario_ruta);


app.use(notFound, errorHandler);

const puerto = process.env.PUERTO_SERVIDOR || 8080;
app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`)
});