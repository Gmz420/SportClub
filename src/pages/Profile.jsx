// src/pages/Profile.jsx
import { Container } from "react-bootstrap"
import { getUser } from "../services/authService"

function Profile() {
  const user = getUser()

  return (
    <Container className="mt-4">
      <h1>Mi Perfil</h1>
      <p>
        {user?.full_name} — {user?.email}
      </p>
      <p>Edición de datos y cambio de contraseña en la Fase 8.</p>
    </Container>
  )
}

export default Profile
