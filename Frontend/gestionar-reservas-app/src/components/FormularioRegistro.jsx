import { useState } from 'react';
import { InputField } from './InputField';
import { Link } from 'react-router-dom';
import '../Register.css';

export function FormularioRegistro(){
  const[formData, setFormData]=useState({
    nombre:'',
    apellidos:'',
    usuario:'',
    email:'',
    contraseña:'', 
    confirmarContraseña:'',
  });

const[errors,setErrors]=useState({});
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  setErrors({ ...errors, [e.target.name]: '' });
};
const validacion=()=>{
  const newErrors={};
  const expRegularNombre=/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const expRegularCorreo=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!formData.nombre || !expRegularNombre.test(formData.nombre)){
    newErrors.nombre='Ingresa un nombre valido(solo letras)'
  }
  if(!formData.apellidos || !expRegularNombre.test(formData.apellidos)){
    newErrors.apellidos='Ingresa un apellido valido(solo letras)'
  }
  if(!formData.usuario){
    newErrors.usuario='Ingresa un nombre de usuario'
  }
  if(!formData.email || !expRegularCorreo.test(formData.email)){
    newErrors.email='Ingresa un correo valido'
  }
  if(!formData.contraseña){
    newErrors.contraseña='Ingresa una contraseña'
  }
  if (formData.contraseña !== formData.confirmarContraseña) {
    newErrors.confirmarContraseña = 'Las contraseñas no coinciden.';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const handleSubmit = (e) => {
  e.preventDefault();
  if (validacion()) {
    console.log('Formulario válido, enviar:', formData);
    //enviar formulario aqui(nombre apellidos correo contraseña etc)
  }
};

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "rgb(223, 247, 253)" }}>
          <div className="register-container shadow-lg text-center fade-in-up">
            <h2 className="text-center">Crear una cuenta</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-grid-custom">
              <InputField type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} error={errors.nombre} />
              <InputField type="text" name="apellidos" placeholder="Apellidos"  value={formData.apellidos} onChange={handleChange} error={errors.apellidos} />
              <InputField type="text" name="usuario" placeholder="Nombre de usuario"  value={formData.usuario} onChange={handleChange} error={errors.usuario} />
              <InputField type="email" name="email" placeholder="Correo electrónico"  value={formData.email} onChange={handleChange} error={errors.email} />
              <InputField type="password" name="contraseña" placeholder="Contraseña"  value={formData.contraseña} onChange={handleChange} error={errors.contraseña} />
              <InputField type="password" name="confirmarContraseña" placeholder="Confirmar contraseña"  value={formData.confirmarContraseña} onChange={handleChange} error={errors.confirmarContraseña} />
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary mt-3">Registrarme</button>
            </div>
            </form>
            <p className="login-text mt-3 text-center">
              Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
            </p>
          </div>
        </div>
      );
    }
