// src/pages/user/UserDashboard.jsx
import { useEffect, useState } from "react"
import { Button, Card, Col, Container, ProgressBar, Row, Table } from "react-bootstrap"
import { getProfile, getUser } from "../../services/authService"
import { AVAILABLE_CLASSES, PERSONAL_GOALS } from "../../constants/mockData"

const PROGRESS_PERCENT = 65

function UserDashboard() {
  const [profile, setProfile] = useState(getUser())
  const [reservedClasses, setReservedClasses] = useState([])

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => {
        // si falla, se mantienen los datos guardados en la sesión
      })
  }, [])

  const handleReserve = (className) => {
    setReservedClasses((prev) => [...prev, className])
  }

  return (
    <Container className="mt-4">
      <h1>Bienvenido a SportClub</h1>
      <p className="text-muted">Hola, {profile?.full_name}</p>

      <Row className="mt-3 g-3">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Mi Perfil</Card.Title>
              <p className="mb-1">
                <strong>Nombre:</strong> {profile?.full_name}
              </p>
              <p className="mb-0">
                <strong>Correo:</strong> {profile?.email}
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} id="progreso">
          <Card>
            <Card.Body>
              <Card.Title>Progreso</Card.Title>
              <ProgressBar now={PROGRESS_PERCENT} label={`${PROGRESS_PERCENT}%`} className="mb-3" />
              <ul className="mb-0">
                {PERSONAL_GOALS.map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3 g-3">
        <Col md={4} id="clases">
          <Card>
            <Card.Body>
              <Card.Title>Clases Disponibles</Card.Title>
              <ul className="mb-0">
                {AVAILABLE_CLASSES.slice(0, 3).map((item) => (
                  <li key={item.name}>
                    {item.name} — {item.schedule}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8} id="reservas">
          <Card>
            <Card.Body>
              <Card.Title>Reservas</Card.Title>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Clase</th>
                    <th>Día / Hora</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {AVAILABLE_CLASSES.map((item) => {
                    const reserved = reservedClasses.includes(item.name)
                    return (
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.schedule}</td>
                        <td>
                          <Button
                            size="sm"
                            variant={reserved ? "secondary" : "primary"}
                            disabled={reserved}
                            onClick={() => handleReserve(item.name)}
                          >
                            {reserved ? "Reservado" : "Reservar"}
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default UserDashboard
