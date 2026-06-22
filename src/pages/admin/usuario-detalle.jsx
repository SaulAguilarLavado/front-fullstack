import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import usuariosService from '@/services/usuarios.service.js'
import { RUTAS } from '@/constants/rutas.js'
import { ROLE_LABELS } from '@/constants/roles.js'

export default function AdminUsuarioDetalle() {
  const { id } = useParams()

  const { data: usuario, isLoading } = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => usuariosService.getUsuarioById(id),
  })

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>
  if (!usuario) return <div className="empty-state"><h3>Usuario no encontrado</h3></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{usuario.fullName || usuario.email}</h1>
          <p>Detalle de cuenta</p>
        </div>
        <Link to={RUTAS.ADMIN_USUARIOS} className="btn btn-ghost">← Volver</Link>
      </div>

      <div className="card" style={{ padding: 24, maxWidth: 480 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
          <div><strong>Correo:</strong> {usuario.email}</div>
          <div><strong>Nombre:</strong> {usuario.fullName || '—'}</div>
          <div><strong>Rol:</strong> <span className="badge badge-neutral">{ROLE_LABELS[usuario.roleName] ?? usuario.roleName}</span></div>
          <div>
            <strong>Estado:</strong>{' '}
            <span className={`badge ${usuario.isActive ? 'badge-success' : 'badge-danger'}`}>
              {usuario.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div><strong>Registrado:</strong> {usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-PE') : '—'}</div>
        </div>
      </div>
    </div>
  )
}
