// src/layouts/UserLayout.jsx
import { Outlet } from "react-router-dom"
import RoleNavbar from "../components/ui/RoleNavbar"
import { useScrollToHash } from "../hooks/useScrollToHash"

function UserLayout() {
  useScrollToHash()

  return (
    <>
      <RoleNavbar role="user" />
      <Outlet />
    </>
  )
}

export default UserLayout
