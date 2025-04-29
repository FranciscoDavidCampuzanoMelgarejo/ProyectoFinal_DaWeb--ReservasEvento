import { useAuth } from "../hooks/useAuth.js";

import { Outlet } from "react-router";
import { Home } from "../views/Home.jsx";

export function RutasProtegidas() {
  const { usuario, cargando } = useAuth();

  if (cargando) return <div>Cargando...</div>;

  return <>{usuario.isLogged ? <Outlet /> : <Home />}</>;
}
