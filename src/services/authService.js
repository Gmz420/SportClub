// src/services/authService.js
import { apiUrl, jsonHeaders } from "../config/api"

const TOKEN_KEY = "sportclub_token"
const USER_KEY = "sportclub_user"

/* ---------- Sesión (localStorage) ---------- */

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function isAuthenticated() {
  return !!getToken()
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// Headers con token: ÚNICA fuente para endpoints protegidos. userService los reutiliza (D1).
export function authHeaders() {
  return { ...jsonHeaders(), Authorization: `Bearer ${getToken()}` }
}

/* ---------- Auth API ---------- */

// Devuelve { token, user } (ya desempaquetado de body.data).
export async function loginUser({ email, password }) {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  })
  const body = await res.json()
  if (!res.ok || !body.ok) {
    throw new Error(body.message || "Credenciales inválidas")
  }
  return body.data // { token, user }
}

// Registro público (el backend asigna rol "user").
// birth_date y metadata son opcionales (Paso 2 del registro).
export async function registerUser({ full_name, email, password, birth_date, metadata }) {
  const res = await fetch(apiUrl("/api/auth/register"), {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ full_name, email, password, birth_date, metadata }),
  })
  const body = await res.json()
  if (!res.ok || !body.ok) {
    // El backend responde "Payload inválido." junto con un detalle por campo
    // en body.errors (ej: { email: "El correo no tiene un formato válido." }).
    // Mostramos ese detalle para que el usuario sepa qué corregir.
    const detail = body.errors ? Object.values(body.errors).flat().join(" ") : ""
    throw new Error(detail || body.message || "No se pudo registrar")
  }
  return body.data
}

// Perfil del usuario autenticado (Mi Perfil -> datos frescos del backend).
export async function getProfile() {
  const res = await fetch(apiUrl("/api/auth/me"), { headers: authHeaders() })
  const body = await res.json()
  if (!res.ok || !body.ok) {
    throw new Error(body.message || "No se pudo obtener el perfil")
  }
  return body.data
}

export async function updateProfile(payload) {
  const res = await fetch(apiUrl("/api/auth/me"), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const body = await res.json()
  if (!res.ok || !body.ok) {
    throw new Error(body.message || "No se pudo actualizar el perfil")
  }
  return body.data
}

export async function changePassword(payload) {
  const res = await fetch(apiUrl("/api/auth/me/password"), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const body = await res.json()
  if (!res.ok || !body.ok) {
    throw new Error(body.message || "No se pudo cambiar la contraseña")
  }
  return body.data
}
