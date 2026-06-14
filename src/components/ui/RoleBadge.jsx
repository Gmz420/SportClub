// src/components/ui/RoleBadge.jsx
import { Badge } from "react-bootstrap"
import { getRoleColors } from "../../constants/roleColors"

function RoleBadge({ role }) {
  const { bg, label } = getRoleColors(role)

  return <Badge bg={bg}>{label}</Badge>
}

export default RoleBadge
