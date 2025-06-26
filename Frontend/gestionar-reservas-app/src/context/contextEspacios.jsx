import { createContext, useState } from "react";
import { checkAuth } from "../services/check-auth";
import CustomError from "../errors/CustomError";

const espaciosCallback = () => {
  return fetch("/api/v1/espacio", {
    method: "GET",
    credentials: "include",
  });
};

// 1. Crear el contexto
export const EspaciosContext = createContext();

// 2. Proveer el contexto (creando un componente)
export function EspaciosProvider({ children }) {
  const [espacios, setEspacios] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const cargarEspacios = async () => {
    try {
      const responseFetch = await checkAuth(espaciosCallback);
      const data = await responseFetch.json();
      console.log(data);
      setEspacios(data.filter(e => e.estado === 1)); // Obtener espacios no cerrados
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <EspaciosContext.Provider
      value={{
        cargarEspacios,
        setEventoSeleccionado,
        espacios,
        eventoSeleccionado
      }}
    >
      {children}
    </EspaciosContext.Provider>
  );
}
