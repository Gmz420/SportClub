// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import { getUsers } from "../../services/userService"

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((error) => Swal.fire("Error", error.message, "error"))
      .finally(() => setLoading(false))
  }, [])

  const countByRole = (role) => users.filter((u) => u.role === role).length

  const handleDownloadReport = () => {
    const header = "Nombre,Correo,Rol\n"
    const rows = users.map((u) => `${u.full_name},${u.email},${u.role}`).join("\n")
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "usuarios_sportclub.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleConfigure = () => {
    Swal.fire("Próximamente", "Las opciones de configuración estarán disponibles pronto.", "info")
  }

  return (
    <Container className="mt-4">
      <h1>Panel de Administración</h1>

      <Row className="mt-3 g-3">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Gestión de Usuarios</Card.Title>
              <p>Crea, edita y elimina usuarios del sistema.</p>
              <Button as={Link} to="/admin/users" variant="admin">
                Ir a gestión
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} id="estadisticas">
          <Card>
            <Card.Body>
              <Card.Title>Estadísticas del Sistema</Card.Title>
              {loading ? (
                <p className="mb-0">Cargando...</p>
              ) : (
                <Table size="sm" responsive>
                  <tbody>
                    <tr>
                      <td>Total de usuarios</td>
                      <td>{users.length}</td>
                    </tr>
                    <tr>
                      <td>Usuarios</td>
                      <td>{countByRole("user")}</td>
                    </tr>
                    <tr>
                      <td>Coaches</td>
                      <td>{countByRole("coach")}</td>
                    </tr>
                    <tr>
                      <td>Administradores</td>
                      <td>{countByRole("admin")}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} id="configuracion">
          <Card>
            <Card.Body>
              <Card.Title>Reportes Generales</Card.Title>
              <p>Exporta el listado completo de usuarios.</p>
              <Button variant="admin" className="me-2" onClick={handleDownloadReport} disabled={loading}>
                Descargar Informe
              </Button>
              <Button variant="outline-secondary" onClick={handleConfigure}>
                Configurar...
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard
