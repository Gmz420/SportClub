// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom"
import { Button, Container } from "react-bootstrap"

function Unauthorized() {
  return (
    <Container className="text-center mt-5">
      <h1>Acceso no autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <Button as={Link} to="/login" variant="primary">
        Volver al login
      </Button>
    </Container>
  )
}

export default Unauthorized
