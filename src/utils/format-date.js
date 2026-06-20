const LOCALE = 'es-PE'

// El backend ya no separa fecha y hora: Event.dateTime es un único
// LocalDateTime ISO (ej: "2026-08-15T20:00:00"). formatHora ya no
// recibe un string "20:00:00" suelto, sino el mismo dateTime completo.

export const formatFecha = (dateTime) =>
  new Intl.DateTimeFormat(LOCALE, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(dateTime))

export const formatHora = (dateTime) =>
  new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit', hour12: true })
    .format(new Date(dateTime))

export const formatFechaCorta = (dateTime) =>
  new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' }).format(new Date(dateTime))

export const esFuturo = (dateTime) => new Date(dateTime) > new Date()

export const diasRestantes = (dateTime) => {
  const diff = new Date(dateTime) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
