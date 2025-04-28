import { createContext, useState } from "react";

// 1. Crear el contexto
export const AuthContext = createContext();

// 2. Proveer el contexto
export function AuthProvider ({ children }) {
    const [usuario, setUsuario] = useState({
        id: null,
        nombre: null,
        apellidos: null,
        rol: null,
        isLogged: false
    });

    const login = (usuario) => {
        setUsuario({
            ...usuario,
            isLogged: true
        })
    }

    const logout = () => setUsuario({
        id: null,
        nombre: null,
        apellidos: null,
        rol: null,
        isLogged: false
    });

    return (
        <AuthContext.Provider value={{
            usuario,
            setUsuario,
            login,
            logout
        }}>
            { children }
        </AuthContext.Provider>
    );
}