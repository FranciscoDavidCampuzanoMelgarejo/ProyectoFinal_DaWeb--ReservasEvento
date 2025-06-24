import { useState } from "react";
import { InputField } from "./InputField";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/register.css";
import { checkEmail, checkPassword } from "../utils/validarCampos.js";

export function FormularioRegistro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: {
      valor: "",
      error: null,
    },
    apellidos: {
      valor: "",
      error: null,
    },
    email: {
      valor: "",
      error: null,
    },
    password: {
      valor: "",
      error: null,
    },
    confirmarPassword: {
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

    const error = comprobarError(campo, valor);

    setFormData((prev) => ({
      ...prev,
      [campo]: {
        ...prev[campo],
        valor,
        error,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("REGISTRANDO USUARIO");

    try {
      const respuestaFetch = await fetch("/api/v1/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
        body: JSON.stringify({
          nombre: formData.nombre.valor,
          apellidos: formData.apellidos.valor,
          email: formData.email.valor,
          password: formData.password.valor,
        }),
      });

      if (!respuestaFetch.ok) {
        switch (respuestaFetch.status) {
          case 409:
            console.log("Ya existe ese usuario");
            setFormData((prev) => ({
              ...prev,
              email: {
                ...prev.email,
                valor: "",
                error: "Correo electrónico en uso",
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
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  /* FUNCIONES AUXILIARES */
  /* Devuelve el error (mensaje) si se ha producido un error o null*/
  function comprobarError(campo, valor) {
    if (valor.trim() === "") return "Obligatorio";

    switch (campo) {
      case "email":
        {
          if (!checkEmail(valor)) return "Correo electrónico incorrecto";
        }
        break;
      case "password":
        {
          if (!checkPassword(valor))
            return "La contraseña debe contener al menos 5 caracteres";
        }
        break;
      case "confirmarPassword": {
        if (formData.password.valor !== valor)
          return "No coincide con la contraseña";
        break;
      }
      default:
        return null;
    }
    return null;
  }

  return (
    <form
      id="formularioRegistro"
      className="register_form text-white container-fluid py-5 px-3 px-sm-4 px-md-5 bg--primary-500"
      onSubmit={handleSubmit}
    >
      <header className="text-center mb-5">
        <div>{/* LOGO */}</div>
        <div>
          <h1 className="fs--title fw--semibold">Crear una cuenta</h1>
        </div>
      </header>

      <div className="camposFormulario d-flex flex-column gap--campos mb-5">
        <InputField name="nombre" label="nombre" error={formData.nombre.error}>
          <input
            type="text"
            name="nombre"
            value={formData.nombre.valor}
            onChange={handleChange}
          />
        </InputField>

        <InputField
          name="apellidos"
          label="apellidos"
          error={formData.apellidos.error}
        >
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos.valor}
            onChange={handleChange}
          />
        </InputField>

        <InputField
          name="email"
          label="correro electrónico"
          error={formData.email.error}
        >
          <input
            type="text"
            name="email"
            value={formData.email.valor}
            onChange={handleChange}
          />
        </InputField>

        <InputField
          name="password"
          label="contraseña"
          error={formData.password.error}
        >
          <input
            type="password"
            name="password"
            value={formData.password.valor}
            onChange={handleChange}
          />
        </InputField>

        <InputField
          name="confirmarPassword"
          label="confirmar contraseña"
          error={formData.confirmarPassword.error}
        >
          <input
            type="password"
            name="confirmarPassword"
            value={formData.confirmarPassword.valor}
            onChange={handleChange}
          />
        </InputField>
      </div>

      <div className="mb-2">
        <button
          disabled={!isHabilitado()}
          className={`btn__registro ${classHabilitado} w-100 p-2 rounded-1`}
          type="submit"
        >
          Registrarse
        </button>
      </div>
      <div className="fs--link">
        <span>
          <Link className="link_login" to="/login">
            ¿Ya tienes una cuenta?
          </Link>
        </span>
      </div>
    </form>
  );
}
