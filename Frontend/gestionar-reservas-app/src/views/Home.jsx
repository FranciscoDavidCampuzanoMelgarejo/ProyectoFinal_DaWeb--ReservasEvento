import { Link } from "react-router-dom";
import { HomeCard } from "../components/HomeCard.jsx";

import HeroDesktop from "../assets/images/Home/Hero_Desktop.jpg";
import HeroTablet from "../assets/images/Home/Hero_Tablet.jpg";
import HeroMobile from "../assets/images/Home/Hero_Mobile.jpg";

import { CalendarHomeIcon } from "../assets/icons/CalendarHome.jsx";
import { LocationHomeIcon } from "../assets/icons/LocationHome.jsx";
import { TicketHomeIcon } from "../assets/icons/TicketHome.jsx";
import { DeveloperHomeIcon } from "../assets/icons/DeveloperHome.jsx";
import { MailHomeIcon } from "../assets/icons/MailHome.jsx";
import "../styles/home.css";

export function Home() {
  return (
    <main id="home" className="bg--primary-700">
      <header className="d-flex justify-content-end align-items-center px-3 py-2 border-bottom border-white">
        <div className="home__auth d-flex gap-2">
          <div role="button" className="home__login border rounded-3">
            <Link
              className="text-decoration-none clr--neutral-100 align-middle d-inline-block px-3 py-1"
              to="/login"
            >
              Login
            </Link>
          </div>
          <div
            role="button"
            className="home__register border-0 rounded-3 bg--secondary-400"
          >
            <Link
              className="text-decoration-none clr--neutral-100 align-middle d-inline-block px-3 py-1"
              to="/register"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      <section id="homeDescription">
        <div className="homeDescription__content position-relative">
          <picture className="bg-black">
            <source srcSet={HeroDesktop} media="(min-width: 1200px)" />
            <source srcSet={HeroTablet} media="(min-width: 641px)" />
            <img
              className="homeDescription__image w-100 object-fit-cover"
              src={HeroMobile}
              alt="Hero"
            />
          </picture>

          <div className="overlay__text position-absolute start-0 end-0 d-flex justify-content-center justify-content-md-end align-items-md-center mx-auto mx-md-0 ps-md-5">
            <div className="homeDescription__info text-center text-md-start d-flex flex-column gap-3">
              <h1 className="homeDescription__title clr--neutral-100">
                Crea Eventos Inolvidables
              </h1>
              <h3 className="homeDescription__desc clr--neutral-300">
                Gestione sin problemas sus eventos, descubra lugares únicos y
                gestione reservas, todo en un solo lugar.
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section
        id="homeInfo"
        className="container-fluid d-flex justify-content-center px-3 py-5 gap-3 bg--primary-500 clr--neutral-100"
      >
        <div className="homeInfo__row row gy-3">
          <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
            <HomeCard
              titulo="Planificación de eventos"
              contenido="Cree y gestione eventos con herramientas potentes y una interfaz intuitiva."
            >
              <CalendarHomeIcon />
            </HomeCard>
          </div>

          <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
            <HomeCard
              titulo="Descubrimiento del lugar"
              contenido="Encuentre lugares perfectos que coincidan con los requisitos de su evento."
            >
              <LocationHomeIcon />
            </HomeCard>
          </div>

          <div className="col-12 col-lg-4 d-flex justify-content-center">
            <HomeCard
              titulo="Reserva fácil"
              contenido="Proceso de reserva optimizado para una gestión de eventos sin complicaciones."
            >
              <TicketHomeIcon />
            </HomeCard>
          </div>
        </div>
      </section>

      <footer className="clr--neutral-100 px-3 pt-4 p-md-5">
        <div className="container-fluid footer__sections">
          <div className="row">
            <div className="footer__title col-12 col-md-4 mb-5 mb-md-0">
              <h2 style={{ fontSize: "21px" }}>
                Ravento
              </h2>
            </div>
            <div className="footer__developers col-12 col-md-4 mb-4 mb-md-0">
              <h3 className="footer--subtitle text-uppercase mb-3">
                Desarrolladores
              </h3>
              <ul
                className="d-flex flex-column gap-1"
                style={{ fontSize: "13px" }}
              >
                <li>
                  <p className="d-flex gap-1 align-items-center">
                    <DeveloperHomeIcon />
                    <span>Francisco David Campuzano Melgarejo</span>
                  </p>
                </li>
                <li>
                  <p className="d-flex gap-1 align-items-center">
                    <DeveloperHomeIcon />
                    <span>Serio Martínez Rosal</span>
                  </p>
                </li>
              </ul>
            </div>

            <div className="footer__contact col-12 col-md-4">
              <h3 className="footer--subtitle text-uppercase mb-3" style={{ fontSize: "14px" }}>
                Contacto
              </h3>
              <ul
                className="d-flex flex-column gap-1"
                style={{ fontSize: "13px" }}
              >
                <li>
                  <p className="d-flex gap-1 align-items-center">
                    <MailHomeIcon />
                    <span>Lorem, ipsum dolor.</span>
                  </p>
                </li>
                <p className="d-flex gap-1 align-items-center">
                  <MailHomeIcon />
                  <span>GitHub</span>
                </p>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="legal__notice text-center pb-4 pb-md-0"
          style={{ fontSize: "14px" }}
        >
          <p>© 2025 Ravento. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
