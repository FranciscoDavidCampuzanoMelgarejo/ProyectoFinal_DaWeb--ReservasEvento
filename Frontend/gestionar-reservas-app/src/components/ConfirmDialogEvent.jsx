import { ActiveEventIcon } from "../assets/icons/ActiveEvent.jsx";
import { DialogActiveEventIcon } from "../assets/icons/DialogIcons/DialogActiveEvent";
import { DialogCancelEventIcon } from "../assets/icons/DialogIcons/DialogCancelEvent";
import { DialogErrorIcon } from "../assets/icons/DialogIcons/DialogError.jsx";
import { DialogInfoIcon } from "../assets/icons/DialogIcons/DialogInfo.jsx";
import { useNotification } from "../hooks/useNotification.js";
import { checkAuth } from "../services/check-auth.js";
import "../styles/confirm_dialog_event.css";

const fetchEventState = (id, cancelado) => {
  return () => {
    return fetch(`api/v1/evento/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        cancelado,
      }),
    });
  };
};

export function ConfirmDialogEvent({ id, cancelado, ref, reset }) {

  const { notificar } = useNotification();

  const textState = cancelado ? "Activar" : "Suspender";
  const classState = cancelado ? "activar" : "cancelar";

  const closeDialog = () => ref.current?.close();

  const handleClick = async () => {
    let texto = '';
    let dialogIcon = null;
    try {
      const responseFetch = await checkAuth(fetchEventState(id, !cancelado));

      if (!responseFetch.ok) {
        const data = await responseFetch.json();
        console.log(data);
        throw new Error(data.mensaje_error || 'Error al procesar la solicitud');
      }

      texto = cancelado ? 'Evento activado' : 'Evento suspendido';
      dialogIcon = () => DialogInfoIcon;
      
      console.log("RESET")
      reset();
    } catch (error) {
      texto = error.message
      dialogIcon = () => DialogErrorIcon;
    } finally {
      ref.current?.close();
      notificar(texto, true, dialogIcon);
    }
  };

  return (
    <dialog
      ref={ref}
      id="confirmDialogEvent"
      className="conf_dialog position-fixed top-50 start-50 translate-middle text-center p-4 rounded-4 bg--primary-500 clr--neutral-100 border-0"
    >
      <div className="dEvent__header d-flex flex-column align-items-center justify-content-center gap-2 mb-4">
        <div>
          {cancelado ? (
            <DialogActiveEventIcon width={76} height={76} />
          ) : (
            <DialogCancelEventIcon width={76} height={76} />
          )}
        </div>
        <h1 className="fs--dialog-title fw--semibold">{textState} evento</h1>
        <p className="fs--dialog-text clr--neutral-300">
          ¿Estas seguro de que deseas{" "}
          <span className="text-lowercase">{textState}</span> este evento?
        </p>
      </div>

      <div className="dEvent__buttons d-flex flex-column align-items-center justify-content-center gap-2">
        <button
          className={`${classState} w-100 border-0 py-2 text-center rounded-3 fs--dialog-text`}
          type="submit"
          onClick={handleClick}
        >
          {textState}
        </button>
        <button
          className="w-100 border-0 py-2 text-center rounded-3 fs--dialog-text"
          type="button"
          onClick={closeDialog}
        >
          Cancelar
        </button>
      </div>
    </dialog>
  );
}
