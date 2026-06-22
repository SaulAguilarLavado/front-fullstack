import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import useAuth from '@/hooks/use-auth.js'
import useAuthStore from '@/store/auth.store.js'
import { RUTAS } from '@/constants/rutas.js'
import './auth.css'

export default function Login() {
  const { login, isLoading, error } = useAuth()
  const token = useAuthStore((s) => s.token)

  const [form, setForm] = useState({ email: '', password: '' })

  if (token) return <Navigate to={RUTAS.HOME} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(form.email, form.password)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">TicketFlow</div>
        <p className="auth-subtitle">Ingresa a tu cuenta para comprar entradas</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <hr className="auth-divider" />

        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to={RUTAS.REGISTER}>Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}
