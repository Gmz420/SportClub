// src/layouts/CoachLayout.jsx
import { Outlet } from "react-router-dom"
import RoleNavbar from "../components/ui/RoleNavbar"

function CoachLayout() {
  return (
    <>
      <RoleNavbar role="coach" />
      <Outlet />
    </>
  )
}

export default CoachLayout
