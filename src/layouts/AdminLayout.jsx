// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom"
import RoleNavbar from "../components/ui/RoleNavbar"
import { useScrollToHash } from "../hooks/useScrollToHash"

function AdminLayout() {
  useScrollToHash()

  return (
    <>
      <RoleNavbar role="admin" />
      <Outlet />
    </>
  )
}

export default AdminLayout
