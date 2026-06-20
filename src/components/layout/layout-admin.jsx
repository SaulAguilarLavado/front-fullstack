import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import useAuthStore from '@/store/auth.store.js'
import { RUTAS } from '@/constants/rutas.js'

export default function LayoutAdmin() {
  const { user, logout, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate(RUTAS.HOME)
  }

  const iniciales = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="layout-public" style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to={RUTAS.HOME} className="navbar-brand">TicketFlow</Link>
          <div className="navbar-actions">
            <div className="navbar-avatar">{iniciales}</div>
            <span style={{ fontSize: 14 }}>{user?.fullName ?? user?.email}</span>
            <span className="badge badge-neutral" style={{ marginLeft: 4 }}>
              {isAdmin ? 'Admin' : 'Organizador'}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Salir</button>
          </div>
        </div>
      </nav>

      <div className="layout-admin">
        <aside className="sidebar">
          {isAdmin ? (
            <>
              <span className="sidebar-section">Panel</span>
              <NavLink to={RUTAS.ADMIN_DASHBOARD} className="sidebar-link">📊 Dashboard</NavLink>
              <span className="sidebar-section">Gestión</span>
              <NavLink to={RUTAS.ADMIN_EVENTOS} className="sidebar-link">🎪 Eventos</NavLink>
              <NavLink to={RUTAS.ADMIN_VENUES} className="sidebar-link">📍 Venues</NavLink>
              <NavLink to={RUTAS.ADMIN_USUARIOS} className="sidebar-link">👥 Usuarios</NavLink>
              <NavLink to={RUTAS.ADMIN_ORGANIZADORES} className="sidebar-link">🏢 Organizadores</NavLink>
              <NavLink to={RUTAS.ADMIN_ROLES} className="sidebar-link">🔑 Roles</NavLink>
              <span className="sidebar-section">Ventas</span>
              <NavLink to={RUTAS.ADMIN_VENTAS} className="sidebar-link">💳 Ventas</NavLink>
              <NavLink to={RUTAS.ADMIN_REPORTES} className="sidebar-link">📈 Reportes</NavLink>
            </>
          ) : (
            <>
              <span className="sidebar-section">Panel</span>
              <NavLink to={RUTAS.ORG_DASHBOARD} className="sidebar-link">📊 Dashboard</NavLink>
              <span className="sidebar-section">Mis eventos</span>
              <NavLink to={RUTAS.ORG_MIS_EVENTOS} className="sidebar-link">🎪 Mis eventos</NavLink>
              <NavLink to={RUTAS.ORG_CATEGORIAS} className="sidebar-link">🏷 Categorías</NavLink>
              <NavLink to={RUTAS.ORG_VENTAS} className="sidebar-link">💳 Mis ventas</NavLink>
            </>
          )}
        </aside>
        <main className="layout-admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
