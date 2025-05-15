import { useEffect, useState } from "react";
import { checkAuth } from "../services/check-auth.js";
import { EventCard } from "../components/EventCard.jsx";
import { SearchIcon } from "../assets/icons/Search.jsx";

import "../styles/vista_eventos.css";

const getEvents = () => {
  return fetch("/api/v1/evento", {
    method: "GET",
    credentials: "include",
  });
};

export function VistaEventos() {
  const [eventos, setEventos] = useState([]);

  const reset = () => {
    console.log("RESETEAND");
    checkAuth(getEvents)
      .then((responseFetch) => responseFetch.json())
      .then((data) => {
        setEventos(data.eventos);
      });
  };

  useEffect(() => {
    reset();
  }, []);

  return (
    <>
      {/* <h1>Eventos</h1> */}
      <div className="search__container d-flex align-items-center px-4 mb-5">
        <div className="search__box flex-grow-1 d-flex align-items-center gap-2 px-3 rounded-4 overflow-hidden clr--neutral-100">
          <SearchIcon width={21} height={21} />
          <input
            className="input__search w-100 border-0 bg-transparent"
            type="text"
            placeholder="Buscar eventos..."
          />
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="container-fluid px-4">
        <div className="row g-4">
          {eventos.map((evento, index) => {
            return (
              <div key={evento.id} className="col-12 col-sm-6 col-xl-4">
                <EventCard evento={evento} reset={reset}/>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
