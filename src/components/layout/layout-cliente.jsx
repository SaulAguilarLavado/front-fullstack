import { NavLink, Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import useAuthStore from '@/store/auth.store.js'
import { RUTAS } from '@/constants/rutas.js'
import { ROLES } from '@/constants/roles.js'

export default function LayoutCliente() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user?.roleName === ROLES.ADMIN
  const isOrganizador = user?.roleName === ROLES.ORGANIZADOR

  if (isAdmin) {
    return <Navigate to={RUTAS.ADMIN_DASHBOARD} replace />
  }

  if (isOrganizador) {
    return <Navigate to={RUTAS.ORG_DASHBOARD} replace />
  }

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate(RUTAS.HOME)
  }

  const iniciales = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="layout-public" style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to={RUTAS.HOME} className="navbar-brand">TicketFlow</Link>
          <div className="navbar-nav">
            <NavLink to={RUTAS.EVENTOS} className="navbar-link">Eventos</NavLink>
          </div>
          <div className="navbar-actions">
            <div className="navbar-avatar">{iniciales}</div>
            <span style={{ fontSize: 14 }}>{user?.fullName ?? user?.email}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Salir</button>
          </div>
        </div>
      </nav>

      <div className="layout-admin">
        <aside className="sidebar">
          <NavLink to={RUTAS.MIS_ENTRADAS} className="sidebar-link">🎟 Mis entradas</NavLink>
          <NavLink to={RUTAS.HISTORIAL} className="sidebar-link">📋 Historial</NavLink>
          <NavLink to={RUTAS.PERFIL} className="sidebar-link">👤 Mi perfil</NavLink>
        </aside>
        <main className="layout-admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
