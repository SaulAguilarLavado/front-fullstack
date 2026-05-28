export function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString()
}
