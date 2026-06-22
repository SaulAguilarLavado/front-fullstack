import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import usuariosService from '@/services/usuarios.service.js'
import roleService from '@/services/role.service.js'
import { ROLE_LABELS } from '@/constants/roles.js'

export default function AdminUsuarios() {
  const qc = useQueryClient()
  const [pagina, setPagina] = useState(0)
  const [editandoRolId, setEditandoRolId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-usuarios', pagina],
    queryFn: () => usuariosService.getUsuarios({ page: pagina, size: 15 }),
  })

  const { data: rolesData } = useQuery({
    queryKey: ['roles-select'],
    queryFn: () => roleService.getRoles({ size: 50 }),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => usuariosService.actualizarUsuario(id, data),
    onSuccess: () => {
      toast.success('Usuario actualizado')
      qc.invalidateQueries(['admin-usuarios'])
      setEditandoRolId(null)
    },
    onError: (e) => toast.error(e.message),
  })

  const deactivateMut = useMutation({
    mutationFn: (id) => usuariosService.desactivarUsuario(id),
    onSuccess: () => {
      toast.success('Usuario desactivado')
      qc.invalidateQueries(['admin-usuarios'])
    },
    onError: (e) => toast.error(e.message),
  })

  const usuarios = data?.content ?? []
  const roles = rolesData?.content ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Gestiona cuentas y roles del sistema</p>
        </div>
      </div>

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.fullName || '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{u.email}</td>
                  <td>
                    {editandoRolId === u.id ? (
                      <select
                        className="select"
                        style={{ padding: '4px 8px', fontSize: 13 }}
                        defaultValue={u.roleId}
                        onChange={(e) =>
                          updateMut.mutate({ id: u.id, data: { fullName: u.fullName, roleId: Number(e.target.value) } })
                        }
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className="badge badge-neutral"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditandoRolId(u.id)}
                        title="Click para cambiar rol"
                      >
                        {ROLE_LABELS[u.roleName] ?? u.roleName}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="table-actions">
                    {u.isActive && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (confirm(`¿Desactivar a ${u.email}?`)) deactivateMut.mutate(u.id)
                        }}
                      >
                        Desactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
