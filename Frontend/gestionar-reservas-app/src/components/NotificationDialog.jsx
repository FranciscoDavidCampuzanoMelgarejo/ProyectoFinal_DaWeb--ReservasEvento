import { useEffect, useRef } from "react";
import { useNotification } from "../hooks/useNotification.js";

import '../styles/notification_dialog.css';

export function NotificationDialog () {
    const { texto, mostrar, ComponenteIcono, notificar } = useNotification();
    const dialogRef = useRef();

    useEffect(() => {
        console.log("DIALOGO NOTIFICACION");
        if(mostrar) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
            
    }, [mostrar])

   if(!mostrar)
    return null;

    return (
        <dialog id="dialogoNotificacion" ref={dialogRef} className="dialog_notification position-absolute top-50 start-50 translate-middle p-4 d-flex flex-column align-items-center justify-content-center gap-3 border-0 rounded-3 bg--primary-800 clr--neutral-100">
            <div>
                {
                    ComponenteIcono && <ComponenteIcono width={56} height={56}/>
                }
            </div>
            
            <div className="fs--notification-text fw-medium text-center">
                <p>
                    {texto}
                </p>
            </div>

            <div className="w-100 fs--notification-btn">
                <button type="button" className="notification__btn w-100 border-0 rounded-3 p-2" onClick={() => notificar()}>
                    Cerrar
                </button>
            </div>
        </dialog>
    )
}