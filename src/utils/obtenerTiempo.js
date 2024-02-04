export function obtenerTiempoDistancia(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);

  return { horas, minutos }
};