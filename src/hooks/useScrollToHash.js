// src/hooks/useScrollToHash.js
// React Router no hace scroll automático a #anclas (a diferencia de un <a href> normal).
// Este hook lo replica: cuando cambia el hash de la URL, busca el elemento con ese id
// dentro del Outlet actual y hace scroll hacia él.
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const element = document.getElementById(hash.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [hash])
}
