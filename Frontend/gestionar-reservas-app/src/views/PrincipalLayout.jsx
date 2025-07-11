import { Outlet, NavLink } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";

// import "../PrincipalLayout.css";
import "../styles/principal_layout.css";
import { EspaciosProvider } from "../context/contextEspacios.jsx";

export function PrincipalLayout() {
  return (
    <div className="layout_principal min-vh-100 bg--primary-700">
      <Navbar />

      <main className="contenido_principal">
        <EspaciosProvider>
          <Outlet />
        </EspaciosProvider>
      </main>
    </div>
  );
}
