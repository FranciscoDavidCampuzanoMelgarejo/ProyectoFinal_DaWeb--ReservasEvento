import { useContext } from "react";
import { NotificationContext } from "../context/contextNotification";

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) 
        throw new Error("No se ha proveido un contexto");
    return context;
}
