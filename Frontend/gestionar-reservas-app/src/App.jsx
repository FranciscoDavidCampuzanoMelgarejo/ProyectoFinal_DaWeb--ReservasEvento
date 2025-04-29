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
import { CrearEspacio } from "./views/CrearEspacio";
import { EditarEspacio } from "./views/EditarEspacio";

function App() {
  const { cargando } = useAuth();

  if (cargando) return <div>Cargando sesión...</div>;

  return (
    <Routes>
      <Route element={<RutasProtegidas />}>
        <Route path="/espacios" element={<PrincipalLayout />}>
          <Route index element={<VistaEspacios />} />
          <Route path="nuevo" element={<CrearEspacio />} />
          <Route path="editar/:id" element={<EditarEspacio />} />
        </Route>
      </Route>

      <Route path="home" element={<Navigate to="/espacios" />}></Route>
      <Route path="/" element={<Navigate to='/espacios' />}></Route>
      <Route element={<Autenticacion />}>
        <Route path="login" element={<FormularioLogin />}></Route>
        <Route path="register" element={<FormularioRegistro />}></Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}

export default App;
