import { useEffect, useState } from "react";
import { getEventosDisponibles } from "../services/get-eventos-disponibles";

export function ReservaModal({visible, modo, reserva, onClose, onSubmit}){
    const [formData, setFormData]=useState({
        id_evento:"",
        plazas_reservadas:"",
    });

    const[eventos, setEventos]= useState([]);
    const[maxPlazas, setMaxPlazas]=useState(null);
    const [errores, setErrores] = useState({});
    const resetFormulario=()=>{
        setFormData({id_evento:"", plazas_reservadas:""});
        setErrores({});
        setMaxPlazas(null);
        onClose();
    };
    useEffect(() => {
        
        getEventosDisponibles()
        .then(res=>res.json())
        .then(data=>{
            const filtrados=data.filter(ev=>!ev.cancelado && new Date(ev.fecha_inicio)> new Date());
            setEventos(filtrados);
        });
            
        if(modo==="crear"){
            setFormData({ id_evento:"", plazas_reservadas:""});
            setMaxPlazas(null);
        }
        if (modo === "editar" && reserva) {
            setFormData({
                id_evento: reserva.id_evento,
                plazas_reservadas: reserva.plazas_reservadas,
            });
            setMaxPlazas(null);
        }
    }, [modo, reserva]);

    //Para limitar las plazas en el formulario
    useEffect(()=>{
        if((modo==="crear" || modo==="editar") && formData.id_evento){
            const evento= eventos.find(
                (ev)=> ev.id===parseInt(formData.id_evento)
            );
            if(evento){
                const plazasActuales= modo==="editar" ? parseInt(reserva?.plazas_reservadas || 0) : 0;
                setMaxPlazas(evento.plazas_libres + plazasActuales);
            } else{
                setMaxPlazas(null);
            }
        }
    },[formData.id_evento, eventos, modo, reserva]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const validar = () => {
    const nuevosErrores = {};
    const plazas = parseInt(formData.plazas_reservadas);
    if (!formData.id_evento) nuevosErrores.id_evento = "Evento obligatorio";
    if (!plazas || isNaN(plazas) || plazas<1 || (maxPlazas && plazas>maxPlazas)){
        nuevosErrores.plazas_reservadas=`La reserva tiene tiene que ser entre 1 y ${maxPlazas} plazas`
    } 
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  //para deshabilitar el boton guardar cuando el formulario no sea valido
  const esFormularioValido=()=>{
    const plazas = parseInt(formData.plazas_reservadas);
    return(formData.id_evento && !isNaN(plazas) && plazas>0 && (!maxPlazas || plazas<=maxPlazas));
  };
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(!validar()) return;
    onSubmit({
        id_evento: parseInt(formData.id_evento),
        plazas_reservadas: parseInt(formData.plazas_reservadas),
    });
    resetFormulario();
  };
  if(!visible) return null;

  return (
      <div className="modal-backdrop-custom">
      <div className="modal-panel-custom bg--primary-500 clr--neutral-100 p-4 rounded shadow">
        <h3 className="mb-3 fw--semibold">{modo==="crear" ? "Nueva reserva" : modo==="editar" ? "Editar reserva" : "Detalles de la reserva"}</h3>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {modo==="crear" && (
            <div>
                <label className="form-label fw--medium">Evento</label>
                <select
                    name="id_evento"
                    className={`form-control ${errores.id_evento ? "is-invalid" : ""}`}
                    value={formData.id_evento}
                    onChange={handleChange}
                    disabled={modo==="ver"}
                >
                <option value="">-- Selecciona un evento --</option>
                {eventos.map(ev=> (
                    <option key={ev.id} value={ev.id}>
                        {ev.nombre} - {new Date(ev.fecha_inicio).toLocaleDateString()}
                    </option>
                ))}
                </select>
                {errores.id_evento && <div className="invalid-feedback">{errores.id_evento}</div>}
            </div>
            )}
        <div>
            <label className="form-label fw--medium">Plazas Reservadas</label>
                <input
                    type="number"
                    name="plazas_reservadas"
                    min={1}
                    max={maxPlazas || 100}
                    className={`form-control ${errores.plazas_reservadas ? "is-invalid" : ""}`}
                    value={formData.plazas_reservadas}
                    onChange={handleChange}
                />
                {errores.plazas_reservadas && <div className="invalid-feedback">{errores.plazas_reservadas}</div>}
        </div>
        
        <div className="d-flex justify-content-end gap-2 mt-3">
            <button type="submit" className="btn bg--secondary-400 clr--neutral-100 fw--semibold" disabled={!esFormularioValido()}>
                Guardar
            </button>
            <button type="button" className="btn btn-outline-light" onClick={resetFormulario}>
              Cancelar
            </button>
        
        </div>
        </form>
        </div>
        </div>
    );
}
