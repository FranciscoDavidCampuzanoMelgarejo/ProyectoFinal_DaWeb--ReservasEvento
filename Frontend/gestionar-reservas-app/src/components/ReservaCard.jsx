import { EventCalendarIcon } from "../assets/icons/EventCalendar.jsx";
import { EventChairIcon } from "../assets/icons/EventChair.jsx";
import { DeleteEventIcon } from "../assets/icons/DeleteEvent.jsx";
import { EditEventIcon } from "../assets/icons/EditEvent.jsx"
import { formatearFecha } from "../utils/formatearFecha.js";
import { useAuth } from "../hooks/useAuth.js";
import { useRef } from "react";
import "../styles/event_card.css";
import { ConfirmDialogReserva } from "./ConfirmDialogReserva.jsx"

export function ReservaCard({ reserva, onEditar, onAnular}){
    const { usuario } = useAuth();
    const fecha_actual=new Date();
    const inicio= new Date(reserva.fecha_inicio);
    const fin = new Date(reserva.fecha_fin);
    const esAnulable = inicio > new Date();
    let estado = "Activa";
    let estadoClass= "estado--activa";
    if(inicio<=fecha_actual && fecha_actual<=fin){
        estado= "En curso";
        estadoClass= "estado--curso";
    }else if(fecha_actual>fin){
        estado="Finalizada";
        estadoClass= "estado--finalizada";
    }
    const dialogRef = useRef(null);

    const openDialog =  () => {
        dialogRef.current?.showModal();
    }

    return(
        <div className="card__event rounded-4 p-4 overflow-hidden clr--neutral-100 d-flex flex-column h-100 w-100">
            <div className="event__header mb-2">
                <div className="header__top d-flex justify-content-between align-items-center pb-3">
                    <div className="event__status">
                        <div className={`py-1 px-2 rounded-pill ${estadoClass}`}>
                            <span>{estado}</span>
                        </div>
                    </div>
                    {usuario.isLogged &&  esAnulable && (
                        <div className="d-flex gap-2">
                            {usuario.rol ==="CLIENTE" &&(
                            <button
                            className="btn__menu d-flex justify-content-center align-items-center rounded-circle p-1 border-0"
                            type="button"
                            onClick={()=>onEditar(reserva)}
                            title="Editar reserva"
                            >
                                <EditEventIcon width={21} height={21}/>
                            </button>
                            )}
                            <button
                            className="btn__menu d-flex justify-content-center align-items-center rounded-circle p-1 border-0"
                            type="button"
                            onClick={openDialog}
                            title="Anular reserva"
                            >
                            <DeleteEventIcon width={21} height={21} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="event__body mb-4">
                <h2 className="event__name pb-4 fw--semibold fs--card-title">
                    {reserva.nombre_evento}
                </h2>
                <div className="event_info d-flex flex-column gap-3 fs--card-text">
                    <div className="event__field d-flex align-items-center gap-3">
                        <EventChairIcon width={21} height={21}/>
                        <span>{reserva.plazas_reservadas} plazas reservadas</span>
                    </div>
                    <div className="event__field d-flex align-items-center gap-3">
                        <EventCalendarIcon width={21} height={21}/>
                        <div className="event__dates d-flex flex-column gap-1">
                            <span> Inicio: {formatearFecha(reserva.fecha_inicio)}</span>
                            <span> Fin: {formatearFecha(reserva.fecha_fin)}</span>
                        </div>
                    </div>
                    <div className="event__field d-flex align-items-center gap-3">
                        <span className="fw--semibold clr--neutral-300">Hecha el:</span>
                        <span>{formatearFecha(reserva.fecha_reserva)}</span>
                    </div>
                    {reserva.email_usuario && (
                        <div className="event__field d-flex aling-items-center gap-3">
                            <span className="fw--semibold clr--neutral-300">Reservado por:</span>
                            <span>{reserva.email_usuario}</span>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmDialogReserva
            ref={dialogRef}
            onConfirm={onAnular}
            />
        </div>
    );
}
