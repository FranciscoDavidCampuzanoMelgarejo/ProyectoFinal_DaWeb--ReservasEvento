import { createContext, useEffect, useState } from "react";
import { checkAuth } from "../services/check-auth";

// 1. Crear el contexto
export const AuthContext = createContext();

const authCallback = () => {
    return fetch("/api/v1/user/check-auth", {
      method: "POST",
      credentials: "include",
    });
  };

// 2. Proveer el contexto
export function AuthProvider({ children }) {
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState(() => {
    const usuarioLogueado = localStorage.getItem("usuario");
    return usuarioLogueado
      ? JSON.parse(usuarioLogueado)
      : {
          id: null,
          nombre: null,
          apellidos: null,
          rol: null,
          isLogged: false,
        };
  });

  const login = (usuario) => {
    const usuarioLogueado = { ...usuario, isLogged: true };
    setUsuario(usuarioLogueado);
    localStorage.setItem("usuario", JSON.stringify(usuarioLogueado));
  };

  const logout = () => {
    setUsuario({
      id: null,
      nombre: null,
      apellidos: null,
      rol: null,
      isLogged: false,
    });
    localStorage.removeItem("usuario");
  };

  useEffect(() => {
    if(!usuario.isLogged) {
        checkAuth(authCallback)
            .then(responseFetch => responseFetch.json())
            .then(data => {
                const { id, nombre, apellidos, rol } = data;
                login({
                    id,
                    nombre,
                    apellidos,
                    rol
                });
            })
            .catch(error => {
                // console.log(error);
                logout();
            })
            .finally(() => setCargando(false));
    } else {
        setCargando(false);
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
