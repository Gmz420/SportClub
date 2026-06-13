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
