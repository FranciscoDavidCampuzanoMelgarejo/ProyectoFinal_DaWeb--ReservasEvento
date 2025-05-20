import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {EspacioCard } from "../components/EspacioCard"
import { EspacioModal } from '../components/EspacioModal';
import '../VistaEspacios.css';

export function VistaEspacios() {
  const { usuario } = useAuth();
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] =useState(false);
  const [modoModal,setModoModal] =useState("crear");
  const [espacioSeleccionado,setEspacioSeleccionado] = useState(null);
  const navigate = useNavigate();

  const abrirEditarModal=(espacio)=>{
    setModoModal("editar");
    setEspacioSeleccionado(espacio);
    setMostrarModal(true);
  };
  const cerrarModal=()=>{
    setMostrarModal(false);
    setEspacioSeleccionado(null);
  };
  const manejarSubmit=async(datos)=>{
    try{
      const url=modoModal==="crear" ? "/api/v1/espacio" : `/api/v1/espacio/${espacioSeleccionado.id}`;
      const method=modoModal === "crear" ? "POST" : "PATCH";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(datos)
      });
      if (!response.ok) throw new Error("Error al guardar");

      if (modoModal === "crear") {
        const nuevo = await response.json();
        setEspacios(prev => [...prev, nuevo]);
        alert("Espacio creado");
      } else {
        setEspacios(prev => prev.map(e => e.id === espacioSeleccionado.id ? { ...e, ...datos } : e));
        alert("Espacio actualizado");
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar espacio");
    }
  };
  const abrirVerModal=(espacio)=>{
    setModoModal("ver");
    setEspacioSeleccionado(espacio);
    setMostrarModal(true);
  };

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
  <div className="container-fluid mt-4 px-4"> {/* usa solo container-fluid */}
    {usuario?.rol === 'ADMINISTRADOR' && (
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setModoModal("crear");
            setEspacioSeleccionado(null);
            setMostrarModal(true);
          }}
        >
          Crear nuevo espacio
        </button>
      </div>
    )}
    <div className="row g-4">
      {espacios.map((espacio) => (
        <div key={espacio.id} className="col-12 col-sm-6 col-xl-4 d-flex">
          <EspacioCard
            espacio={espacio}
            onEditar={abrirEditarModal}
            onEliminar={handleEliminarEspacio}
            onVer={abrirVerModal}
          />
        </div>
      ))}
    </div>

    <EspacioModal
      visible={mostrarModal}
      modo={modoModal}
      espacio={espacioSeleccionado}
      onClose={cerrarModal}
      onSubmit={manejarSubmit}
    />
  </div>
);
}