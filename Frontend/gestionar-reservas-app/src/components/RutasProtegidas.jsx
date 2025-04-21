import { Outlet } from "react-router";
import { useAutenticacion } from "../hooks/useAutenticacion.js";
import { Home } from "../views/Home.jsx";

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

  return (
    <>
      {isAutenticado ? <Outlet /> : <Home />}
    </>
  );
}
