import { Outlet, NavLink } from 'react-router-dom';
import '../PrincipalLayout.css';

export function PrincipalLayout() {
  return (
    <div className="layout-principal">
      <nav className="navbar-principal">
        <NavLink to="/espacios" className="nav-item">Espacios</NavLink>
        <NavLink to="/espacios/nuevo" className="nav-item">Nuevo espacio</NavLink>
      </nav>

      <main className="contenido-principal">
        <Outlet />
      </main>
    </div>
  );
}