import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { BurgerMenuIcon } from "../assets/icons/BurgerMenu.jsx";
import { EventIcon } from "../assets/icons/Event.jsx";
import { VenueIcon } from "../assets/icons/Venue.jsx";
import { ReservationIcon } from "../assets/icons/Reservation.jsx";

import "../styles/navbar.css";

export function Navbar() {
  const [mostrar, setMostrar] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    console.log("EN EL EFFECT");
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-sm border-bottom border-white py-3 px-0 px-sm-5 fixed-top bg--primary-700 clr--neutral-100">
      <div className="container-fluid p-0">
        <h1
          className={`navbar-brand m-0 py-0 ps-4 px-sm-0 clr--neutral-100 fs--title ${
            !mostrar && windowWidth < 576 ? "hide" : ""
          }`}
        >
          Ravento
          {/* LOGO */}
        </h1>

        <button
          className="navbar-toggler py-2 pe-4 px-sm-0 clr--neutral-100"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSections"
          aria-controls="navbarSections"
          aria-expanded="false"
          aria-label="Navegacion entre secciones"
          onClick={() => setMostrar(!mostrar)}
        >
          <BurgerMenuIcon />
        </button>
        <div
          className="collapse navbar-collapse justify-content-end mt-3 mt-sm-0"
          id="navbarSections"
        >
          <ul className="navbar-nav gap-4 gap-sm-5">
            <li className="nav-item">
              <NavLink
                className="nav-link d-flex align-items-center gap-3 px-3 py-3 px-sm-0 py-sm-2 clr--neutral-100"
                aria-current="page"
                to="/eventos"
              >
                <span className="nav-link__icon">
                  <EventIcon />
                </span>
                <span>Eventos</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link d-flex align-items-center gap-3 px-3 py-3 px-sm-0 py-sm-2 clr--neutral-100"
                to="/espacios"
              >
                <span className="nav-link__icon">
                  <VenueIcon />
                </span>
                <span>Recintos</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link d-flex align-items-center gap-3 px-3 py-3 px-sm-0 py-sm-2 clr--neutral-100"
                to="/reservas"
              >
                <span className="nav-link__icon">
                  <ReservationIcon />
                </span>
                <span>Reservas</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
