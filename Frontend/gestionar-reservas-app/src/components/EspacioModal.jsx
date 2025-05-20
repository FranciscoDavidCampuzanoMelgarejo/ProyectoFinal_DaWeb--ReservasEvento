import { useEffect, useState } from "react";

export function EspacioModal({ visible, modo, espacio, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    propietario: "",
    capacidad: "",
    direccion: "",
    descripcion: "",
    estado: "ACTIVO",
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (modo === "editar" && espacio) {
      setFormData({
        nombre: espacio.nombre,
        propietario: espacio.propietario,
        capacidad: espacio.capacidad,
        direccion: espacio.direccion,
        descripcion: espacio.descripcion,
        estado: espacio.estado === 1 ? "ACTIVO" : "CERRADO",
      });
    } else {
      setFormData({
        nombre: "",
        propietario: "",
        capacidad: "",
        direccion: "",
        descripcion: "",
        estado: "ACTIVO",
      });
    }
    setErrores({});
  }, [modo, espacio, visible]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.nombre) nuevosErrores.nombre = "Nombre obligatorio";
    if (!formData.propietario) nuevosErrores.propietario = "Propietario obligatorio";
    if (!formData.capacidad || isNaN(formData.capacidad)) nuevosErrores.capacidad = "Capacidad inválida";
    if (!formData.direccion) nuevosErrores.direccion = "Dirección obligatoria";
    if (!formData.descripcion) nuevosErrores.descripcion = "Descripción obligatoria";
    if (!formData.estado) nuevosErrores.estado = "Estado obligatorio";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const datos = {
      ...formData,
      capacidad: Number(formData.capacidad),
      estado: formData.estado === "ACTIVO" ? 1 : 0,
    };

    onSubmit(datos);
    if(modo === "crear"){
      setFormData({
          nombre: "",
          propietario: "",
          capacidad: "",
          direccion: "",
          descripcion: "",
          estado: "ACTIVO",
      });
    }
    setErrores({});
    onClose();
  };

  if (!visible) return null;
  if (modo === "ver"){
    return (
      <div className="modal-backdrop-custom">
      <div className="modal-panel-custom bg--primary-500 clr--neutral-100 p-4 rounded shadow">
        <h3 className="mb-3 fw--semibold">Detalles del espacio</h3>
        <div className="d-flex flex-column gap-2">
          <p><strong>Nombre:</strong> {espacio?.nombre}</p>
          <p><strong>Propietario:</strong> {espacio?.propietario}</p>
          <p><strong>Capacidad:</strong> {espacio?.capacidad}</p>
          <p><strong>Dirección:</strong> {espacio?.direccion}</p>
          <p><strong>Descripción:</strong> {espacio?.descripcion}</p>
          <p><strong>Estado:</strong> {espacio?.estado === 1 ? 'ACTIVO' : 'CERRADO'}</p>
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-outline-light" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
    );
  }
  return (
    <div className="modal-backdrop-custom">
      <div className="modal-panel-custom bg--primary-500 clr--neutral-100 p-4 rounded shadow">
        <h3 className="mb-3 fw--semibold">
          {modo === "crear" ? "Crear nuevo espacio" : "Editar espacio"}
        </h3>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* La descripcion la pongo aparte para que se vea como un text area en vez de un input y así visualizarlo mejor */}
          {["nombre", "propietario", "capacidad", "direccion"].map((campo) => (
            <div key={campo}>
              <label className="form-label fw--medium">
                {campo.charAt(0).toUpperCase() + campo.slice(1)}
              </label>
              <input
                type={campo === "capacidad" ? "number" : "text"}
                name={campo}
                className={`form-control ${errores[campo] ? "is-invalid" : ""}`}
                value={formData[campo]}
                onChange={handleChange}
              />
              {errores[campo] && <div className="invalid-feedback">{errores[campo]}</div>}
            </div>
          ))}
          <div>
            <label className="form-label fw--medium">Descripción</label>
            <textarea 
            name="descripcion" 
            rows={5}
            //aplico directamente aqui que no se pueda modificar el tamaño del textfield desde la ventana
            style={{resize: 'none'}}
            className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
            value={formData.descripcion}
            onChange={handleChange}
            />
            {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
          </div>

          {modo === "editar" &&(
            <div>
              <label className="form-label fw--medium">Estado</label>
              <select
                name="estado"
                className={`form-select ${errores.estado ? "is-invalid" : ""}`}
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="CERRADO">CERRADO</option>
              </select>
              {errores.estado && <div className="invalid-feedback">{errores.estado}</div>}
            </div>
          )}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button type="submit" className="btn bg--secondary-400 clr--neutral-100 fw--semibold">
              Guardar
            </button>
            <button type="button" className="btn btn-outline-light" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
