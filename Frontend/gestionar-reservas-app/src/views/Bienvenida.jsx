//Este codigo es temporal para mostrar que se ha realizado bien el register y para poder hacer el logout
import { useNavigate } from 'react-router-dom';

export function Bienvenida() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "rgb(113, 212, 236)" }}>
      <div className="text-center p-5 border rounded shadow-lg bg-white">
        <h2>Has iniciado sesión</h2>
        <button className="btn btn-danger mt-4" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}