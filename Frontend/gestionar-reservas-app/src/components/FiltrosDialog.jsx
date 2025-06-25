import { useState } from "react";
import { categorias } from "../constants/const_categoria.js";
import "../styles/create_event_dialog.css";
import { useEspacios } from "../hooks/useEspacios";

export function FiltrosDialog({ ref, actualizarFiltros }) {
  const { espacios } = useEspacios();
  const [categoria, setCategoria] = useState("");
  const [idEspacio, setIdEspacio] = useState("");
  const [plazasMin, setPlazasMin] = useState("");

  const closeDialog = () => {
    ref.current?.close();
  };

  const limpiarFiltros = () => {
    setCategoria("");
    setIdEspacio("");
    setPlazasMin("");
    actualizarFiltros({});
    closeDialog();
  };

  const handleChange = (e) => {
    const campo = e.target.name;
    const valor = e.target.value;

    switch (campo) {
      case "plazas":
        if (!isNaN(valor) && parseInt(valor) > 0) setPlazasMin(parseInt(valor));
        break;

      case "categorias":
        setCategoria(valor);
        break;
      case "espacios":
        if(!isNaN(valor))
            setIdEspacio(parseInt(valor));
        break;
      default:
        break;
    }
  };

  const handleClick = () => {
    actualizarFiltros({
      categoria,
      espacio: idEspacio,
      plazas: plazasMin,
    });
    closeDialog();
  };

  return (
    <dialog
      ref={ref}
      id="filterDialog"
      className="create__event__dialog container-fluid position-fixed top-50 start-50 translate-middle border-0 p-0 m-0 rounded-4"
    >
      <form
        id="formularioFiltros"
        className="event_form text-white py-5 px-3 px-sm-4 px-md-5 bg--primary-500"
      >
        <header className="text-center mb-4">
          <div>{/* LOGO */}</div>
          <div>
            <h1 className="fs--title fw--semibold">Filtros</h1>
          </div>
        </header>

        <div className="camposFormulario d-flex flex-column gap-4 mb-5">
          <div>
            <p>Plazas mínimas</p>
            <input
              name="plazas"
              type="text"
              value={plazasMin}
              onChange={handleChange}
            />
          </div>

          <div>
            <p>Categoria</p>
            <select name="categorias" value={categoria} onChange={handleChange}>
              <option value="" disabled>
                Selecciona una categoria
              </option>
              {Object.values(categorias).map((valor) => (
                <option key={valor} value={valor}>
                  {valor}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p>Espacios</p>
            <select name="espacios" value={idEspacio} onChange={handleChange}>
              <option value="" disabled>
                Selecciona un espacio
              </option>
              {espacios.map((espacio) => (
                <option key={espacio.id} value={espacio.id}>
                  {espacio.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button
            type="button"
            onClick={handleClick}
            className="w-100 btn bg--secondary-400 clr--neutral-100 fw--semibold"
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            onClick={limpiarFiltros}
            className="w-100 btn bg--secondary-400 clr--neutral-100 fw--semibold"
          >
            Reset
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
