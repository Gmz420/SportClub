// src/components/ui/RoleNavbar.jsx
import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import logo from "../../assets/sportclub-logo.png"
import { getRoleColors } from "../../constants/roleColors"
import { getUser, logout } from "../../services/authService"
import { scrollToSection } from "../../utils/scrollToSection"
import RoleBadge from "./RoleBadge"

// Extrae el id de sección de un destino con ancla (".../dashboard#clases" -> "clases").
function sectionIdFrom(to) {
  const i = to.indexOf("#")
  return i >= 0 ? to.slice(i + 1) : null
}

// Ítems de navegación por rol, definidos en Diseno_Visual_SportClub.md.
// Los anchors (#clases, #estadisticas, etc.) apuntan a secciones del propio
// dashboard que se agregan en la Fase 7.
const NAV_ITEMS = {
  user: [
    { label: "Inicio", to: "/user/dashboard" },
    { label: "Clases", to: "/user/dashboard#clases" },
    { label: "Reservas", to: "/user/dashboard#reservas" },
    { label: "Mi Progreso", to: "/user/dashboard#progreso" },
  ],
  coach: [
    { label: "Inicio", to: "/coach/dashboard" },
    { label: "Mis Alumnos", to: "/coach/dashboard#alumnos" },
    { label: "Mi Horario", to: "/coach/dashboard#horario" },
    { label: "Reportes", to: "/coach/dashboard#reportes" },
  ],
  admin: [
    { label: "Inicio", to: "/admin/dashboard" },
    { label: "Usuarios", to: "/admin/users" },
    { label: "Estadísticas", to: "/admin/dashboard#estadisticas" },
    { label: "Configuración", to: "/admin/dashboard#configuracion" },
  ],
}

function RoleNavbar({ role }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()
  const { bg } = getRoleColors(role)
  const items = NAV_ITEMS[role] ?? []

  // La sección activa = ruta + hash actuales (ej. "/user/dashboard#clases").
  const currentPath = location.pathname + location.hash

  // Carga directa o recarga con un hash en la URL: resaltar esa sección al montar.
  useEffect(() => {
    if (location.hash) scrollToSection(location.hash.slice(1))
    // solo al montar: los clics posteriores los maneja handleNavClick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // En cada clic de un ítem con ancla, resalta su sección — funciona también al
  // clicar el mismo enlace dos veces (el hash no cambia, pero el resalte se repite).
  const handleNavClick = (to) => {
    const id = sectionIdFrom(to)
    if (id) scrollToSection(id)
  }

  return (
    <Navbar bg={bg} variant="dark" expand="lg" sticky="top" className="px-3">
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to={`/${role}/dashboard`}
          className="d-flex align-items-center gap-2"
        >
          <img src={logo} alt="SportClub" height={36} />
          SportClub
        </Navbar.Brand>

        <Navbar.Toggle aria-controls={`navbar-${role}`} />
        <Navbar.Collapse id={`navbar-${role}`}>
          <Nav className="me-auto">
            {items.map((item) => (
              <Nav.Link
                key={item.label}
                as={Link}
                to={item.to}
                active={currentPath === item.to}
                onClick={() => handleNavClick(item.to)}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            <span className="text-white d-flex align-items-center gap-2">
              {user?.full_name} <RoleBadge role={role} />
            </span>
            <Nav.Link as={Link} to="/profile">
              Mi Perfil
            </Nav.Link>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default RoleNavbar
