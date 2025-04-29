import { Routes, Route, Navigate } from 'react-router-dom';
import { Autenticacion } from './views/Autenticacion.jsx';

import { Home } from './views/Home.jsx';
import { Dashboard } from './views/Dashboard.jsx';
import { FormularioLogin } from './components/FormularioLogin.jsx';
import { FormularioRegistro } from './components/FormularioRegistro.jsx';
import { NotFound } from './views/NotFound.jsx';
import { RutasProtegidas } from './components/RutasProtegidas.jsx';
import { PrincipalLayout } from './views/PrincipalLayout';
import { VistaEspacios } from './views/VistaEspacios';
import { CrearEspacio } from './views/CrearEspacio';
import { EditarEspacio } from './views/EditarEspacio';


function App() {

  return (
    <Routes>
      <Route element={<RutasProtegidas />}>
      <Route path='/' element={<Navigate to="/espacios" />} />
      </Route> 
      <Route path='home' element={<Navigate to='/'/>}></Route>
      <Route element={<Autenticacion />}>
        <Route path='login' element={<FormularioLogin />}></Route>
        <Route path='register' element={<FormularioRegistro />}></Route>
      </Route>
      <Route path="/espacios" element={<PrincipalLayout />}>
        <Route index element={<VistaEspacios />} />
        <Route path="nuevo" element={<CrearEspacio />} />
        <Route path="editar/:id" element={<EditarEspacio />} />
      </Route>
      <Route path='*' element={<NotFound />}></Route>
    </Routes>
  )
}

export default App
