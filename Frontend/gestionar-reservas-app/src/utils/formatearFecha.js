export function formatearFecha(fechaISO) {

  // Opciones de formato
  const opciones = {
    weekday: "short", // sab
    year: "numeric", // 2025
    month: "long", // mayo
    day: "2-digit", // 16
    hour: "2-digit", // 10
    minute: "2-digit", // 00
    hour12: false, // Formato 24h
  };

  // Convertir y formatear en español
  const fechaFormateada = new Date(fechaISO).toLocaleString("es-ES", opciones);
  return fechaFormateada;
}
