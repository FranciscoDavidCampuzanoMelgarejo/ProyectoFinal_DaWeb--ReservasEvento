import { Outlet, useLocation } from "react-router-dom";
import { useRef } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import "../styles/autenticacion.css";

export function Autenticacion() {
  const divRef = useRef(null);
  const location = useLocation();

  return (
    <div className="auth-view">
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={location.pathname}
          classNames="autenticacion"
          nodeRef={divRef}
          timeout={300}
          unmountOnExit
        >
          <div ref={divRef} className="auth-view__container min-vh-100 vh-100">
            <Outlet key={location.pathname} />
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}
