import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {EspacioCard } from "../components/EspacioCard"
import { EspacioModal } from '../components/EspacioModal';
import { checkAuth } from "../services/check-auth.js";
import { useNotification } from '../hooks/useNotification.js';
import { NotificationDialog } from '../components/NotificationDialog.jsx';
import { DialogInfoIcon } from '../assets/icons/DialogIcons/DialogInfo.jsx';
import { DialogErrorIcon } from '../assets/icons/DialogIcons/DialogError.jsx';
import '../VistaEspacios.css';
import CustomError from '../errors/CustomError.js';

const getEspacios =()=>{
  return fetch("/api/v1/espacio",{
    method: "GET",
    credentials: "include",
  });
};

export function VistaEspacios() {
  const { usuario, logout } = useAuth();
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] =useState(false);
  const [modoModal,setModoModal] =useState("crear");
  const [espacioSeleccionado,setEspacioSeleccionado] = useState(null);
  const navigate = useNavigate();
  const { notificar } = useNotification();
  //para usar el checkauth al igual que en vistaeventos
  const reset=() => {
    checkAuth(getEspacios)
      .then((responseFetch) => responseFetch.json())
      .then(data => {
        setEspacios(data);
      })
      .catch(error => {
        console.error('Error al cargar espacios:', error);
        setCargando(false);
        if(error instanceof CustomError && error.codigoEstado === 401)
          logout();
      })
      .finally(()=>{
        setCargando(false);
      });
  };
  useEffect(()=>{
    reset();
  },[]);

  const abrirEditarModal=(espacio)=>{
    setModoModal("editar");
    setEspacioSeleccionado(espacio);
    setMostrarModal(true);
  };
   const abrirVerModal=(espacio)=>{
    setModoModal("ver");
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
      //mirar si se aplica bien el checkAuth
      const response = await checkAuth(()=>
        fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(datos)
      })
    );
      if (!response.ok) throw new Error("Error al guardar");

      if (modoModal === "crear") {
        const nuevo = await response.json();
        setEspacios(prev => [...prev, nuevo]);
        notificar("Espacio creado correctamente", true, ()=>DialogInfoIcon);
      } else {
        setEspacios(prev => prev.map(e => e.id === espacioSeleccionado.id ? { ...e, ...datos } : e));
        notificar("Espacio actualizado correctamente", true, ()=>DialogInfoIcon);
      }
    } catch (err) {
      console.error(err);
      if(err instanceof CustomError && err.codigoEstado === 401) 
        logout();
      else
        notificar("Error al guardar espacio", true, ()=> DialogErrorIcon);
    }
  };

  //handleeliminarEspacio esta hecho ahora con ConfirDialogEspacio
  /*
  const handleEliminarEspacio = async (id) => {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este espacio físico?');
    if (!confirmar) return;
  
    try {
      //mirar si se aplica bien asi el checkauth
      const response = await checkAuth(()=>
        fetch(`/api/v1/espacio/${id}`, {
          method: 'DELETE',
          credentials: 'include'
      })
    );
      if (!response.ok) {
        console.error('Error al eliminar espacio');
        return;
      }
      setEspacios(prevEspacios => prevEspacios.filter(espacio => espacio.id !== id));
      notificar("¡Espacio eliminado exitosamente!", true,()=>DialogInfoIcon);
      reset();
    } catch (error) {
      console.error("Error de red al eliminar espacio:", error);
      notificar("Error al eliminar el espacio", true, ()=>DialogErrorIcon);
    }
  };
*/
  if (cargando) return <p>Cargando espacios...</p>;

  return (
  <div className="container-fluid mt-4 px-4"> {/* usa solo container-fluid */}
    {usuario?.rol === 'ADMINISTRADOR' && (
      <div className="d-flex justify-content-end mb-4">
        <button className="btn fw--semibold clr--neutral-100"
          style={{ backgroundColor: "var(--clr-secondary-400)", border: "none"}}
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
            onEliminar={reset}
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