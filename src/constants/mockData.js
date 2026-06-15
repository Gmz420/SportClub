// src/constants/mockData.js
// Datos de ejemplo (mock) para los dashboards — no provienen del backend (Fase 7).

export const AVAILABLE_CLASSES = [
  { name: "Spinning", schedule: "Lunes 18:00" },
  { name: "CrossFit", schedule: "Miércoles 10:00" },
  { name: "Boxeo", schedule: "Sábado 11:00" },
  { name: "HIIT", schedule: "Viernes 10:00" },
]

export const PERSONAL_GOALS = [
  "Bajar de peso",
  "Mejorar resistencia",
  "Asistir 3 veces por semana",
]

// Detalle del avance mostrado junto a la barra de progreso (card "Progreso").
export const PROGRESS_DETAILS = [
  { label: "Asistencias este mes", value: "12" },
  { label: "Racha actual", value: "5 días" },
  { label: "Meta semanal", value: "3 de 4" },
]

export const COACH_SCHEDULE = [
  { day: "Lunes", className: "Spinning 18:00" },
  { day: "Miércoles", className: "CrossFit 10:00" },
  { day: "Viernes", className: "Boxeo 19:00" },
]
