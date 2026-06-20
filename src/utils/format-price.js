const LOCALE = 'es-PE'
const CURRENCY = 'PEN'

export const formatPrecio = (amount) =>
  new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY }).format(amount)

export const formatPrecioCorto = (amount) =>
  `S/${Number(amount).toFixed(0)}`
