import { useEffect, useRef, useState } from "react";
import { checkAuth } from "../services/check-auth.js";
import { EventCard } from "../components/EventCard.jsx";
import { SearchIcon } from "../assets/icons/Search.jsx";

import "../styles/vista_eventos.css";
import { AddEventIcon } from "../assets/icons/AddEvent.jsx";
import { AddFiltersIcon } from "../assets/icons/AddFilters.jsx";
import { CreateEventDialog } from "../components/CreateEventDialog.jsx";
import { useEspacios } from "../hooks/useEspacios.js";
import { useAuth } from "../hooks/useAuth.js";
import { FiltrosDialog } from "../components/FiltrosDialog.jsx";

const getEvents = () => {
  return fetch("/api/v1/evento", {
    method: "GET",
    credentials: "include",
  });
};

export function VistaEventos() {
  const { usuario } = useAuth();
  const { cargarEspacios } = useEspacios();

  const [eventosOriginales, setEventosOriginales] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [filtros, setFiltros] = useState({});

  const dialogoRef = useRef(null);
  const dialogoFiltrosRef = useRef(null);

  const reset = () => {
    checkAuth(getEvents)
      .then((responseFetch) => responseFetch.json())
      .then((data) => {
        setEventosOriginales(data.eventos);
        setEventos(data.eventos);
        setFiltros({}); // Reseteamos filtros también al cargar eventos
      });
  };

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    // Eliminamos filtros vacíos o indefinidos
    console.log("FILTRANDO");

    console.log(filtros);
    if (Object.keys(filtros).length !== 0) {
      const eventosFiltrados = eventosOriginales.filter((evento) => {
        if (
          filtros.nombre &&
          !evento.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
        )
          return false;
        if (filtros.categoria && evento.categoria !== filtros.categoria)
          return false;
        if (filtros.espacio && evento.id_espacio !== filtros.espacio)
          return false;
        if (filtros.plazas && evento.plazas_libres < filtros.plazas)
          return false;
        return true;
      });
      setEventos(eventosFiltrados);
    } else {
      setEventos(eventosOriginales);
    }
  }, [filtros]);

  const openDialog = async () => {
    await cargarEspacios();
    dialogoRef.current?.showModal();
  };

  const openFiltrosDialog = () => {
    dialogoFiltrosRef.current?.showModal();
  };

  const actualizarFiltros = (nuevosFiltros) => {
    if (Object.keys(nuevosFiltros).length === 0) {
      setFiltros(nuevosFiltros);
    } else {
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        ...nuevosFiltros,
      }));
    }
  };

  const handleInput = (e) => {
    const valor = e.target.value;
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      nombre: valor || undefined, // Para que "" sea tratado como no filtro
    }));
  };

  return (
    <>
      {/* BARRA SUPERIOR DE BÚSQUEDA Y BOTONES */}
      <div className="search__container d-flex align-items-center px-4 mb-5">
        <div className="search__box flex-grow-1 d-flex align-items-center gap-2 px-3 me-3 rounded-4 overflow-hidden clr--neutral-100">
          <SearchIcon width={21} height={21} />
          <input
            className="input__search w-100 border-0 bg-transparent"
            type="text"
            placeholder="Buscar eventos..."
            value={filtros.nombre || ""}
            onInput={handleInput}
          />
        </div>

        {usuario.rol === "ADMINISTRADOR" && (
          <button
            type="button"
            onClick={openDialog}
            className="border-0 p-0 pe-2 bg-transparent clr--secondary-300"
          >
            <AddEventIcon width={35} height={35} />
          </button>
        )}

        <button
          type="button"
          className="border-0 p-0 bg-transparent clr--secondary-300"
          onClick={openFiltrosDialog}
        >
          <AddFiltersIcon width={35} height={35} />
        </button>
      </div>

      {/* GRID DE EVENTOS */}
      <div className="container-fluid px-4">
        <div className="row g-4">
          {eventos.map((evento) => (
            <div key={evento.id} className="col-12 col-sm-6 col-xl-4">
              <EventCard ref={dialogoRef} evento={evento} reset={reset} />
            </div>
          ))}
        </div>
      </div>

      {/* DIALOGOS */}
      <CreateEventDialog ref={dialogoRef} reset={reset} />
      <FiltrosDialog
        ref={dialogoFiltrosRef}
        actualizarFiltros={actualizarFiltros}
      />
    </>
  );
}
