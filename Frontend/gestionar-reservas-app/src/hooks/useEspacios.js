import { useContext } from "react";
import { EspaciosContext } from "../context/contextEspacios.jsx";

export function useEspacios() {
    const context = useContext(EspaciosContext);
    if (!context) 
        throw new Error("No se ha proveido un contexto");
    return context;
}
