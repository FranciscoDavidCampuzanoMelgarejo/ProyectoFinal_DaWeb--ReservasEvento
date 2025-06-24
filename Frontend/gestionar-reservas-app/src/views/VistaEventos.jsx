import { useEffect, useRef, useState } from "react";
import { checkAuth } from "../services/check-auth.js";
import { EventCard } from "../components/EventCard.jsx";
import { SearchIcon } from "../assets/icons/Search.jsx";

import "../styles/vista_eventos.css";
import { AddEventIcon } from "../assets/icons/AddEvent.jsx";
import { AddFiltersIcon } from "../assets/icons/AddFilters.jsx";
import { CreateEventDialog } from "../components/CreateEventDialog.jsx";
import { EspaciosProvider } from "../context/contextEspacios.jsx";
import { useEspacios } from "../hooks/useEspacios.js";

const getEvents = () => {
  return fetch("/api/v1/evento", {
    method: "GET",
    credentials: "include",
  });
};

export function VistaEventos() {
  const { cargarEspacios } = useEspacios();
  const [eventos, setEventos] = useState([]);
  const dialogoRef = useRef(null);

  const reset = () => {
    checkAuth(getEvents)
      .then((responseFetch) => responseFetch.json())
      .then((data) => {
        setEventos(data.eventos);
      });
  };

  useEffect(() => {
    reset();
  }, []);

  const openDialog = async () => {
    await cargarEspacios();
    dialogoRef.current?.showModal();
  };

  return (
    <>
      {/* <h1>Eventos</h1> */}
      <div className="search__container d-flex align-items-center px-4 mb-5">
        <div className="search__box flex-grow-1 d-flex align-items-center gap-2 px-3 me-3 rounded-4 overflow-hidden clr--neutral-100">
          <SearchIcon width={21} height={21} />
          <input
            className="input__search w-100 border-0 bg-transparent"
            type="text"
            placeholder="Buscar eventos..."
          />
        </div>

        <button
          type="button"
          onClick={openDialog}
          className="border-0 p-0 pe-2 bg-transparent clr--secondary-300"
        >
          <AddEventIcon width={35} height={35} />
        </button>
        <button
          type="button"
          className="border-0 p-0 bg-transparent clr--secondary-300"
        >
          <AddFiltersIcon width={35} height={35} />
        </button>
      </div>

        {/* GRID LAYOUT */}
        <div className="container-fluid px-4">
          <div className="row g-4">
            {eventos.map((evento, index) => {
              return (
                <div key={evento.id} className="col-12 col-sm-6 col-xl-4">
                  <EventCard ref={dialogoRef} evento={evento} reset={reset} />
                </div>
              );
            })}
          </div>
        </div>

        <CreateEventDialog ref={dialogoRef} reset={reset}/>
    </>
  );
}
