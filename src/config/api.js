// src/config/api.js
// BASE_URL configurable por entorno. Cambiar el backend = editar .env, no el código.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export function apiUrl(path) {
  return `${BASE_URL}${path}`
}

// Headers para endpoints públicos (login, register).
export function jsonHeaders() {
  return { "Content-Type": "application/json" }
}

// Traduce mensajes técnicos del backend a lenguaje claro para el usuario final
// (sin jerga como "token Bearer"). Si el mensaje no está mapeado, se usa tal cual.
const FRIENDLY_MESSAGES = {
  "Credenciales inválidas.": "El correo o la contraseña son incorrectos. Revisa tus datos e inténtalo de nuevo.",
  "Token inválido o expirado.": "Tu sesión expiró. Por favor, inicia sesión nuevamente.",
  "No autorizado. Debe enviar un token Bearer.": "Tu sesión no es válida. Por favor, inicia sesión nuevamente.",
  "Payload inválido.": "Revisa los datos del formulario: hay algún campo incompleto o incorrecto.",
}

function friendlyMessage(message) {
  return FRIENDLY_MESSAGES[message] || message
}

// Envuelve fetch para traducir errores de red (servidor caído, sin conexión) en un
// mensaje claro. fetch() solo rechaza por problemas de red, no por códigos HTTP.
export async function apiFetch(url, options) {
  try {
    return await fetch(url, options)
  } catch {
    throw new Error(
      "No pudimos conectar con el servidor. Revisa tu conexión a internet e inténtalo nuevamente."
    )
  }
}

// Manejo central de respuestas del backend. El contrato es { ok, message, data }
// en éxito y { ok:false, message, errors } en error (errors = detalle por campo,
// ej. { email: "El correo no tiene un formato válido." }). Este helper desempaqueta
// body.data en éxito y, en error, arma el mensaje a partir de body.errors (más útil
// que el genérico "Payload inválido."), traduciendo body.message a lenguaje claro.
export async function handleApiResponse(res, fallbackMessage = "Ocurrió un error") {
  const body = await res.json().catch(() => ({}))

  if (!res.ok || body.ok === false) {
    const detail = body.errors ? Object.values(body.errors).flat().join(" ") : ""
    throw new Error(detail || friendlyMessage(body.message) || fallbackMessage)
  }

  return body.data
}
