import { Outlet, useLocation } from "react-router-dom";
import { useRef } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import '../Autenticacion.css';

export function Autenticacion () {
  const divRef = useRef(null);
  const location = useLocation();

  return (
    <div className="auth-view">
  <SwitchTransition mode="out-in">
    <CSSTransition
      key={location.pathname}
      appear={true}
      in={true}
      classNames="autenticacion"
      timeout={150}
      nodeRef={divRef}
    >
      <div ref={divRef} className="d-flex justify-content-center align-items-center vh-100 w-100">
        <Outlet />
      </div>
    </CSSTransition>
  </SwitchTransition>
</div>
  )
}


/* export function Autenticacion() {
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
} */
