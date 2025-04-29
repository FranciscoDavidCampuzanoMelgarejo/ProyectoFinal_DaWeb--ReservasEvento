import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../VistaEspacios.css';

export function VistaEspacios() {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const handleEliminarEspacio = async (id) => {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este espacio físico?');
    if (!confirmar) return;
  
    try {
      const response = await fetch(`/api/v1/espacio/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        console.error('Error al eliminar espacio');
        return;
      }
      setEspacios(prevEspacios => prevEspacios.filter(espacio => espacio.id !== id));
      alert('¡Espacio eliminado exitosamente!');
    } catch (error) {
      console.error('Error de red al eliminar espacio:', error);
    }
  };
  
  //para cargar los datos
  useEffect(() => {
    fetch('/api/v1/espacio', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setEspacios(data);
        setCargando(false);
      })
      .catch(error => {
        console.error('Error al cargar espacios:', error);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando espacios...</p>;

  return (
    <div className="container mt-4">
    <div className="row">
      {espacios.map(espacio => (
        <div className="col-md-6 mb-4" key={espacio.id}>
          <div className="card h-100">
            <div className="card-body">
              <h4 className="card-title">{espacio.nombre}</h4>
              <p><strong>Propietario:</strong> {espacio.propietario}</p>
              <p><strong>Capacidad:</strong> {espacio.capacidad}</p>
              <p><strong>Dirección:</strong> {espacio.direccion}</p>
              <p><strong>Descripción:</strong> {espacio.descripcion}</p>
              <p><strong>Estado:</strong> 
                <span className={`estado ${espacio.estado === 1 ? 'activo' : 'cerrado'}`}>{espacio.estado === 1 ? 'ACTIVO' : 'CERRADO'}</span>
              </p>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-outline-primary" onClick={() => navigate(`/espacios/editar/${espacio.id}`)}>Editar</button>
                <button className="btn btn-outline-danger" onClick={() => handleEliminarEspacio(espacio.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}
