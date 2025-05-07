import { useEffect, useState } from "react";
import { checkAuth } from "../services/check-auth.js";
import { EventCard } from "../components/EventCard.jsx";

const getEvents = () => {
    return fetch('/api/v1/evento', {
        method: 'GET',
        credentials: 'include'
    });
}

export function VistaEventos () {

    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        checkAuth(getEvents)
            .then(responseFetch => responseFetch.json())
            .then(data => {
                //setEventos(Array.from({ length: 10 }, () => data.eventos[0]));
                setEventos(data.eventos);
            })
    }, [])

    return (
        <>
            <h1>Eventos</h1>
            <div>
                <input type="text" placeholder="Buscar eventos..."/>
            </div>

            {/* GRID LAYOUT */}
            <div className="container-fluid px-4">
                <div className="row g-4">
                    {
                        eventos.map((evento, index) => {
                            return (
                                <div key={evento.id} className="col-12 col-sm-6 col-xl-4">
                                   <EventCard evento={evento} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
}