import { createContext, useEffect, useState } from "react";

// 1. Crear el contexto
export const NotificationContext = createContext();

// 2. Proveer el contexto (creando un componente)
export function NotificationProvider({children}) {
    const [texto, setTexto] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [ComponenteIcono, setComponenteIcono] = useState(null); // Componente

    const notificar = (texto = '', mostrar = false, icono = null) => {
        setTexto(texto);
        setMostrar(mostrar);
        setComponenteIcono(icono);
    }

    return (
        <NotificationContext.Provider value={{
            texto,
            mostrar,
            ComponenteIcono,
            notificar
        }}>
            { children }
        </NotificationContext.Provider>
    )
}