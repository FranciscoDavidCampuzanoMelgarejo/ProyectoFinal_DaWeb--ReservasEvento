import { useEffect, useState } from "react";
import { InputField } from "./InputField.jsx";
import { categorias } from "../constants/const_categoria.js";

import "../styles/create_event_dialog.css";
import { useEspacios } from "../hooks/useEspacios.js";
import { checkAuth } from "../services/check-auth.js";
import { DialogInfoIcon } from "../assets/icons/DialogIcons/DialogInfo.jsx";
import { useNotification } from "../hooks/useNotification.js";
import { DialogErrorIcon } from "../assets/icons/DialogIcons/DialogError.jsx";
import { formatearFechaParaInput } from "../utils/formatearFecha.js";

const crearEventoCallback = (evento, ruta, metodo) => {
  return () => {
    return fetch(ruta, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(evento),
    });
  };
};

const actualizarEventoCallback = (evento) => {
  return () => {
    return fetch(`/api/v1/evento/${evento.id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(evento)
    })
  }
}

export function CreateEventDialog({ ref, reset }) {
  const { notificar } = useNotification();
  const { espacios, eventoSeleccionado, setEventoSeleccionado } = useEspacios();
  const [edicion, setEdicion] = useState(false);
  const [formData, setFormData] = useState({
    nombre: {
      valor: "",
      error: null,
    },
    descripcion: {
      valor: "",
      error: null,
    },
    organizador: {
      valor: "",
      error: null,
    },
    plazas: {
      valor: "",
      error: null,
    },
    categoria: {
      valor: "",
      error: null,
    },
    fecha_inicio: {
      valor: "",
      error: null,
    },
    fecha_fin: {
      valor: "",
      error: null,
    },
    id_espacio: {
      valor: "",
      error: null,
    },
  });

  useEffect(() => {
    if(eventoSeleccionado !== null) {
      console.log("EDITANDO EVENTO");
      setEdicion(true);
      let newFormData = {};
      Object.keys(formData).forEach((campo) => {
        let valor = eventoSeleccionado[campo];
  
        // Si el campo es fecha, lo formateamos para el input
        if (campo === "fecha_inicio" || campo === "fecha_fin") {
          valor = formatearFechaParaInput(valor);
        } else {
          valor = valor?.toString() ?? "";
        }
  
        newFormData[campo] = {
          valor,
          error: null,
        };
      });
      setFormData(newFormData);
      console.log(formData);
    }
  }, [eventoSeleccionado])

  const isHabilitado = () => {
    return Object.values(formData).every(
      (campo) => campo.valor.trim() !== "" && campo.error === null
    );
  };

  const handleChange = (e) => {
    const campo = e.target.name;
    const valor = e.target.value;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [campo]: {
          ...prev[campo],
          valor,
        },
      };

      // Validacion de plazas
      if (campo === "plazas" && (isNaN(valor) || parseInt(valor) <= 0))
        updated.plazas.error = "Establecer un numero mayor que 0";
      else updated.plazas.error = null;

      // Validación de fechas
      const fechaInicio =
        campo === "fecha_inicio" ? valor : prev.fecha_inicio.valor;
      const fechaFin = campo === "fecha_fin" ? valor : prev.fecha_fin.valor;

      // Si ambas fechas están presentes, validamos
      if (fechaInicio && fechaFin) {
        const esInvalida = new Date(fechaInicio) >= new Date(fechaFin);

        updated.fecha_inicio.error = esInvalida
          ? "La fecha de inicio debe ser anterior a la fecha de fin"
          : null;
        updated.fecha_fin.error = esInvalida
          ? "La fecha de fin debe ser posterior a la fecha de inicio"
          : null;
      }

      return updated;
    });
  };

  const handleClick = async () => {
    const ruta = edicion ? `/api/v1/evento/${eventoSeleccionado.id}` : '/api/v1/evento';
    const metodo = edicion ? 'PATCH' : 'POST';
    try {
      const responseFetch = await checkAuth(
        crearEventoCallback({
          nombre: formData.nombre.valor,
          descripcion: formData.descripcion.valor,
          organizador: formData.organizador.valor,
          plazas: parseInt(formData.plazas.valor),
          categoria: formData.categoria.valor,
          fecha_inicio: formData.fecha_inicio.valor,
          fecha_fin: formData.fecha_fin.valor,
          id_espacio: formData.id_espacio.valor,
        }, ruta, metodo)
      );

      if (!responseFetch.ok) {
        const data = await responseFetch.json();
        console.log(data);
        throw new Error(data.mensaje_error || "Error al procesar la solicitud");
      }

      reset();
      closeDialog();
      const texto = edicion ? 'editado' : 'creado'
      notificar(`Evento ${texto} con éxito`, true, () => DialogInfoIcon);
    } catch (error) {
      closeDialog();
      notificar(error.message, true, () => DialogErrorIcon);
    }
  };

  const closeDialog = () => {
    setEdicion(false);
    let newFormData = {};
    Object.keys(formData).forEach(campo => {
      newFormData[campo] = {
        valor: "",
        error: null
      }
    });
    setFormData(newFormData);
    setEventoSeleccionado(null);
    ref.current?.close();
  };

  return (
    <dialog
      ref={ref}
      id="createDialogEvent"
      className="create__event__dialog container-fluid position-fixed top-50 start-50 translate-middle border-0 p-0 m-0 rounded-4"
    >
      <form
        id="formularioEvento"
        className="event_form text-white py-5 px-3 px-sm-4 px-md-5 bg--primary-500"
      >
        <header className="text-center mb-4">
          <div>{/* LOGO */}</div>
          <div>
            <h1 className="fs--title fw--semibold">Crear evento</h1>
          </div>
        </header>

        <div className="camposFormulario d-flex flex-column gap-4 mb-5">
          <InputField
            name="nombre"
            label="nombre"
            error={formData.nombre.error}
          >
            <input
              type="text"
              name="nombre"
              value={formData.nombre.valor}
              onChange={handleChange}
            />
          </InputField>

          <InputField
            name="descripcion"
            label="descripción"
            error={formData.descripcion.error}
          >
            <textarea
              name="descripcion"
              className="event__tarea"
              value={formData.descripcion.valor}
              rows={3}
              onChange={handleChange}
            />
          </InputField>

          <InputField
            name="organizador"
            label="organizador"
            error={formData.organizador.error}
          >
            <input
              type="text"
              name="organizador"
              value={formData.organizador.valor}
              onChange={handleChange}
            />
          </InputField>

          <InputField
            name="plazas"
            label="plazas"
            error={formData.plazas.error}
          >
            <input
              type="text"
              name="plazas"
              value={formData.plazas.valor}
              onChange={handleChange}
            />
          </InputField>

          <InputField
            name="categoria"
            label="categoría"
            error={formData.categoria.error}
          >
            <select
              name="categoria"
              value={formData.categoria.valor}
              onChange={handleChange}
            >
              <option value="" disabled>
                Selecciona una categoria
              </option>
              {Object.values(categorias).map((valor) => (
                <option key={valor} value={valor}>
                  {valor}
                </option>
              ))}
            </select>
          </InputField>

          <InputField
            name="fecha_inicio"
            label="Inicio"
            error={formData.fecha_inicio.error}
          >
            <input
              type="datetime-local"
              name="fecha_inicio"
              value={formData.fecha_inicio.valor || ""}
              onChange={handleChange}
            />
          </InputField>

          <InputField
            name="fecha_fin"
            label="Fin"
            error={formData.fecha_fin.error}
          >
            <input
              type="datetime-local"
              name="fecha_fin"
              value={formData.fecha_fin.valor || ""}
              onChange={handleChange}
            />
          </InputField>

          <InputField
            name="id_espacio"
            label="espacio físico"
            error={formData.id_espacio.error}
          >
            <select
              name="id_espacio"
              value={formData.id_espacio.valor}
              onChange={handleChange}
            >
              <option value="" disabled>
                Selecciona un espacio
              </option>
              {espacios.map((espacio) => (
                <option key={espacio.id} value={espacio.id}>
                  {espacio.nombre}
                </option>
              ))}
            </select>
          </InputField>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button
            type="button"
            disabled={!isHabilitado()}
            onClick={handleClick}
            className="w-100 btn bg--secondary-400 clr--neutral-100 fw--semibold"
          >
            {edicion ? 'Editar' : 'Crear'}
          </button>
          <button
            type="button"
            className="w-100 btn btn-outline-light"
            onClick={closeDialog}
          >
            Cancelar
          </button>
        </div>
      </form>
    </dialog>
  );
}
