import { Outlet } from "react-router";
import { Home } from "../views/Home.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { checkAuth } from "../services/check-auth.js";

const authCallback = () => {
  return fetch("/api/v1/user/check-auth", {
    method: "POST",
    credentials: "include",
  });
};

export function RutasProtegidas() {
  const [cargando, setCargando] = useState(true);
  const { usuario, login, logout } = useAuth();
  useEffect(() => {
    checkAuth(authCallback)
      .then((responseFetch) => responseFetch.json())
      .then((data) => {
        const { id, nombre, apellidos, rol } = data;
        login({
          id,
          nombre,
          apellidos,
          rol,
        });
      })
      .catch((error) => {
        console.log(error);
        // ¿logout?
        logout();
      })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <div>Cargando...</div>;

  return <>{usuario.isLogged ? <Outlet /> : <Home />}</>;
}
