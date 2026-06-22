export const emailValido = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const passwordFuerte = (pw) => {
  const errores = []
  if (pw.length < 8) errores.push('Mínimo 8 caracteres')
  if (!/[A-Z]/.test(pw)) errores.push('Al menos una mayúscula')
  if (!/[0-9]/.test(pw)) errores.push('Al menos un número')
  return { valido: errores.length === 0, errores }
}

export const requerido = (valor) =>
  valor !== null && valor !== undefined && String(valor).trim() !== ''
