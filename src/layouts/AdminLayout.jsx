// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom"
import RoleNavbar from "../components/ui/RoleNavbar"

function AdminLayout() {
  return (
    <>
      <RoleNavbar role="admin" />
      <Outlet />
    </>
  )
}

export default AdminLayout
