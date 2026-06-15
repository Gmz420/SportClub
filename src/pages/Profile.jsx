// src/pages/Profile.jsx
import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import RoleBadge from "../components/ui/RoleBadge"
import Avatar from "../components/ui/Avatar"
import { getRoleColors } from "../constants/roleColors"
import { changePassword, getProfile, getToken, getUser, saveSession, updateProfile } from "../services/authService"

function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(getUser())
  const [loading, setLoading] = useState(true)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [profileValidated, setProfileValidated] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordValidated, setPasswordValidated] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data)
        setFullName(data.full_name ?? "")
        setEmail(data.email ?? "")
        setBirthDate(data.birth_date ?? "")
      })
      .catch((error) => Swal.fire("Error", error.message, "error"))
      .finally(() => setLoading(false))
  }, [])

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      event.stopPropagation()
      setProfileValidated(true)
      return
    }
    setProfileValidated(true)
    setSavingProfile(true)
    try {
      const updated = await updateProfile({ full_name: fullName, email, birth_date: birthDate || null })
      setProfile(updated)
      saveSession(getToken(), updated)
      Swal.fire("Perfil actualizado", "Tus datos se guardaron correctamente.", "success")
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const passwordsMatch = newPassword === confirmPassword
    if (!form.checkValidity() || !passwordsMatch) {
      event.stopPropagation()
      setPasswordValidated(true)
      return
    }
    setPasswordValidated(true)
    setSavingPassword(true)
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
      Swal.fire("Contraseña actualizada", "Tu contraseña se cambió correctamente.", "success")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordValidated(false)
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" size="sm" className="mb-3" onClick={() => navigate(`/${profile?.role}/dashboard`)}>
        Volver al Dashboard
      </Button>

      <div className="d-flex align-items-center gap-3 mb-2">
        <Avatar name={profile?.full_name} variant={getRoleColors(profile?.role).variant} size={56} />
        <h1 className="app-page-title d-flex align-items-center gap-2 mb-0">
          Mi Perfil <RoleBadge role={profile?.role} />
        </h1>
      </div>

      <Row className="mt-3 g-3">
        <Col md={6}>
          <Card className="app-card h-100">
            <Card.Body>
              <Card.Title>Datos Personales</Card.Title>
              <Form noValidate validated={profileValidated} onSubmit={handleProfileSubmit}>
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    minLength={3}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingresa un nombre válido (mínimo 3 caracteres).
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Form.Control.Feedback type="invalid">Ingresa un correo válido.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="birthDate">
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control type="date" value={birthDate ?? ""} onChange={(e) => setBirthDate(e.target.value)} />
                </Form.Group>

                <Button type="submit" variant="primary" disabled={savingProfile}>
                  {savingProfile ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="app-card h-100">
            <Card.Body>
              <Card.Title>Cambiar Contraseña</Card.Title>
              <Form noValidate validated={passwordValidated} onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3" controlId="currentPassword">
                  <Form.Label>Contraseña actual</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Ingresa tu contraseña actual.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <Form.Control.Feedback type="invalid">Debe tener al menos 8 caracteres.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirmar nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    isInvalid={passwordValidated && newPassword !== confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">Las contraseñas no coinciden.</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary" disabled={savingPassword}>
                  {savingPassword ? "Guardando..." : "Cambiar Contraseña"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile
