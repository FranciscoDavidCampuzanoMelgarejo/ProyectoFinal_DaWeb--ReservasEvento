import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { checkAuth } from "../services/check-auth.js";
import { ReservaCard } from '../components/ReservaCard.jsx';
import { useNotification } from '../hooks/useNotification.js';
import { NotificationDialog } from '../components/NotificationDialog.jsx';
import { DialogErrorIcon } from '../assets/icons/DialogIcons/DialogError.jsx';
import { DialogInfoIcon } from '../assets/icons/DialogIcons/DialogInfo.jsx';
import CustomError from '../errors/CustomError.js';

const getTodasLasReservas=()=>{
    return fetch("/api/v1/reserva/admin",{
    method: "GET",
    credentials: "include",
  });
};

export function VistaReservasAdmin(){
    const { usuario, logout }= useAuth();
    const [reservas, setReservas]= useState([]);
    const { notificar } = useNotification();
    const cargarReservas=()=>{
        checkAuth(getTodasLasReservas)
        .then((res)=> res.json())
        .then((data)=>{
            setReservas(data.reservas || []);
        }).catch((err)=>{
            console.error('Error al cargar reservas:', err);
            if(err instanceof CustomError && err.codigoEstado === 401)
                logout();
        });
    };
    useEffect(()=>{
        if(usuario?.rol==="ADMINISTRADOR"){
            cargarReservas();
        }
    },[usuario]);
    const eliminarReserva=async (id)=>{
        try{
            const res =await checkAuth(()=>
              fetch(`/api/v1/reserva/${id}`,{
                  method:"DELETE",
                  credentials: "include"
              })
            );
            if(res.ok){
                setReservas((prev)=>prev.filter((reserva)=>reserva.id!==id));
                notificar("Reserva anulada correctamente", true, () => DialogInfoIcon);
            }else{
                notificar("No se pudo anular la reserva", true, () => DialogInfoIcon);
            }
        }catch(err){
            console.error("Error al anular reserva:", err);
            if(err instanceof CustomError && err.codigoEstado === 401)
                logout();
            else
                notificar("Error al anular reserva", true, ()=> DialogErrorIcon);
        }
    };
    
    return(
        <div className='container-fluid px-4 mt-4'>
            <h2 className='fs-2 fw-bold text-light mb-4'> Reservas de todos los eventos</h2>
            <div className='row g-4'>
                {reservas.length>0 ? (
                    reservas.map((reserva) => (
                        <div key={reserva.id} className='col-12 col-sm-6 col-xl-4 d-flex'>
                            <ReservaCard 
                            reserva={reserva} 
                            onEditar={()=>{}}
                            onAnular={()=>eliminarReserva(reserva.id)}

                            />
                        </div>
                    ))
                ) : (
                    <p className='text-secondary'>No tienes reservas registradas.</p>
                )}
            </div>
            <NotificationDialog/>
        </div>
    );
}