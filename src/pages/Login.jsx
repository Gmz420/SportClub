// src/pages/Login.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Form, Spinner } from "react-bootstrap"
import { loginUser, saveSession } from "../services/authService"
import { notifyError } from "../utils/notify"
import logo from "../assets/sportclub-logo.png"

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
      notifyError(error, "No se pudo iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split">
      <div className="auth-brand">
        <img src={logo} alt="Logo SportClub" className="auth-brand-logo" />
        <h2>Tu club, tu progreso</h2>
        <p>Entrena, reserva tus clases y sigue tu avance en un solo lugar.</p>
      </div>

      <div className="auth-form-side">
        <Card className="auth-card shadow-sm">
          <Card.Body>
            <Card.Title className="text-center text-admin mb-1">Iniciar sesión</Card.Title>
            <p className="text-center text-muted small mb-4">
              Bienvenido de vuelta a tu entrenamiento
            </p>

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

            <Button type="submit" variant="gold" className="w-100" disabled={loading}>
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
      </div>
    </div>
  )
}

export default Login
