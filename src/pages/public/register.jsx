import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import useAuth from '@/hooks/use-auth.js'
import useAuthStore from '@/store/auth.store.js'
import { RUTAS } from '@/constants/rutas.js'
import { emailValido, passwordFuerte } from '@/utils/validators.js'
import './auth.css'

export default function Register() {
  const { register, isLoading, error } = useAuth()
  const token = useAuthStore((s) => s.token)

  const [form, setForm] = useState({ email: '', password: '', confirmar: '' })
  const [errores, setErrores] = useState({})

  if (token) return <Navigate to={RUTAS.HOME} replace />

  const validar = () => {
    const e = {}
    if (!emailValido(form.email)) e.email = 'Ingresa un correo válido'
    const { valido, errores: pwErr } = passwordFuerte(form.password)
    if (!valido) e.password = pwErr.join(', ')
    if (form.password !== form.confirmar) e.confirmar = 'Las contraseñas no coinciden'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return
    await register({ email: form.email, password: form.password })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">TicketFlow</div>
        <p className="auth-subtitle">Crea tu cuenta y empieza a comprar entradas</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className={`input ${errores.email ? 'has-error' : ''}`}
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
            {errores.email && <span className="field-error">{errores.email}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className={`input ${errores.password ? 'has-error' : ''}`}
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
            />
            {errores.password && <span className="field-error">{errores.password}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="confirmar">Confirmar contraseña</label>
            <input
              id="confirmar"
              type="password"
              className={`input ${errores.confirmar ? 'has-error' : ''}`}
              placeholder="Repite tu contraseña"
              value={form.confirmar}
              onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
              autoComplete="new-password"
            />
            {errores.confirmar && <span className="field-error">{errores.confirmar}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <hr className="auth-divider" />

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to={RUTAS.LOGIN}>Ingresar</Link>
        </p>
      </div>
    </div>
  )
}
