// src/pages/coach/CoachDashboard.jsx
import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import Avatar from "../../components/ui/Avatar"
import { getUser } from "../../services/authService"
import { getUsers } from "../../services/userService"
import { COACH_SCHEDULE } from "../../constants/mockData"

function CoachDashboard() {
  const coach = getUser()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers("user")
      .then(setStudents)
      .catch((error) => Swal.fire("Error", error.message, "error"))
      .finally(() => setLoading(false))
  }, [])

  const handleViewProgress = () => {
    Swal.fire("Próximamente", "El seguimiento de progreso estará disponible pronto.", "info")
  }

  const handleGenerateReport = () => {
    Swal.fire("Próximamente", "Los reportes detallados estarán disponibles pronto.", "info")
  }

  return (
    <Container className="mt-4">
      <h1 className="app-page-title text-success">Panel de Entrenador</h1>
      <p className="text-muted">Bienvenido, Coach {coach?.full_name}</p>

      <Row className="mt-3 g-3">
        <Col md={6} id="alumnos">
          <Card className="app-card h-100">
            <Card.Body>
              <Card.Title>Mis Alumnos</Card.Title>
              {loading ? (
                <p className="mb-0">Cargando...</p>
              ) : students.length === 0 ? (
                <p className="mb-0">No hay alumnos registrados.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {students.map((student) => (
                    <li key={student.id} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="d-flex align-items-center gap-2">
                        <Avatar name={student.full_name} variant="success" size={36} />
                        <span>
                          {student.full_name}
                          <br />
                          <span className="text-muted small">{student.email}</span>
                        </span>
                      </span>
                      <Button size="sm" variant="success" onClick={handleViewProgress}>
                        Ver Progreso
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} id="horario">
          <Card className="app-card h-100">
            <Card.Body>
              <Card.Title>Mi Horario</Card.Title>
              <Table responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Clase</th>
                  </tr>
                </thead>
                <tbody>
                  {COACH_SCHEDULE.map((item) => (
                    <tr key={item.day}>
                      <td>{item.day}</td>
                      <td>{item.className}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3 g-3">
        <Col md={6} id="reportes">
          <Card className="app-card h-100">
            <Card.Body>
              <Card.Title>Reportes</Card.Title>
              <p>Genera un resumen del desempeño de tus alumnos.</p>
              <Button variant="success" onClick={handleGenerateReport}>
                Generar Reporte
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CoachDashboard
