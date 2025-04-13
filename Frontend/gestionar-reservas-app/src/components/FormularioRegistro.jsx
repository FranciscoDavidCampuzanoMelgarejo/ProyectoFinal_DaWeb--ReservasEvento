import { useState } from 'react';
import { InputField } from './InputField';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../Register.css';

export function FormularioRegistro(){
  const navigate = useNavigate();
  const[formData, setFormData]=useState({
    nombre:'',
    apellidos:'',
    email:'',
    password:'', 
    confirmarPassword:'',
  });

const[errors,setErrors]=useState({});
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  setErrors({ ...errors, [e.target.name]: '' });
};
const handleBlur = (e) => {
  const { name, value } = e.target;
  const newErrors = { ...errors };
  const expRegularNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const expRegularCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  switch (name) {
    case 'nombre':
      if(!value || !expRegularNombre.test(value)){
        newErrors.nombre='Ingresa un nombre válido';
      }
      break;
    case 'apellidos':
      if(!value || !expRegularNombre.test(value)){
        newErrors.apellidos='Ingresa un apellido válido';
      }
      break;
    case 'email':
      if (!value || !expRegularCorreo.test(value)){
        newErrors.email='Ingresa un correo válido';
      }
      break;
    case 'password':
      if(!value){
        newErrors.password='Ingresa una contraseña';
      }
      break;
    case 'confirmarPassword':
      if(value !== formData.password){
        newErrors.confirmarPassword='Las contraseñas no coinciden';
      }
      break;
    default:
      break;
  }
  setErrors(newErrors);
};
const validacion=()=>{
  const newErrors={};
  const expRegularNombre=/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const expRegularCorreo=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!formData.nombre || !expRegularNombre.test(formData.nombre)){
    newErrors.nombre='Ingresa un nombre valido'
  }
  if(!formData.apellidos || !expRegularNombre.test(formData.apellidos)){
    newErrors.apellidos='Ingresa un apellido valido'
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
    const response = await fetch('/api/v1/user/register', {
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
    navigate('/login');
  }catch(error){
    console.error('Error en el registro',error);
  }
};

    return (
      
          <div className="register-container shadow-lg text-center fade-in-up">
            <h2 className="text-center">Crear una cuenta</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-grid-custom">
              <div className="nombre">
                <InputField type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} onBlur={handleBlur} error={errors.nombre} />
              </div>
              <div className="apellidos">
                <InputField type="text" name="apellidos" placeholder="Apellidos"  value={formData.apellidos} onChange={handleChange} onBlur={handleBlur} error={errors.apellidos} />
              </div>
              <div className="email">
                <InputField type="email" name="email" placeholder="Correo electrónico"  value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
              </div>
              <div className="password">
                <InputField type="password" name="password" placeholder="Contraseña"  value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} />
              </div>
              <div className="confirmar">
                <InputField type="password" name="confirmarPassword" placeholder="Confirmar contraseña"  value={formData.confirmarPassword} onChange={handleChange} onBlur={handleBlur} error={errors.confirmarPassword} />
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary mt-3">Registrarme</button>
            </div>
            </form>
            <p className="login-text mt-3 text-center">
              Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        
      );
    }
