// src/layouts/UserLayout.jsx
import { Outlet } from "react-router-dom"
import RoleNavbar from "../components/ui/RoleNavbar"

function UserLayout() {
  return (
    <>
      <RoleNavbar role="user" />
      <Outlet />
    </>
  )
}

export default UserLayout
