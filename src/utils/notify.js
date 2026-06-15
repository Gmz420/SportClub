// src/utils/notify.js
// Muestra los errores de forma consistente y amable para el usuario final.
// `title` da el contexto (qué acción falló, en lenguaje simple) y el texto usa
// error.message, que ya llega traducido desde handleApiResponse/apiFetch (config/api.js).
import Swal from "sweetalert2"

export function notifyError(error, title = "Ups, algo salió mal") {
  Swal.fire({
    icon: "error",
    title,
    text: error?.message || "Ocurrió un error inesperado. Por favor, inténtalo nuevamente.",
    confirmButtonText: "Entendido",
  })
}
