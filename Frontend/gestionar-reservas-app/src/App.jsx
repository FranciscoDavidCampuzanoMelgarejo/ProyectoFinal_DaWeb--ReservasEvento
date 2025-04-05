import { Routes, Route, Navigate } from 'react-router-dom';
import { Autenticacion } from './views/Autenticacion.jsx';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' replace/>}></Route>
      <Route path='/login' element={<Autenticacion />}></Route>
      <Route path='/register' element={<Autenticacion />}></Route>
    </Routes>
  )
}

export default App
