// src/pages/admin/UsersPage.jsx
import { useEffect, useState } from "react"
import { Button, Card, Container, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import RoleBadge from "../../components/ui/RoleBadge"
import UserFormModal from "../../components/users/UserFormModal"
import { getUser } from "../../services/authService"
import { createUser, deleteUser, getUsers, updateUser } from "../../services/userService"
import { notifyError } from "../../utils/notify"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  // Cambia en cada apertura para remontar el modal con datos frescos (ver UserFormModal).
  const [modalKey, setModalKey] = useState(0)

  const currentUser = getUser()

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      notifyError(error, "No se pudieron cargar los usuarios")
    } finally {
      setLoading(false)
    }
  }

  // Carga inicial: el estado parte en loading=true y los setState ocurren dentro
  // de callbacks async (no en el cuerpo del effect), por lo que no dispara renders
  // en cascada. El flag `active` evita actualizar estado si el componente se desmonta.
  useEffect(() => {
    let active = true
    getUsers()
      .then((data) => active && setUsers(data))
      .catch((error) => notifyError(error, "No se pudieron cargar los usuarios"))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const openCreateModal = () => {
    setSelectedUser(null)
    setModalKey((k) => k + 1)
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setModalKey((k) => k + 1)
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
      notifyError(error, "No se pudo guardar el usuario")
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
      notifyError(error, "No se pudo eliminar el usuario")
    }
  }

  return (
    <Container className="mt-4">
      <h1 className="app-page-title text-admin">Gestión de Usuarios</h1>

      <Card className="app-card mt-3">
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

      <UserFormModal
        key={modalKey}
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </Container>
  )
}

export default UsersPage
