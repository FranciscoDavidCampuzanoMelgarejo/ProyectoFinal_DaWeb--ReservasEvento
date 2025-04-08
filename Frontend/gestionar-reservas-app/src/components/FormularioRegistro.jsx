import { useState } from 'react';
import { InputField } from './InputField';
import { Link } from 'react-router-dom';
import '../Register.css';

export function FormularioRegistro(){
  const[formData, setFormData]=useState({
    nombre:'',
    apellidos:'',
    nombreUsuario:'',
    email:'',
    password:'', 
    confirmarPassword:'',
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
  if(!formData.nombreUsuario){
    newErrors.nombreUsuario='Ingresa un nombre de usuario'
  }
  if(!formData.email || !expRegularCorreo.test(formData.email)){
    newErrors.email='Ingresa un correo valido'
  }
  if(!formData.password){
    newErrors.password='Ingresa una contraseña'
  }
  if (formData.password !== formData.confirmarPassword) {
    newErrors.confirmarPassword = 'Las contraseñas no coinciden.';
  }
  console.log("Errores de validación:", newErrors);
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Intentando enviar el formulario...");
  if (!validacion()) { return;}
  //enviar formulario aqui(nombre apellidos correo contraseña etc)
  const datosParaEnviar={
    nombre:formData.nombre,
    apellidos:formData.apellidos,
    email:formData.email,
    password:formData.password,
    //nombreUsuario:formData.nombreUsuario,
  };
  try{//lo que contiene el try no se si está bien
    const response = await fetch('http://localhost:3000/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(datosParaEnviar),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error al registrar:', error);
      return;
    }

    const data = await response.json();
    console.log('Registro exitoso:', data);
  }catch(error){
    console.error('Error en el registro',error);
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
              <InputField type="text" name="nombreUsuario" placeholder="Nombre de usuario"  value={formData.nombreUsuario} onChange={handleChange} error={errors.nombreUsuario} />
              <InputField type="email" name="email" placeholder="Correo electrónico"  value={formData.email} onChange={handleChange} error={errors.email} />
              <InputField type="password" name="password" placeholder="Contraseña"  value={formData.password} onChange={handleChange} error={errors.password} />
              <InputField type="password" name="confirmarPassword" placeholder="Confirmar contraseña"  value={formData.confirmarPassword} onChange={handleChange} error={errors.confirmarPassword} />
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
