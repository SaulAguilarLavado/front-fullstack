export const RUTAS = {
  // públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  EVENTOS: '/eventos',
  EVENTO_DETALLE: '/eventos/:id',

  // cliente (requiere login)
  PERFIL: '/perfil',
  MIS_ENTRADAS: '/mis-entradas',
  ENTRADA_DETALLE: '/mis-entradas/:id',
  HISTORIAL: '/historial',
  COMPRA: '/compra/:eventoId',
  COMPRA_CONFIRMACION: '/compra/confirmacion',

  // organizador
  ORG_DASHBOARD: '/organizador/dashboard',
  ORG_MIS_EVENTOS: '/organizador/mis-eventos',
  ORG_EVENTO_NUEVO: '/organizador/eventos/nuevo',
  ORG_EVENTO_EDITAR: '/organizador/eventos/:id/editar',
  ORG_VENTAS: '/organizador/mis-ventas',
  ORG_CATEGORIAS: '/organizador/categorias',

  // admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EVENTOS: '/admin/eventos',
  ADMIN_EVENTO_NUEVO: '/admin/eventos/nuevo',
  ADMIN_EVENTO_DETALLE: '/admin/eventos/:id',
  ADMIN_EVENTO_EDITAR: '/admin/eventos/:id/editar',
  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_USUARIO_DETALLE: '/admin/usuarios/:id',
  ADMIN_VENUES: '/admin/venues',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_VENTAS: '/admin/ventas',
  ADMIN_REPORTES: '/admin/reportes',
  ADMIN_ORGANIZADORES: '/admin/organizadores',
}

// helper para construir rutas con parámetros
// ej: toRuta(RUTAS.EVENTO_DETALLE, { id: 5 }) → '/eventos/5'
export const toRuta = (ruta, params = {}) => {
  return Object.entries(params).reduce(
    (acc, [key, val]) => acc.replace(`:${key}`, val),
    ruta
  )
}
