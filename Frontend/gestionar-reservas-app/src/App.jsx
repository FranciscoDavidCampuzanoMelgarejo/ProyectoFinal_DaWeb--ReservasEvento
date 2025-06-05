import { Routes, Route, Navigate } from "react-router-dom";
import { Autenticacion } from "./views/Autenticacion.jsx";

import { RutasProtegidas } from "./components/RutasProtegidas.jsx";

import { Dashboard } from "./views/Dashboard.jsx";
import { FormularioLogin } from "./components/FormularioLogin.jsx";
import { FormularioRegistro } from "./components/FormularioRegistro.jsx";
import { NotFound } from "./views/NotFound.jsx";
import { useAuth } from "./hooks/useAuth.js";

import { PrincipalLayout } from "./views/PrincipalLayout";
import { VistaEspacios } from "./views/VistaEspacios";
import { VistaEventos } from "./views/VistaEventos.jsx";
import { VistaReservas } from "./views/VistaReservas.jsx";
import { VistaReservasAdmin } from "./views/VistaReservasAdmin.jsx";

import { NotificationProvider } from "./context/contextNotification.jsx";
import { NotificationDialog } from "./components/NotificationDialog.jsx";

function App() {
  const { cargando } = useAuth();

  if (cargando) return <div>Cargando sesión...</div>;

  return (
    <NotificationProvider>
       <Routes>
      <Route element={<RutasProtegidas />}>
        <Route element={<PrincipalLayout />}>
          <Route path="eventos" element={<VistaEventos />} />
          <Route path="espacios">
            <Route index element={<VistaEspacios />} />
          </Route>
          <Route path="reservas" element={<VistaReservas />}/>
          <Route path="admin/reservas" element={<VistaReservasAdmin/>}/>
        </Route>
      </Route>

      <Route path="home" element={<Navigate to="/eventos" />}></Route>
      <Route path="/" element={<Navigate to='/eventos' />}></Route>
      <Route element={<Autenticacion />}>
        <Route path="login" element={<FormularioLogin />}></Route>
        <Route path="register" element={<FormularioRegistro />}></Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
      <NotificationDialog />
    </NotificationProvider>
  );
}

export default App;
