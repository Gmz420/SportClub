// src/pages/Register.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Container, Form, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { registerUser } from "../services/authService"

function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordsMatch = password === confirmPassword

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity() || !passwordsMatch) {
      event.stopPropagation()
      setValidated(true)
      return
    }
    setValidated(true)
    setLoading(true)

    try {
      await registerUser({ full_name: fullName, email, password })
      await Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: "Ya puedes iniciar sesión con tu correo y contraseña.",
      })
      navigate("/login")
    } catch (error) {
      Swal.fire("Error al registrarse", error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "24rem" }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">Crear cuenta en SportClub</Card.Title>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                required
                minLength={3}
                type="text"
                placeholder="Tu nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Ingresa al menos 3 caracteres.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="ejemplo@correo.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Ingresa un correo válido.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                required
                minLength={8}
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                La contraseña debe tener al menos 8 caracteres.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={validated && !passwordsMatch}
              />
              <Form.Control.Feedback type="invalid">
                Las contraseñas no coinciden.
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Creando cuenta...
                </>
              ) : (
                "Registrarme"
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Register
