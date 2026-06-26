import { Routes, Route } from 'react-router-dom'

// guards
import PrivateRoute from './private-route.jsx'
import OrganizerRoute from './organizer-route.jsx'
import AdminRoute from './admin-route.jsx'

// layouts
import LayoutPublic from '@/components/layout/layout-public.jsx'
import LayoutCliente from '@/components/layout/layout-cliente.jsx'
import LayoutAdmin from '@/components/layout/layout-admin.jsx'

// páginas públicas
import Home from '@/pages/public/home.jsx'
import Login from '@/pages/public/login.jsx'
import Register from '@/pages/public/register.jsx'
import Eventos from '@/pages/public/eventos.jsx'
import EventoDetalle from '@/pages/public/evento-detalle.jsx'
import NotFound from '@/pages/public/not-found.jsx'

// páginas cliente
import Perfil from '@/pages/cliente/perfil.jsx'
import MisEntradas from '@/pages/cliente/mis-entradas.jsx'
import EntradaDetalle from '@/pages/cliente/entrada-detalle.jsx'
import Historial from '@/pages/cliente/historial.jsx'
import Compra from '@/pages/cliente/compra.jsx'
import CompraConfirmacion from '@/pages/cliente/compra-confirmacion.jsx'

// páginas organizador
import OrgDashboard from '@/pages/organizador/dashboard.jsx'
import OrgMisEventos from '@/pages/organizador/mis-eventos.jsx'
import EventoForm from '@/pages/organizador/evento-form.jsx'
import OrgVentas from '@/pages/organizador/ventas.jsx'
import OrgCategorias from '@/pages/organizador/categorias.jsx'

// páginas admin
import AdminDashboard from '@/pages/admin/dashboard.jsx'
import AdminEventos from '@/pages/admin/eventos.jsx'
import AdminEventoDetalle from '@/pages/admin/evento-detalle.jsx'
import AdminUsuarios from '@/pages/admin/usuarios.jsx'
import AdminUsuarioDetalle from '@/pages/admin/usuario-detalle.jsx'
import AdminVenues from '@/pages/admin/venues.jsx'
import AdminCategorias from '@/pages/admin/categorias-admin.jsx'
import AdminRoles from '@/pages/admin/roles.jsx'
import AdminVentas from '@/pages/admin/ventas.jsx'
import AdminReportes from '@/pages/admin/reportes.jsx'
import AdminOrganizadores from '@/pages/admin/organizadores.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── PÚBLICAS ── */}
      <Route element={<LayoutPublic />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:id" element={<EventoDetalle />} />
      </Route>

      {/* ── CLIENTE (requiere login) ── */}
      <Route element={<PrivateRoute />}>
        <Route element={<LayoutCliente />}>
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/mis-entradas" element={<MisEntradas />} />
          <Route path="/mis-entradas/:id" element={<EntradaDetalle />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/compra/:eventoId" element={<Compra />} />
          <Route path="/compra/confirmacion" element={<CompraConfirmacion />} />
        </Route>
      </Route>

      {/* ── ORGANIZADOR (organizador o admin) ── */}
      <Route element={<OrganizerRoute />}>
        <Route element={<LayoutAdmin />}>
          <Route path="/organizador/dashboard" element={<OrgDashboard />} />
          <Route path="/organizador/mis-eventos" element={<OrgMisEventos />} />
          <Route path="/organizador/eventos/nuevo" element={<EventoForm />} />
          <Route path="/organizador/eventos/:id/editar" element={<EventoForm />} />
          <Route path="/organizador/mis-ventas" element={<OrgVentas />} />
          <Route path="/organizador/categorias" element={<OrgCategorias />} />
        </Route>
      </Route>

      {/* ── ADMIN ── */}
      <Route element={<AdminRoute />}>
        <Route element={<LayoutAdmin />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/eventos" element={<AdminEventos />} />
          {/* Admin reutiliza el mismo EventoForm que organizador: mismo
              EventRequest, el backend distingue el permiso por rol, no
              por ruta del front. */}
          <Route path="/admin/eventos/nuevo" element={<EventoForm />} />
          <Route path="/admin/eventos/:id" element={<AdminEventoDetalle />} />
          <Route path="/admin/eventos/:id/editar" element={<EventoForm />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/usuarios/:id" element={<AdminUsuarioDetalle />} />
          <Route path="/admin/venues" element={<AdminVenues />} />
          <Route path="/admin/categorias" element={<AdminCategorias />} />
          <Route path="/admin/roles" element={<AdminRoles />} />
          <Route path="/admin/ventas" element={<AdminVentas />} />
          <Route path="/admin/reportes" element={<AdminReportes />} />
          <Route path="/admin/organizadores" element={<AdminOrganizadores />} />
        </Route>
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
