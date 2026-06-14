// src/pages/Login.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Container, Form, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { loginUser, saveSession } from "../services/authService"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      event.stopPropagation()
      setValidated(true)
      return
    }
    setValidated(true)
    setLoading(true)

    try {
      const { token, user } = await loginUser({ email, password })
      saveSession(token, user)

      if (user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (user.role === "coach") {
        navigate("/coach/dashboard")
      } else {
        navigate("/user/dashboard")
      }
    } catch (error) {
      Swal.fire("Error al iniciar sesión", error.message, "error")
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
          <Card.Title className="text-center mb-4">Iniciar sesión en SportClub</Card.Title>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                La contraseña es obligatoria.
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login
