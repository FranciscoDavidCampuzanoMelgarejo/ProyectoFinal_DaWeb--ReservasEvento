import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { FormularioLogin } from "../components/FormularioLogin";
import { FormularioRegistro } from "../components/FormularioRegistro";
import '../Autenticacion.css';

export function Autenticacion() {
  const nodeRef = useRef(null);
  let location = useLocation();
  const isLogin = location.pathname === '/login';
  console.log("COMPONENTE AUTENTICACION");

  return (
    <div className="min-vh-100">
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={location.pathname}
          appear={true}
          in={true}
          classNames="autenticacion"
          timeout={150}
          nodeRef={nodeRef}
        >
          <div ref={nodeRef}>
            {isLogin ? <FormularioLogin /> : <FormularioRegistro />}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}
