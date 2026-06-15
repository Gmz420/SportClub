// src/pages/user/UserDashboard.jsx
import { useEffect, useState } from "react"
import { Button, Card, Col, Container, ProgressBar, Row, Table } from "react-bootstrap"
import Avatar from "../../components/ui/Avatar"
import { getProfile, getUser } from "../../services/authService"
import { AVAILABLE_CLASSES, PERSONAL_GOALS, PROGRESS_DETAILS } from "../../constants/mockData"

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
      <h1 className="app-page-title text-primary">Bienvenido a SportClub</h1>
      <p className="text-muted">Hola, {profile?.full_name}</p>

      <Row className="mt-3 g-3">
        <Col md={6}>
          <Card className="app-card h-100">
            <Card.Body>
              <Card.Title>Mi Perfil</Card.Title>
              <div className="d-flex align-items-center gap-3 mb-3">
                <Avatar name={profile?.full_name} variant="primary" size={56} />
                <div>
                  <p className="mb-1">
                    <strong>{profile?.full_name}</strong>
                  </p>
                  <p className="mb-0 text-muted small">{profile?.email}</p>
                </div>
              </div>
              <h6 className="text-primary">Objetivos Personales</h6>
              <ul className="mb-0">
                {PERSONAL_GOALS.map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} id="progreso">
          <Card className="app-card h-100">
            <Card.Body>
              <Card.Title>Progreso</Card.Title>
              <ProgressBar
                now={PROGRESS_PERCENT}
                label={`${PROGRESS_PERCENT}%`}
                variant="primary"
                className="mb-3"
              />
              <Table size="sm" borderless className="mb-0">
                <tbody>
                  {PROGRESS_DETAILS.map((item) => (
                    <tr key={item.label}>
                      <td className="text-muted">{item.label}</td>
                      <td className="text-end fw-semibold">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3 g-3">
        <Col md={4} id="clases">
          <Card className="app-card h-100">
            <Card.Body>
              <Card.Title>Clases Disponibles</Card.Title>
              <ul className="list-unstyled mb-0">
                {AVAILABLE_CLASSES.slice(0, 3).map((item) => {
                  const reserved = reservedClasses.includes(item.name)
                  return (
                    <li
                      key={item.name}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <span>{item.name}</span>
                      <Button
                        size="sm"
                        variant={reserved ? "secondary" : "primary"}
                        disabled={reserved}
                        onClick={() => handleReserve(item.name)}
                      >
                        {reserved ? "Reservado" : "Reservar"}
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8} id="reservas">
          <Card className="app-card h-100">
            <Card.Body>
              <Card.Title>Reservas</Card.Title>
              <Table responsive className="mb-0">
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
