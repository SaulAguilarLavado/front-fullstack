import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import useAuthStore from '@/store/auth.store.js'
import { RUTAS } from '@/constants/rutas.js'
import { ROLES } from '@/constants/roles.js'

export default function LayoutPublic() {
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user?.roleName === ROLES.ADMIN
  const isOrganizador = user?.roleName === ROLES.ORGANIZADOR

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate(RUTAS.HOME)
  }

  const iniciales = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  const dashboardRuta = isAdmin
    ? RUTAS.ADMIN_DASHBOARD
    : isOrganizador
    ? RUTAS.ORG_DASHBOARD
    : RUTAS.PERFIL

  return (
    <div className="layout-public">
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to={RUTAS.HOME} className="navbar-brand">TicketFlow</Link>

          <div className="navbar-nav">
            <NavLink to={RUTAS.HOME} className="navbar-link" end>Inicio</NavLink>
            <NavLink to={RUTAS.EVENTOS} className="navbar-link">Eventos</NavLink>
          </div>

          <div className="navbar-actions">
            {token ? (
              <>
                <Link to={dashboardRuta} className="navbar-user">
                  <div className="navbar-avatar">{iniciales}</div>
                  <span style={{ fontSize: 14, color: 'var(--color-text)' }}>
                    {user?.fullName ?? user?.email}
                  </span>
                </Link>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to={RUTAS.LOGIN} className="btn btn-ghost btn-sm">Ingresar</Link>
                <Link to={RUTAS.REGISTER} className="btn btn-primary btn-sm">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="layout-public-main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand">TicketFlow</span>
          <span className="footer-copy">© {new Date().getFullYear()} · Todos los derechos reservados</span>
        </div>
      </footer>
    </div>
  )
}
