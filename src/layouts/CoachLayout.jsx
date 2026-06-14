// src/layouts/CoachLayout.jsx
import { Outlet } from "react-router-dom"
import RoleNavbar from "../components/ui/RoleNavbar"
import { useScrollToHash } from "../hooks/useScrollToHash"

function CoachLayout() {
  useScrollToHash()

  return (
    <>
      <RoleNavbar role="coach" />
      <Outlet />
    </>
  )
}

export default CoachLayout
