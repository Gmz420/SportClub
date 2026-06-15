// src/pages/Register.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Container, Form, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { registerUser } from "../services/authService"
import logo from "../assets/sportclub-logo.png"

function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Paso 1: datos de cuenta
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validatedStep1, setValidatedStep1] = useState(false)

  // Paso 2: datos personales (opcional)
  const [birthDate, setBirthDate] = useState("")
  const [sportName, setSportName] = useState("")
  const [sportFrequency, setSportFrequency] = useState("")
  const [objective, setObjective] = useState("")
  const [level, setLevel] = useState("principiante")

  const passwordsMatch = password === confirmPassword
  // El backend recorta espacios antes de medir el largo, así que "Jo " (3
  // caracteres) pasaría el minLength del navegador pero fallaría en el backend.
  const fullNameValid = fullName.trim().length >= 3

  const handleContinue = (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity() || !passwordsMatch || !fullNameValid) {
      event.stopPropagation()
      setValidatedStep1(true)
      return
    }
    setValidatedStep1(true)
    setStep(2)
  }

  const handleBack = () => setStep(1)

  // includeExtra=false -> "Omitir y registrarme" (solo Paso 1)
  const buildPayload = (includeExtra) => {
    const payload = { full_name: fullName.trim(), email, password }
    if (!includeExtra) return payload

    if (birthDate) payload.birth_date = birthDate

    const metadata = {}
    if (sportName) {
      metadata.sports = [
        { name: sportName, frequency_per_week: sportFrequency ? Number(sportFrequency) : 0 },
      ]
    }
    if (objective) metadata.objective = objective
    if (level) metadata.level = level
    if (Object.keys(metadata).length > 0) payload.metadata = metadata

    return payload
  }

  const submitRegister = async (payload) => {
    setLoading(true)
    try {
      await registerUser(payload)
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

  const handleRegister = (event) => {
    event.preventDefault()
    submitRegister(buildPayload(true))
  }

  const handleSkip = () => {
    submitRegister(buildPayload(false))
  }

  return (
    <Container
      className="auth-screen d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "26rem" }} className="auth-card shadow">
        <Card.Body>
          <img src={logo} alt="Logo SportClub" className="auth-logo" />

          <div className="auth-step-indicator">
            <div className={`dot ${step === 1 ? "dot--active" : ""}`}>1</div>
            <div className="line" />
            <div className={`dot ${step === 2 ? "dot--active" : ""}`}>2</div>
          </div>

          <div className="auth-steps">
            <Form
              noValidate
              validated={validatedStep1}
              onSubmit={handleContinue}
              aria-hidden={step !== 1}
              className={`auth-step ${step === 1 ? "auth-step--visible" : "auth-step--hidden-up"}`}
            >
              <Card.Title className="text-center text-admin mb-1">Crear cuenta</Card.Title>
              <p className="text-center text-muted small mb-4">Datos de acceso a SportClub</p>

              <Form.Group className="mb-3">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  required
                  minLength={3}
                  type="text"
                  placeholder="Tu nombre completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  isInvalid={validatedStep1 && !fullNameValid}
                />
                <Form.Control.Feedback type="invalid">
                  Ingresa al menos 3 caracteres (sin contar espacios).
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  required
                  type="email"
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  placeholder="ejemplo@correo.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Ingresa un correo válido con dominio (ej: nombre@correo.cl).
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
                  isInvalid={validatedStep1 && !passwordsMatch}
                />
                <Form.Control.Feedback type="invalid">
                  Las contraseñas no coinciden.
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="gold" className="w-100">
                Continuar
              </Button>

              <div className="text-center mt-3">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </div>
            </Form>

            <Form
              onSubmit={handleRegister}
              aria-hidden={step !== 2}
              className={`auth-step ${step === 2 ? "auth-step--visible" : "auth-step--hidden-down"}`}
            >
              <Card.Title className="text-center text-admin mb-1">Datos personales</Card.Title>
              <p className="text-center text-muted small mb-4">
                Opcional, puedes completarlo después desde &quot;Mi Perfil&quot;
              </p>

              <Form.Group className="mb-3">
                <Form.Label>Fecha de nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Form.Group className="mb-3 flex-grow-1">
                  <Form.Label>Deporte que practicas</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Fútbol"
                    value={sportName}
                    onChange={(e) => setSportName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" style={{ width: "8rem" }}>
                  <Form.Label>Días/semana</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    max={7}
                    placeholder="3"
                    value={sportFrequency}
                    onChange={(e) => setSportFrequency(e.target.value)}
                  />
                </Form.Group>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Objetivo personal</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Bajar de peso, mejorar resistencia..."
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nivel</Form.Label>
                <Form.Select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="gold" className="w-100" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Creando cuenta...
                  </>
                ) : (
                  "Registrarme"
                )}
              </Button>

              <Button
                type="button"
                variant="outline-admin"
                className="w-100 mt-2"
                onClick={handleSkip}
                disabled={loading}
              >
                Omitir y registrarme
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-100 mt-1 text-admin"
                onClick={handleBack}
                disabled={loading}
              >
                Volver
              </Button>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Register
