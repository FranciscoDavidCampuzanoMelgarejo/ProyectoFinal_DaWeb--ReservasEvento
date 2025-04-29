import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CrearEspacio() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    propietario: '',
    capacidad: '',
    direccion: '',
    descripcion: '',
    estado: 'ACTIVO'
  });
  const [errores, setErrores] = useState({});
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: '' });
  };

  const validacion = () => {
    const nuevosErrores = {};
    if (!formData.nombre){
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }
    if (!formData.propietario){
      nuevosErrores.propietario = 'El propietario es obligatorio';
    } 
    if (!formData.capacidad || isNaN(formData.capacidad)){
      nuevosErrores.capacidad = 'Capacidad inválida';
    } 
    if (!formData.direccion){
      nuevosErrores.direccion = 'La dirección es obligatoria';
    } 
    if (!formData.descripcion){
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    } 
    if (!formData.estado){
      nuevosErrores.estado = 'El estado es obligatorio';
    } 
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validacion()) return;
    const datosParaEnviarNuevoEspacio={
      nombre: formData.nombre,
      propietario: formData.propietario,
      capacidad: Number(formData.capacidad),
      direccion: formData.direccion,
      descripcion: formData.descripcion,
      estado: formData.estado
    };
    try {
      const response = await fetch('/api/v1/espacio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datosParaEnviarNuevoEspacio)
      });
      if (!response.ok) {
        console.error('Error al crear espacio');
        return;
      }
      const data = await response.json();
      console.log('Espacio creado:', data);
      alert('¡Espacio creado con éxito!');
      navigate('/espacios');
    } catch (err) {
      console.error('Error de red al crear espacio:', err);
    }
  };

  return (
    <div className="container">
      <h2>Crear nuevo espacio físico</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {[
          { label: 'Nombre', name: 'nombre', type: 'text' },
          { label: 'Propietario', name: 'propietario', type: 'text' },
          { label: 'Capacidad', name: 'capacidad', type: 'number' },
          { label: 'Dirección', name: 'direccion', type: 'text' },
          { label: 'Descripción', name: 'descripcion', type: 'text' }
        ].map(({ label, name, type }) => (
          <div className="mb-3" key={name}>
            <label className="form-label">{label}</label>
            <input type={type} className={`form-control ${errores[name] ? 'is-invalid' : ''}`} name={name} value={formData[name]} onChange={handleChange}/>
            {errores[name] && <div className="invalid-feedback">{errores[name]}</div>}
          </div>
        ))}
        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select name="estado" className={`form-select ${errores.estado ? 'is-invalid' : ''}`} value={formData.estado} onChange={handleChange}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="CERRADO">CERRADO</option>
          </select>
          {errores.estado && <div className="invalid-feedback">{errores.estado}</div>}
        </div>
        <button type="submit" className="btn btn-success">Crear espacio</button>
      </form>
    </div>
  );
}
