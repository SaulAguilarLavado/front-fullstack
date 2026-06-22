import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import usuariosService from '@/services/usuarios.service.js'
import roleService from '@/services/role.service.js'
import { ROLES } from '@/constants/roles.js'

const FORM_VACIO = { email: '', password: '', fullName: '' }

export default function AdminOrganizadores() {
  const qc = useQueryClient()
  const [form, setForm] = useState(FORM_VACIO)
  const [mostrarForm, setMostrarForm] = useState(false)

  const { data: usuariosData, isLoading } = useQuery({
    queryKey: ['admin-usuarios-todos'],
    queryFn: () => usuariosService.getUsuarios({ size: 100 }),
  })

  const { data: rolesData } = useQuery({
    queryKey: ['roles-select'],
    queryFn: () => roleService.getRoles({ size: 50 }),
  })

  const organizadores = (usuariosData?.content ?? []).filter((u) => u.roleName === ROLES.ORGANIZADOR)
  const rolOrganizador = (rolesData?.content ?? []).find((r) => r.name === ROLES.ORGANIZADOR)

  const createMut = useMutation({
    mutationFn: (data) => usuariosService.crearUsuario(data),
    onSuccess: () => {
      toast.success('Organizador creado')
      qc.invalidateQueries({ queryKey: ['admin-usuarios-todos'] })
      setForm(FORM_VACIO)
      setMostrarForm(false)
    },
    onError: (e) => toast.error(e.message),
  })

  const deactivateMut = useMutation({
    mutationFn: (id) => usuariosService.desactivarUsuario(id),
    onSuccess: () => {
      toast.success('Cuenta desactivada')
      qc.invalidateQueries({ queryKey: ['admin-usuarios-todos'] })
    },
    onError: (e) => toast.error(e.message),
  })

  const activateMut = useMutation({
    mutationFn: (id) => usuariosService.activarUsuario(id),
    onSuccess: () => {
      toast.success('Cuenta activada')
      qc.invalidateQueries({ queryKey: ['admin-usuarios-todos'] })
    },
    onError: (e) => toast.error(e.message),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rolOrganizador) {
      toast.error('No se encontró el rol ORGANIZER en el sistema')
      return
    }
    createMut.mutate({ ...form, roleId: rolOrganizador.id })
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Organizadores</h1>
          <p>Cuentas con permiso para crear y gestionar eventos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setMostrarForm((v) => !v)}>
          + Nuevo organizador
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: 24, marginBottom: 24, maxWidth: 420 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Nueva cuenta organizador</h3>
          <div className="field">
            <label className="field-label">Correo</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="field">
            <label className="field-label">Nombre completo</label>
            <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="field">
            <label className="field-label">Contraseña temporal</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={createMut.isPending}>
              {createMut.isPending ? 'Creando…' : 'Crear organizador'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setMostrarForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>
      ) : organizadores.length === 0 ? (
        <div className="empty-state"><h3>No hay organizadores registrados</h3></div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Nombre</th><th>Correo</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {organizadores.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 500 }}>{o.fullName}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{o.email}</td>
                  <td>
                    <span className={`badge ${o.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {o.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="table-actions">
                    {o.isActive ? (
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={deactivateMut.isPending}
                        onClick={() => { if (confirm(`¿Desactivar a ${o.email}?`)) deactivateMut.mutate(o.id) }}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={activateMut.isPending}
                        onClick={() => { if (confirm(`¿Activar a ${o.email}?`)) activateMut.mutate(o.id) }}
                      >
                        Activar
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
