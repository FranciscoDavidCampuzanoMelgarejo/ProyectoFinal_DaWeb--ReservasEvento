import { Outlet, NavLink } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";

import "../PrincipalLayout.css";

export function PrincipalLayout() {
  return (
    <div className="layout-principal bg--primary-700">
      <Navbar />

      {/* <main className="contenido-principal">
        <Outlet />
      </main> */}
    </div>
  );
}
