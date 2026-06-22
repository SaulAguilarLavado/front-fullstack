import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import eventosService from '@/services/eventos.service.js'
import { RUTAS, toRuta } from '@/constants/rutas.js'
import { formatFecha } from '@/utils/format-date.js'
import { ESTADOS_EVENTO } from '@/constants/categorias.js'

export default function AdminEventos() {
  const qc = useQueryClient()
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-eventos', busqueda, pagina],
    queryFn: () => eventosService.getEventos({
      page: pagina, size: 12, sort: 'dateTime,desc',
      ...(busqueda && { title: busqueda }),
    }),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => eventosService.eliminarEvento(id),
    onSuccess: () => {
      toast.success('Evento eliminado')
      qc.invalidateQueries(['admin-eventos'])
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo eliminar'),
  })

  const eventos = data?.content ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Eventos</h1>
          <p>Todos los eventos del sistema, de cualquier organizador</p>
        </div>
        <Link to={RUTAS.ADMIN_EVENTO_NUEVO} className="btn btn-primary">+ Nuevo evento</Link>
      </div>

      <div className="field" style={{ maxWidth: 320, marginBottom: 20 }}>
        <input
          className="input"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPagina(0) }}
        />
      </div>

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>
      ) : eventos.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🎪</span>
          <h3>No hay eventos</h3>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Evento</th><th>Organizador</th><th>Fecha</th><th>Venue</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500 }}>{e.title}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{e.organizerName ?? '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{formatFecha(e.dateTime)}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{e.venue?.name}</td>
                  <td>
                    <span className={`badge ${e.status === 'ACTIVE' ? 'badge-success' : e.status === 'CANCELLED' ? 'badge-danger' : 'badge-neutral'}`}>
                      {ESTADOS_EVENTO[e.status] ?? e.status}
                    </span>
                  </td>
                  <td className="table-actions">
                    <Link to={toRuta(RUTAS.ADMIN_EVENTO_DETALLE, { id: e.id })} className="btn btn-ghost btn-sm">Ver</Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (confirm(`¿Eliminar "${e.title}"?`)) deleteMut.mutate(e.id)
                      }}
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
