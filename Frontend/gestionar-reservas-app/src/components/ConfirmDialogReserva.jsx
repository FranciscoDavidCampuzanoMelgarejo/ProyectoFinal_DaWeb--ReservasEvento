import { DialogCancelEventIcon } from "../assets/icons/DialogIcons/DialogCancelEvent.jsx";
import { DialogErrorIcon } from "../assets/icons/DialogIcons/DialogError.jsx";
import { DialogInfoIcon } from "../assets/icons/DialogIcons/DialogInfo.jsx";
import { useNotification } from "../hooks/useNotification.js";
import { checkAuth } from "../services/check-auth.js";
import "../styles/confirm_dialog_event.css";

const fetchAnularReserva = (id) => {
  return () => 
    fetch(`api/v1/reserva/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
};

export function ConfirmDialogReserva({ ref, onConfirm}) {

  const { notificar } = useNotification();
  const closeDialog = () => ref.current?.close();

  const handleClick=async()=>{
    let texto="";
    let dialogIcon=null;
    try{
      await onConfirm();
      texto="Reserva anulada correctamente";
      dialogIcon = () => DialogInfoIcon;
    } catch (error) {
      texto = error.message
      dialogIcon = () => DialogErrorIcon;
    } finally {
      closeDialog();
      notificar(texto, true, dialogIcon);
    }
  };

  return (
    <dialog
      ref={ref}
      id="confirmDialogReserva"
      className="conf_dialog position-fixed top-50 start-50 translate-middle text-center p-4 rounded-4 bg--primary-500 clr--neutral-100 border-0"
    >
      <div className="dEvent__header d-flex flex-column align-items-center justify-content-center gap-2 mb-4">
        <DialogCancelEventIcon width={76} height={76} />
        <h1 className="fs--dialog-title fw--semibold">Anular reserva </h1>
        <p className="fs--dialog-text clr--neutral-300">
            Estas seguro de querer eliminar la reserva?
        </p>
        </div>
        <div className="dEvent__buttons d-flex flex-column align-items-center justify-content-center gap-2">
        <button 
        className="cancelar w-100 border-0 py-2 text-center rounded-3 fs--dialog-text" 
        type="button" 
        onClick={handleClick}
        >
        Anular
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
