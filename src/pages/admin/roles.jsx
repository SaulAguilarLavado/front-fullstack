import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import roleService from '@/services/role.service.js'

export default function AdminRoles() {
  const qc = useQueryClient()
  const [nombre, setNombre] = useState('')
  const [editandoId, setEditandoId] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => roleService.getRoles({ size: 50 }),
  })

  const saveMut = useMutation({
    mutationFn: (data) => editandoId ? roleService.editar(editandoId, data) : roleService.crear(data),
    onSuccess: () => {
      toast.success(editandoId ? 'Rol actualizado' : 'Rol creado')
      qc.invalidateQueries(['admin-roles'])
      setNombre('')
      setEditandoId(null)
    },
    onError: (e) => toast.error(e.message),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => roleService.eliminar(id),
    onSuccess: () => {
      toast.success('Rol eliminado')
      qc.invalidateQueries(['admin-roles'])
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo eliminar (¿tiene usuarios asignados?)'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMut.mutate({ name: nombre })
  }

  const roles = data?.content ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Roles</h1>
          <p>Roles del sistema: cliente, organizador, administrador</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 20, marginBottom: 24, maxWidth: 420, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div className="field" style={{ marginBottom: 0, flex: 1 }}>
          <label className="field-label">{editandoId ? 'Editar nombre del rol' : 'Nuevo rol'}</label>
          <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: SUPPORT" required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saveMut.isPending}>
          {editandoId ? 'Guardar' : 'Crear'}
        </button>
        {editandoId && (
          <button type="button" className="btn btn-ghost" onClick={() => { setEditandoId(null); setNombre('') }}>
            Cancelar
          </button>
        )}
      </form>

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>
      ) : (
        <div className="table-wrap" style={{ maxWidth: 480 }}>
          <table className="data-table">
            <thead><tr><th>Nombre</th><th>Creado</th><th></th></tr></thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-PE') : '—'}
                  </td>
                  <td className="table-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditandoId(r.id); setNombre(r.name) }}>Editar</button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => { if (confirm(`¿Eliminar rol "${r.name}"?`)) deleteMut.mutate(r.id) }}
                    >
                      Eliminar
                    </button>
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
