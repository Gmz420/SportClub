// src/components/users/UserFormModal.jsx
import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const initialForm = {
  full_name: "",
  email: "",
  password: "",
  role: "user",
  birth_date: "",
}

function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
  const [formData, setFormData] = useState(initialForm)
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        full_name: selectedUser.full_name || "",
        email: selectedUser.email || "",
        password: "",
        role: selectedUser.role || "user",
        birth_date: selectedUser.birth_date || "",
      })
    } else {
      setFormData(initialForm)
    }
    setValidated(false)
  }, [selectedUser, show])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      event.stopPropagation()
      setValidated(true)
      return
    }
    setValidated(true)

    // Al editar, contraseña vacía = no cambiarla (no se envía al backend).
    const { password, birth_date, ...rest } = formData
    const payload = { ...rest, birth_date: birth_date || null }
    if (!selectedUser || password) {
      payload.password = password
    }
    handleSave(payload)
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedUser ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formFullName">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              minLength={3}
            />
            <Form.Control.Feedback type="invalid">
              Ingresa un nombre válido (mínimo 3 caracteres).
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Form.Control.Feedback type="invalid">Ingresa un correo válido.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña{selectedUser && " (dejar vacío para no cambiarla)"}</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!selectedUser}
              minLength={8}
            />
            <Form.Control.Feedback type="invalid">Debe tener al menos 8 caracteres.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Rol</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="coach">Coach</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBirthDate">
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control type="date" name="birth_date" value={formData.birth_date || ""} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="admin" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default UserFormModal
