import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

import { Link } from "react-router-dom";
import { InputField } from "./InputField";
import "../styles/login.css";

export function FormularioLogin() {
  const navigate = useNavigate();
  const { usuario, login } = useAuth();
  
  useEffect(() => {
    console.log("USE EFFECT LOGIN");
    if (usuario.isLogged) 
      navigate("/");
  }, []);

  const [formData, setFormData] = useState({
    email: {
      valor: "",
      error: null,
    },
    password: {
      valor: "",
      error: null,
    },
  });

  const isHabilitado = () => {
    return Object.values(formData).every(
      (campo) => campo.valor.trim() !== "" && campo.error === null
    );
  };
  const classHabilitado = isHabilitado() ? "enabled" : "";

  const handleChange = (e) => {
    const campo = e.target.name;
    const valor = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [campo]: {
        ...prev[campo],
        valor,
        error: null,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuestaFetch = await fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.valor,
          password: formData.password.valor,
        }),
      });

      if (!respuestaFetch.ok) {
        switch (respuestaFetch.status) {
          case 404:
            console.log("No existe ningun usuario con esas credenciales");
            setFormData((prev) => ({
              ...prev,
              email: {
                valor: "",
                error: "Credenciales incorrectas",
              },
              password: {
                valor: "",
                error: "Credenciales incorrectas",
              },
            }));
            break;
          case 500:
            console.log("Error en el servidor");
            break;
          default:
            break;
        }
        return;
      }
      // Guardar en el contexto al nuevo usuario
      const usuario = await respuestaFetch.json();
      login({
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        rol: usuario.rol,
      });
      console.log("USUARIO LOGUEADO");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      id="formularioLogin"
      className="login_form text-white container-fluid py-5 px-3 px-sm-4 px-md-5 bg--primary-500"
      onSubmit={handleSubmit}
    >
      <header className="text-center mb-5">
        <div>{/* LOGO */}</div>
        <div>
          <h1 className="fs--title fw--semibold">Iniciar Sesión</h1>
        </div>
      </header>

      <div className="camposFormulario d-flex flex-column gap--campos mb-5">
        <InputField
          name="email"
          label="correo electrónico"
          type="email"
          value={formData.email.valor}
          error={formData.email.error}
          onChange={handleChange}
        />
        <InputField
          name="password"
          label="contraseña"
          type="password"
          value={formData.password.valor}
          error={formData.password.error}
          onChange={handleChange}
        />
      </div>

      <div className="mb-2">
        <button
          disabled={!isHabilitado()}
          className={`btn__login ${classHabilitado} w-100 p-2 rounded-1`}
          type="submit"
        >
          Iniciar sesión
        </button>
      </div>
      <div>
        <p className="clr--neutral-300 fs--link">
          ¿Necesitas una cuenta?
          <span className="ps-1">
            <Link className="link_register" to="/register">
              Registrarse
            </Link>
          </span>
        </p>
      </div>
    </form>
  );
}
