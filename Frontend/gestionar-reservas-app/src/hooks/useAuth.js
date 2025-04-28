import { useContext } from "react";
import { AuthContext } from "../context/contextAuth";

export function useAuth() {
    const context = useContext(AuthContext);

    if(!context) 
        throw new Error('No se ha proveido un contexto');
    return context;
}