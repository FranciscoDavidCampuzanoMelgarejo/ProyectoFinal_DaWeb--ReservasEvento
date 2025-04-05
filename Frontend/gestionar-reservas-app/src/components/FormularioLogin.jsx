import { Link } from "react-router-dom";

export function FormularioLogin() {

    return(
        <form id="formularioLogin" className="form-login p-5 border border-dark">
            {/* PONER LOS CAMPOS DEL FORMULARIO */}
            {/* PONER BOTON PARA INICIAR SESION */}
            <div>
                <span>¿Necesitas una cuenta?</span>
                <Link to='/register'>Registrarse</Link>
            </div>
        </form>
    );
}