import { Navigate, Outlet } from "react-router";
import { useAutenticacion } from "../hooks/useAutenticacion.js";

export function RutasProtegidas() {
  const { isAutenticado, cargando } = useAutenticacion({
    initialCallback: () => (
      fetch('/api/v1/user/check-auth', {
        method: 'POST',
        credentials: "include"
      })
    )
  });


  console.log("Cargando: ", cargando);
  if (cargando) {
    return <div>Cargando...</div>;
  }

  return <>{isAutenticado ? <Outlet /> : <Navigate to="/login" />}</>;
}
