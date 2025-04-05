import { Link } from 'react-router-dom';

export function FormularioRegistro() {
    return(
        <form id='formularioRegistro' className='form-registro p-5 border border-dark'>
            {/* CAMPOS PARA EL FORMULARIO */}
            {/* BOTON PARA REGISTRAR A UN USUARIO */}
            <div>
                <Link to='/login'>¿Ya tienes una cuenta?</Link>
            </div>
        </form>
    );
}