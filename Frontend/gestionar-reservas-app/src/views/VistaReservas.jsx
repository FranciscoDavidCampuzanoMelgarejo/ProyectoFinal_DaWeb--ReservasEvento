import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { checkAuth } from "../services/check-auth.js";
import { ReservaCard } from "../components/ReservaCard.jsx";
import { ReservaModal } from "../components/ReservaModal.jsx";
import { useNotification } from "../hooks/useNotification.js";
import { NotificationDialog } from "../components/NotificationDialog.jsx";
import { DialogInfoIcon } from "../assets/icons/DialogIcons/DialogInfo.jsx";
import { DialogErrorIcon } from "../assets/icons/DialogIcons/DialogError.jsx";
import CustomError from "../errors/CustomError.js";

const getReservas = () => {
  return fetch("/api/v1/reserva", {
    method: "GET",
    credentials: "include",
  });
};

export function VistaReservas() {
  const { usuario, logout } = useAuth();
  const [reservasActivas, setReservasActivas] = useState([]);
  const [reservasPrevias, setReservasPrevias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const { notificar } = useNotification();
  const reset = () => {
    checkAuth(getReservas)
      .then((responseFetch) => responseFetch.json())
      .then((data) => {
        setReservasActivas(data.reservas_activas || []);
        setReservasPrevias(data.reservas_previas || []);
      })
      .catch((error) => {
        console.error("Error al cargar reservas:", error);
        if (error instanceof CustomError && error.codigoEstado === 401)
          logout();
      });
  };

  useEffect(() => {
    reset();
  }, []);

  const abrirCrearModal = () => {
    setModoModal("crear");
    setReservaSeleccionada(null);
    setMostrarModal(true);
  };

  const abrirEditarModal = (reserva) => {
    setModoModal("editar");
    setReservaSeleccionada(reserva);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setReservaSeleccionada(null);
    setModoModal("crear");
  };

  const handleAnularReserva = async (id) => {
    try {
      const res = await checkAuth(() =>
        fetch(`/api/v1/reserva/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
      );
      if (res.ok) {
        setReservasActivas((prev) =>
          prev.filter((reserva) => reserva.id !== id)
        );
        notificar("Reserva anulada correctamente", true, () => DialogInfoIcon);
      } else {
        notificar("No se pudo anular la reserva", true, () => DialogInfoIcon);
      }
    } catch (err) {
      console.error("Error al anular reserva:", err);
      if (err instanceof CustomError && err.codigoEstado === 401) logout();
      else notificar("Error al anular reserva", true, () => DialogErrorIcon);
    }
  };

  const manejarSubmit = async (datos) => {
    try {
      const url =
        modoModal === "crear"
          ? "/api/v1/reserva"
          : `/api/v1/reserva/${reservaSeleccionada.id}`;
      const method = modoModal === "crear" ? "POST" : "PATCH";
      const body =
        modoModal === "crear"
          ? JSON.stringify(datos)
          : JSON.stringify({ plazas_reservadas: datos.plazas_reservadas });
      //mirar si se aplica bien el checkAuth
      const response = await checkAuth(() =>
        fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body,
        })
      );
      if (!response.ok) throw new Error("Error al guardar");
      reset();
      cerrarModal();
      notificar("Reserva guardada correctamente", true, () => DialogInfoIcon);
    } catch (err) {
      console.error(err);
      if (err instanceof CustomError && err.codigoEstado === 401) logout();
      else {
        alert("Error al guardar espacio");
        notificar("Error al guardar la reserva", true, () => DialogErrorIcon);
      }
    }
  };

  return (
    <div className="container-fluid px-4 mt-4">
      {usuario?.rol === "CLIENTE" && (
        <div className="d-flex justify-content-end mb-4">
          <button
            className="btn fw--semibold clr--neutral-100"
            style={{
              backgroundColor: "var(--clr-secondary-400)",
              border: "none",
            }}
            onClick={abrirCrearModal}
          >
            Nueva reserva
          </button>
        </div>
      )}
      <h2 className="fs-2 fw-bold text-light mb-4">Reservas Activas</h2>
      <div className="row g-4 mb-5">
        {reservasActivas.length > 0 ? (
          reservasActivas.map((reserva) => (
            <div key={reserva.id} className="col-12 col-sm-6 col-xl-4 d-flex">
              <ReservaCard
                reserva={reserva}
                onEditar={() => abrirEditarModal(reserva)}
                onAnular={() => handleAnularReserva(reserva.id)}
              />
            </div>
          ))
        ) : (
          <p className="text-secondary">No tienes reservas activas.</p>
        )}
      </div>

      <h2 className="fs-2 fw-bold text-light mb-4"> Reservas Previas</h2>
      <div className="row g-4">
        {reservasPrevias.length > 0 ? (
          reservasPrevias.map((reserva) => (
            <div key={reserva.id} className="col-12 col-sm-6 col-xl-4">
              <ReservaCard
                reserva={reserva}
                onEditar={() => {}}
                reset={reset}
              />
            </div>
          ))
        ) : (
          <p className="text-secondary">No tienes reservas previas.</p>
        )}
      </div>
      <ReservaModal
        visible={mostrarModal}
        modo={modoModal}
        reserva={reservaSeleccionada}
        onClose={cerrarModal}
        onSubmit={manejarSubmit}
      />
      <NotificationDialog />
    </div>
  );
}
