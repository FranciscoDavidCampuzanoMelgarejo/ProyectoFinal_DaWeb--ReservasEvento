import { Routes, Route, Navigate } from 'react-router-dom';
import { Autenticacion } from './views/Autenticacion.jsx';
import { Home } from './views/Home.jsx';
import { FormularioLogin } from './components/FormularioLogin.jsx';
import { FormularioRegistro } from './components/FormularioRegistro.jsx';
import { NotFound } from './views/NotFound.jsx';
import { RutasProtegidas } from './components/RutasProtegidas.jsx';

function App() {

  return (
    <Routes>
      <Route element={<RutasProtegidas />}>
        <Route path='/' element={<Home />}></Route>
      </Route> 
      <Route path='home' element={<Navigate to='/'/>}></Route>
      <Route element={<Autenticacion />}>
        <Route path='login' element={<FormularioLogin />}></Route>
        <Route path='register' element={<FormularioRegistro />}></Route>
      </Route>
      <Route path='*' element={<NotFound />}></Route>
    </Routes>
  )
}

export default App
