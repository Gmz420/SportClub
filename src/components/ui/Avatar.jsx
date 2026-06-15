// src/components/ui/Avatar.jsx
// Avatar circular con las iniciales del nombre. El color de fondo usa la
// variante del rol (.bg-primary/.bg-success/.bg-admin) para reforzar la
// diferenciación visual por rol del wireframe.

function getInitials(name) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0].toUpperCase()).join("")
}

function Avatar({ name, variant = "primary", size = 48 }) {
  return (
    <span
      className={`app-avatar bg-${variant}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials(name)}
    </span>
  )
}

export default Avatar
