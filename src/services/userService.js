// src/services/userService.js
import { apiUrl } from "../config/api"
import { authHeaders } from "./authService" // ← misma clave de token que la sesión (D1)

const USERS_PATH = "/api/users"

// role opcional: filtra por rol (ej. "user" para que un coach vea solo alumnos).
export async function getUsers(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : ""
  const res = await fetch(apiUrl(`${USERS_PATH}${query}`), { headers: authHeaders() })
  const body = await res.json()
  if (!res.ok || !body.ok) {
    throw new Error(body.message || "Error al obtener usuarios")
  }
  return body.data // arreglo de usuarios
}

export async function createUser(userData) {
  const res = await fetch(apiUrl(USERS_PATH), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  })
  const body = await res.json()
  if (!res.ok || !body.ok) {
    throw new Error(body.message || "Error al crear usuario")
  }
  return body.data
}

export async function updateUser(id, userData) {
  const res = await fetch(apiUrl(`${USERS_PATH}/${id}`), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  })
  const body = await res.json()
  if (!res.ok || !body.ok) {
    throw new Error(body.message || "Error al actualizar usuario")
  }
  return body.data
}

export async function deleteUser(id) {
  const res = await fetch(apiUrl(`${USERS_PATH}/${id}`), {
    method: "DELETE",
    headers: authHeaders(),
  })
  const body = await res.json().catch(() => ({ ok: res.ok }))
  if (!res.ok || body.ok === false) {
    throw new Error(body.message || "Error al eliminar usuario")
  }
  return true
}
