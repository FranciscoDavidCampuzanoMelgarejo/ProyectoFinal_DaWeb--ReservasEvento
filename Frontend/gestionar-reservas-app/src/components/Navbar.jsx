import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"

import { BurgerMenuIcon } from "../assets/icons/BurgerMenu.jsx";
import { EventIcon } from "../assets/icons/Event.jsx";
import { VenueIcon } from "../assets/icons/Venue.jsx";
import { ReservationIcon } from "../assets/icons/Reservation.jsx";
import { EventUserIcon } from "../assets/icons/EventUser.jsx";

import "../styles/navbar.css";

export function Navbar() {
  const { usuario, logout }=useAuth();
  const [mostrar, setMostrar] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const menuRef=useRef(null);
  const [menuAbierto, setMenuAbierto]=useState(false);

  useEffect(() => {
    console.log("EN EL EFFECT");
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    const handleClickOutside=(e)=>{
      if(menuRef.current && !menuRef.current.contains(e.target)){
        setMenuAbierto(false);
      }
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClickOutside);
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
          <ul className="navbar-nav gap-2 gap-sm-3">
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
            {usuario?.rol === "CLIENTE" && (
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
            )}
            {usuario?.rol === "ADMINISTRADOR" && (
            <li className="nav-item">
              <NavLink
                className="nav-link d-flex align-items-center gap-3 px-3 py-3 px-sm-0 py-sm-2 clr--neutral-100"
                to="/admin/reservas"
              >
                <span className="nav-link__icon">
                  <ReservationIcon />
                </span>
                <span>Reservas admin</span>
              </NavLink>
            </li>
            )}
            {/* Para que se muestre una inicial del nombre del usuario y se pueda cerrar sesion */}
            <li className="nav-item dropdown" ref={menuRef}>
              <div
                className="nav-link d-flex aling-items-center gap-3 px-3 py-3 px-sm-0 py-sm-2 clr--neutral-100"
                style={{cursor:"pointer"}}
                onClick={()=> setMenuAbierto(!menuAbierto)}
              >
                  <EventUserIcon width={22} height={22}/>
                  <span className="d-sm-none">Perfil</span>
              </div>
                {menuAbierto && (
                  <ul className="dropdown-menu show position-absolute end-0 mt-2 shadow">
                    <li className="dropdown-item text-danger" onClick={logout} style={{cursor:"pointer"}}>Cerrar sesión</li>
                  </ul>
                )}
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
