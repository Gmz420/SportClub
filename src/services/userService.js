// src/services/userService.js
import { apiFetch, apiUrl, handleApiResponse } from "../config/api"
import { authHeaders } from "./authService" // ← misma clave de token que la sesión (D1)

const USERS_PATH = "/api/users"

// role opcional: filtra por rol (ej. "user" para que un coach vea solo alumnos).
export async function getUsers(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : ""
  const res = await apiFetch(apiUrl(`${USERS_PATH}${query}`), { headers: authHeaders() })
  return handleApiResponse(res, "Error al obtener usuarios") // arreglo de usuarios
}

export async function createUser(userData) {
  const res = await apiFetch(apiUrl(USERS_PATH), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  })
  return handleApiResponse(res, "Error al crear usuario")
}

export async function updateUser(id, userData) {
  const res = await apiFetch(apiUrl(`${USERS_PATH}/${id}`), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  })
  return handleApiResponse(res, "Error al actualizar usuario")
}

export async function deleteUser(id) {
  const res = await apiFetch(apiUrl(`${USERS_PATH}/${id}`), {
    method: "DELETE",
    headers: authHeaders(),
  })
  await handleApiResponse(res, "Error al eliminar usuario")
  return true
}
