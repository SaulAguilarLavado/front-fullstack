import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import eventosService from '@/services/eventos.service.js'
import { RUTAS, toRuta } from '@/constants/rutas.js'
import { formatFecha, formatHora } from '@/utils/format-date.js'
import { ESTADOS_EVENTO } from '@/constants/categorias.js'

export default function OrgMisEventos() {
  const qc = useQueryClient()
  const [pagina, setPagina] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['org-mis-eventos', pagina],
    queryFn: () => eventosService.getEventos({ page: pagina, size: 10, sort: 'dateTime,desc' }),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => eventosService.eliminarEvento(id),
    onSuccess: () => {
      toast.success('Evento eliminado')
      qc.invalidateQueries(['org-mis-eventos'])
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo eliminar'),
  })

  const eventos = data?.content ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Mis eventos</h1>
          <p>Gestiona los eventos que organizas</p>
        </div>
        <Link to={RUTAS.ORG_EVENTO_NUEVO} className="btn btn-primary">+ Nuevo evento</Link>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-text-muted)' }}>Cargando…</div>
      ) : eventos.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🎪</span>
          <h3>No has creado eventos todavía</h3>
          <Link to={RUTAS.ORG_EVENTO_NUEVO} className="btn btn-primary">Crear mi primer evento</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Fecha</th>
                <th>Venue</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500 }}>{e.title}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                    {formatFecha(e.dateTime)} · {formatHora(e.dateTime)}
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{e.venue?.name}</td>
                  <td>
                    <span className={`badge ${e.status === 'ACTIVE' ? 'badge-success' : e.status === 'CANCELLED' ? 'badge-danger' : 'badge-neutral'}`}>
                      {ESTADOS_EVENTO[e.status] ?? e.status}
                    </span>
                  </td>
                  <td className="table-actions">
                    <Link to={toRuta(RUTAS.ORG_EVENTO_EDITAR, { id: e.id })} className="btn btn-ghost btn-sm">Editar</Link>
                    <Link to={`${RUTAS.ORG_CATEGORIAS}?eventId=${e.id}`} className="btn btn-ghost btn-sm">Categorías</Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (confirm(`¿Eliminar "${e.title}"? Solo se puede si no tiene ventas.`)) {
                          deleteMut.mutate(e.id)
                        }
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
