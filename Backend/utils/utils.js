// Esta funcion recibe un objeto con los campos que se quieren
// insertar en una tabla de bbdd, y devuelve la sentencia SQL
// y el valor de los campos [sentencia, valores]
export function sentenciaInsercionSQL(tabla, campos) {
  // 1. Quitar compos con valores nulos
  const camposNoNulos = quitarCamposVacios(campos);

  // 2. Crear sentencia INSERT
  // INSERT INTO TABLA (campo1, campo2, ...) VALUES (?, ?, ...)
  const interrogaciones = Array.from(
    { length: Object.keys(camposNoNulos).length },
    () => "?"
  );
  const sentenciaSQL = `INSERT INTO ${tabla} (${Object.keys(camposNoNulos).join(
    ", "
  )}) VALUES (${interrogaciones.join(", ")})`;

  return [sentenciaSQL, Object.values(camposNoNulos)];
}

export function sentenciaActualizacionSQL(tabla, campos, condicion, id) {
  const camposNoNulos = quitarCamposVacios(campos);

  //UPDATE tabla SET campo1 = ?, campo2 = ?, ...
  let sentenciaSQL = `UPDATE ${tabla} SET ${Object.keys(camposNoNulos)
    .map((campo) => `${campo} = ?`)
    .join(", ")}`;
  sentenciaSQL = sentenciaSQL + " " + condicion;

  return [sentenciaSQL, Object.values(camposNoNulos).concat(id)];
}

/* FUNCIONES AUXILIARES */
function quitarCamposVacios(campos) {
  const camposNoNulos = {};
  for (const campo in campos) {
    if (campos[campo] != null) camposNoNulos[campo] = campos[campo];
  }
  return camposNoNulos;
}
