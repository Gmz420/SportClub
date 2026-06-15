// src/hooks/useScrollToHash.js
// React Router no hace scroll automático a #anclas (a diferencia de un <a href> normal).
// Este hook lo replica: cuando cambia el hash de la URL, busca el elemento con ese id
// dentro del Outlet actual y hace scroll hacia él.
// Además aplica un resalte temporal (.section-highlight, ver roles.css): si la sección
// ya está visible en pantalla, el scroll no produce ningún cambio perceptible y el
// enlace del navbar parece "no hacer nada".
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const HIGHLIGHT_DURATION = 1200

export function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const element = document.getElementById(hash.slice(1))
    if (!element) return

    element.scrollIntoView({ behavior: "smooth", block: "start" })
    element.classList.add("section-highlight")

    const timeout = setTimeout(() => {
      element.classList.remove("section-highlight")
    }, HIGHLIGHT_DURATION)

    return () => clearTimeout(timeout)
  }, [hash])
}
