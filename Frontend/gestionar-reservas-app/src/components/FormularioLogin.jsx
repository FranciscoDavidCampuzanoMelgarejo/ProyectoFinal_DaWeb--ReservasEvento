import { useState } from 'react';
import { InputField } from './InputField';
import { Link } from "react-router-dom";
import '../Login.css';
export function FormularioLogin(){
  const[formData, setFormData]=useState({
    usuario:'',
    contraseña:'', 
  });
  const[errors,setErrors]=useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };
  const validar = () => {
    const newErrors = {};
    if (!formData.usuario) {
      newErrors.usuario = 'El nombre de usuario es obligatorio.';
    }
    if (!formData.contraseña) {
      newErrors.contraseña = 'La contraseña es obligatoria.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validar()) {
      console.log('Formulario válido, enviar:', formData);
      //enviar formulario aqui(enviar datos al backend, recibirlos, comparar campos, etc)
    }
  };
    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "rgb(223, 247, 253)" }}>
          <div className="login-container shadow-lg text-center fade-in-up">
            <h2 className="text-center">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-grid-login">
              <InputField type="text" name="usuario" placeholder="Nombre de usuario" value={formData.usuario} onChange={handleChange} error={errors.usuario}/>
              <InputField type="password" name="contraseña" placeholder="Contraseña" value={formData.contraseña} onChange={handleChange} error={errors.contraseña}/>
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary mt-3">Iniciar sesión</button>
              </div>
            </form>
            <p className="register-text mt-3 text-center">
              No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
          </div>
        </div>
      );
}