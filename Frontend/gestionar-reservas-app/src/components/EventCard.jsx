import { EventUserIcon } from "../assets/icons/EventUser.jsx";
import { EventLocationIcon } from "../assets/icons/EventLocation.jsx";
import { EventCalendarIcon } from "../assets/icons/EventCalendar.jsx";
import { EventChairIcon } from "../assets/icons/EventChair.jsx";
import { VerticalDotsIcon } from "../assets/icons/VerticalDots.jsx";

import { formatearFecha } from "../utils/formatearFecha.js";

import { useAuth } from "../hooks/useAuth.js";

import estiloCategoria from "../constants/const_categoria.js";
import "../styles/event_card.css";
import { useState } from "react";
import { EditEventIcon } from "../assets/icons/EditEvent.jsx";
import { DeleteEventIcon } from "../assets/icons/DeleteEvent.jsx";

export function EventCard({ evento }) {
  const { usuario } = useAuth();

  const eventStatusClasses = evento.cancelado
    ? "bg--terciary-600 clr--terciary-300"
    : "bg--quaternary-300 clr--quaternary-100";

  const eventCategoryClasses = estiloCategoria[evento.categoria];

  return (
    <div className="card__event rounded-4 p-4 overflow-hidden clr--neutral-100">
      <div className="event__header mb-2">
        <div className="header__top d-flex justify-content-between align-items-center pb-3">
          <div className="event__status">
            <div className={`py-1 px-2 rounded-pill ${eventStatusClasses}`}>
              <span>{evento.cancelado ? "Cancelado" : "Activo"}</span>
            </div>
          </div>
          {usuario.isLogged && usuario.rol === "ADMINISTRADOR" && (
            <div className="event__menu dropdown">
              <button
                className="btn__menu dropdown-toggle d-flex justify-content-center align-items-center rounded-circle p-1 border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <VerticalDotsIcon width={21} height={21} />
              </button>
              <ul className="dropdown-menu fs--menu-text shadow--menu">
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" type="button">
                    <EditEventIcon  width={20} height={20}/>
                    <span>Editar evento</span>
                  </button>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2" type="button">
                    <DeleteEventIcon width={20} height={20}/>
                    <span>Cancelar evento</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="event__category d-inline-block">
          <div className={`py-1 px-3 rounded-pill ${eventCategoryClasses}`}>
            <span>{evento.categoria}</span>
          </div>
        </div>
      </div>

      <div className="event__body mb-4">
        <h2 className="event__name pb-4 fw--semibold fs--card-title">
          {evento.nombre}
        </h2>
        <div className="event__info d-flex flex-column gap-3 fs--card-text">
          <div className="event__field d-flex align-items-center gap-3">
            <EventUserIcon width={21} height={21} />
            <span className="text-truncate">{evento.organizador}</span>
          </div>
          <div className="event__field d-flex align-items-center gap-3">
            <EventLocationIcon width={21} height={21} />
            <span className="text-truncate">{evento.espacio}</span>
          </div>
          <div className="event__field d-flex align-items-center gap-3">
            <EventCalendarIcon width={21} height={21} />
            <div className="event__dates d-flex flex-column gap-1">
              <span className="text-truncate">
                {formatearFecha(evento.fecha_inicio)}
              </span>
              <span className="text-truncate">
                {formatearFecha(evento.fecha_fin)}
              </span>
            </div>
          </div>
          <div className="event__field d-flex align-items-center gap-3">
            <EventChairIcon width={21} height={21} />
            <span className="text-truncate">
              <span className="pe-1 text-truncate">{evento.plazas_libres}</span>
              /<span className="px-1 text-truncate">{evento.plazas}</span>
              plazas disponibles
            </span>
          </div>
        </div>
      </div>

      {/* <div style={{ height: "1px" }} className="bg--neutral-300 my-4"></div> */}

      <div className="event__buttons d-flex justify-content-between align-items-center gap-2">
        <button
          className="event__button rounded-3"
          type="button"
        >
          Ver detalles
        </button>

        {usuario.isLogged && usuario.rol === "CLIENTE" && (
          <button
            className="event__button border border-0 rounded-3"
            type="button"
          >
            Hacer reserva
          </button>
        )}
      </div>
    </div>
  );
}
