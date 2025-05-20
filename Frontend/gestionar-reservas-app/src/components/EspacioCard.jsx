import { useState } from "react";
import { VerticalDotsIcon } from "../assets/icons/VerticalDots.jsx";
import { useAuth } from "../hooks/useAuth.js";
import "../styles/event_card.css"

export function EspacioCard({ espacio, onEditar, onEliminar, onVer }) {
  const { usuario } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const estadoClasses = espacio.estado === 1
    ? "bg--quaternary-300 clr--quaternary-100"
    : "bg--terciary-600 clr--terciary-300";

  return (
    <div className="card__event rounded-4 p-4 overflow-hidden clr--neutral-100 d-flex flex-column h-100 w-100">
      <div className="event__header mb-2">
        <div className="header__top d-flex justify-content-between align-items-center pb-3">
          <div className="event__status">
            <div className={`py-1 px-2 rounded-pill ${estadoClasses}`}>
              <span>{espacio.estado === 1 ? "ACTIVO" : "CERRADO"}</span>
            </div>
          </div>
          {usuario.isLogged && usuario?.rol === "ADMINISTRADOR" && (
            <div className="event__menu dropdown">
              <button
                className="btn__menu dropdown-toggle d-flex justify-content-center align-items-center rounded-circle p-1 border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => setMenuVisible(!menuVisible)}
              >
                <VerticalDotsIcon width={21} height={21} />
              </button>
              <ul className={`dropdown-menu ${menuVisible ? "show" : ""}`}>
                <li>
                  <button className="dropdown-item" onClick={() => onEditar(espacio)}>Editar</button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => onEliminar(espacio.id)}>Eliminar</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="event__body mb-4">
        <h2 className="event__name pb-4 fw--semibold fs--card-title">{espacio.nombre}</h2>
        <div className="event__info d-flex flex-column gap-3 fs--card-text">
          <div className="event__field d-flex align-items-center gap-3">
            <span className="fw--semibold clr--neutral-300">Propietario:</span>
            <span className="text-truncate">{espacio.propietario}</span>
          </div>
          <div className="event__field d-flex align-items-center gap-3">
            <span className="fw--semibold clr--neutral-300">Capacidad:</span>
            <span className="text-truncate">{espacio.capacidad}</span>
          </div>
          <div className="event__field d-flex align-items-center gap-3">
            <span className="fw--semibold clr--neutral-300">Dirección:</span>
            <span className="text-truncate">{espacio.direccion}</span>
          </div>
          <div className="event__field d-flex align-items-start gap-3">
            <span className="fw--semibold clr--neutral-300">Descripción:</span>
            <span className="text-truncate">{espacio.descripcion}</span>
          </div>
        </div>
      </div>

      {usuario.isLogged && usuario?.rol === "CLIENTE" && (
        <div className="event__buttons d-flex justify-content-between align-items-center gap-2 mt-auto">
          <button type="button" className="event__button rounded-3 bg-transparent" onClick={() => onVer(espacio)}>
            Ver detalles
          </button>
        </div>
      )}
    </div>
  );
}