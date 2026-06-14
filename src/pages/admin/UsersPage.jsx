// src/pages/admin/UsersPage.jsx
import { useEffect, useState } from "react"
import { Button, Card, Container, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import RoleBadge from "../../components/ui/RoleBadge"
import UserFormModal from "../../components/users/UserFormModal"
import { getUser } from "../../services/authService"
import { createUser, deleteUser, getUsers, updateUser } from "../../services/userService"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const currentUser = getUser()

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const openCreateModal = () => {
    setSelectedUser(null)
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData)
        Swal.fire("Actualizado", "Usuario actualizado correctamente.", "success")
      } else {
        await createUser(formData)
        Swal.fire("Creado", "Usuario creado correctamente.", "success")
      }
      closeModal()
      loadUsers()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${user.full_name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    })

    if (!result.isConfirmed) return

    try {
      await deleteUser(user.id)
      Swal.fire("Eliminado", "Usuario eliminado correctamente.", "success")
      loadUsers()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  return (
    <Container className="mt-4">
      <h1>Gestión de Usuarios</h1>

      <Card className="mt-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">Usuarios del Sistema</Card.Title>
            <Button variant="admin" onClick={openCreateModal}>
              Nuevo Usuario
            </Button>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table responsive striped>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.id === currentUser?.id
                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>
                        <RoleBadge role={user.role} />
                      </td>
                      <td>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(user)}>
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={isSelf}
                          title={isSelf ? "No puedes eliminar tu propia cuenta" : undefined}
                          onClick={() => handleDelete(user)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <UserFormModal show={showModal} handleClose={closeModal} handleSave={handleSave} selectedUser={selectedUser} />
    </Container>
  )
}

export default UsersPage
