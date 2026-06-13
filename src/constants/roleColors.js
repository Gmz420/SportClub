// src/constants/roleColors.js
// Decisión D2: Usuario=Azul, Coach=Verde, Admin=Morado (#2E1A47, identidad corporativa N°1).
// Decisión D3: un único mapa central consumido por Navbar, badges, botones y dashboards.
// "admin" usa una variante custom -> definida en styles/roles.css (.bg-admin/.btn-admin/...).
export const ROLE_COLORS = {
  user: { variant: "primary", bg: "primary", hex: "#0d6efd", label: "Usuario" },
  coach: { variant: "success", bg: "success", hex: "#198754", label: "Coach" },
  admin: { variant: "admin", bg: "admin", hex: "#2E1A47", label: "Administrador" },
}

// Acceso seguro: si llega un rol desconocido, cae a "user" en vez de romper la UI.
export function getRoleColors(role) {
  return ROLE_COLORS[role] ?? ROLE_COLORS.user
}
