import { Outlet, useLocation } from "react-router-dom";
import { useRef } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import "../styles/autenticacion.css";
import { FormularioRegistro } from "../components/FormularioRegistro";
import { FormularioLogin } from "../components/FormularioLogin";

export function Autenticacion() {
  const divRef = useRef(null);
  const location = useLocation();
  const formToRender =
    location.pathname === "/register" ? (
      <FormularioRegistro />
    ) : (
      <FormularioLogin />
    );

  return (
    <div className="auth-view">
      <SwitchTransition mode="out-in">
        <CSSTransition
          appear={true}
          key={location.pathname}
          classNames="autenticacion"
          nodeRef={divRef}
          timeout={150}
          unmountOnExit
        >
          <div ref={divRef} className="auth-view__container min-vh-100 vh-100">
            {formToRender}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}
