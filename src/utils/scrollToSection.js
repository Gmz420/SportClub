// src/utils/scrollToSection.js
// Hace scroll a una sección del dashboard y la resalta (.section-highlight, ver
// roles.css). Pensado para llamarse en CADA clic del navbar: reinicia la animación
// aunque el cuadro ya estuviera resaltado (clic repetido en el mismo enlace, donde
// el hash de la URL no cambia). Si el elemento aún no está montado (p. ej. tras
// cambiar de ruta) reintenta una vez tras el render.
const HIGHLIGHT_DURATION = 1500

let activeEl = null
let activeTimer = null

export function scrollToSection(id) {
  const apply = () => {
    const el = document.getElementById(id)
    if (!el) return false

    el.scrollIntoView({ behavior: "smooth", block: "start" })

    // Limpia un resalte anterior y reinicia la animación forzando un reflow,
    // para que vuelva a ejecutarse aunque la clase ya estuviese aplicada.
    if (activeEl) activeEl.classList.remove("section-highlight")
    clearTimeout(activeTimer)
    el.classList.remove("section-highlight")
    void el.offsetWidth
    el.classList.add("section-highlight")

    activeEl = el
    activeTimer = setTimeout(() => el.classList.remove("section-highlight"), HIGHLIGHT_DURATION)
    return true
  }

  if (!apply()) {
    setTimeout(apply, 150)
  }
}
