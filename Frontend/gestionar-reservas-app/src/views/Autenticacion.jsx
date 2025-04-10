import { Outlet, useLocation } from "react-router-dom";
import { useRef } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import '../Autenticacion.css';

export function Autenticacion () {
  const divRef = useRef(null);
  let location = useLocation();
  return (
    <div className="auth-view min-vh-100">
      <h2>Layout Autenticacion</h2>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={location.pathname}
          appear={true}
          in={true}
          classNames='autenticacion'
          timeout={150}
          nodeRef={divRef}>

            <div ref={divRef}>
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
