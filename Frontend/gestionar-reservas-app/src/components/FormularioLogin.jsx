import { useState } from 'react';
import { InputField } from './InputField';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import '../Login.css';
export function FormularioLogin(){
  const navigate = useNavigate();
  const[formData, setFormData]=useState({
    email:'',
    password:'', 
  });
  const[errors,setErrors]=useState({});
  const [mensajeError, setMensajeError] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };
  const handleBlur=(e)=>{
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if(name === 'email' && !value){
      newErrors.email = 'El correo electrónico es obligatorio.';
    }
    if(name === 'password' && !value){
      newErrors.password = 'La contraseña es obligatoria.';
    }
    setErrors(newErrors);
  };

  const validar = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validar()) {
      console.log('Formulario válido, enviar:', formData);
      //enviar formulario aqui(enviar datos al backend, recibirlos, comparar campos, etc)
      const datosParaEnviar={
        email:formData.email,
        password:formData.password,
        //nombreUsuario:formData.nombreUsuario,
      };
      try{//lo que contiene el try no se si está bien
        const response = await fetch('/api/v1/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(datosParaEnviar),
        });
    
        if (!response.ok) {
          const error = await response.json();
          console.error('Error al iniciar sesión:', error);
          setMensajeError(error.message || 'Correo o contraseña incorrectos.');
          return;
        }
    
        const data = await response.json();
        console.log('Inicio de sesión exitoso:', data);
        navigate('/');
      }catch(error){
        console.error('Error en el inicio de sesión',error);
      }
    }
  };
    return (
      
          <div className="login-container shadow-lg text-center fade-in-up">
            <h2 className="text-center">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-grid-login">
              <InputField type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email}/>
              <InputField type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password}/>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary mt-3">Iniciar sesión</button>
              </div>
                {mensajeError && (<div className="mensaje-error-login mt-2">{mensajeError}</div>)}
            </form>
            <p className="register-text mt-3 text-center">
              No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
          </div>
       
      );
}