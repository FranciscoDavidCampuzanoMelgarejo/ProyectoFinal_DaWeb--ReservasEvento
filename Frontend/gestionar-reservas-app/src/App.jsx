import { Routes, Route, Navigate } from 'react-router-dom';
import { Autenticacion } from './views/Autenticacion.jsx';
import { Bienvenida } from './views/Bienvenida.jsx';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' replace/>}></Route>
      <Route path='/login' element={<Autenticacion />}></Route>
      <Route path='/register' element={<Autenticacion />}></Route>
      <Route path='/bienvenida' element={<Bienvenida />} />
    </Routes>
  )
}

export default App
