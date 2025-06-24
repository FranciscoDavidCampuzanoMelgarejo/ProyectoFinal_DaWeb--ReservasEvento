import { createContext, useState } from "react";
import { checkAuth } from "../services/check-auth";

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
  const [idEspacio, setIdEspacio] = useState(null);

  const cargarEspacios = async () => {
    try {
      const responseFetch = await checkAuth(espaciosCallback);
      const data = await responseFetch.json();
      console.log(data);
      setEspacios(data.filter(e => e.estado === 1)); // Obtener espacios no cerrados
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <EspaciosContext.Provider
      value={{
        cargarEspacios,
        setIdEspacio,
        espacios,
        idEspacio
      }}
    >
      {children}
    </EspaciosContext.Provider>
  );
}
