import { useEffect, useState } from "react";
import { checkAuth } from '../services/check-auth.js';
// Este hook recibe una funcion (FETCH) que hace una peticion al servidor
export function useAutenticacion({ initialCallback }) {
  const [isAutenticado, setIsAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [callback, setCallback] = useState(initialCallback);

  useEffect(() => {
    checkAuth(callback)
        .then(() => setIsAutenticado(true))
        .catch(() => setIsAutenticado(false))
        .finally(() => setCargando(false))
  }, [callback]);

  return {isAutenticado, cargando, setCallback}
}
