import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import eventosService from '@/services/eventos.service.js'
import ticketTypeService from '@/services/ticket-type.service.js'
import { formatPrecio } from '@/utils/format-price.js'

const FORM_VACIO = { name: '', price: '', totalQty: '' }

export default function OrgCategorias() {
  const [params, setParams] = useSearchParams()
  const eventId = params.get('eventId')
  const qc = useQueryClient()

  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)

  const { data: eventos = [] } = useQuery({
    queryKey: ['org-eventos-select'],
    queryFn: () => eventosService.getMisEventos({ size: 100 }).then((r) => r.content ?? []),
  })

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['ticket-types', eventId],
    queryFn: () => ticketTypeService.getByEvento(Number(eventId)),
    enabled: !!eventId,
  })

  const resetForm = () => { setForm(FORM_VACIO); setEditandoId(null) }

  const saveMut = useMutation({
    mutationFn: (data) =>
      editandoId
        ? ticketTypeService.editar(editandoId, data)
        : ticketTypeService.crear(data),
    onSuccess: () => {
      toast.success(editandoId ? 'Categoría actualizada' : 'Categoría creada')
      qc.invalidateQueries(['ticket-types', eventId])
      resetForm()
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo guardar'),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => ticketTypeService.eliminar(id),
    onSuccess: () => {
      toast.success('Categoría eliminada')
      qc.invalidateQueries(['ticket-types', eventId])
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo eliminar (¿tiene ventas?)'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!eventId) { toast.error('Selecciona un evento primero'); return }
    saveMut.mutate({
      eventId: Number(eventId),
      name: form.name,
      price: Number(form.price),
      totalQty: Number(form.totalQty),
    })
  }

  const handleEditar = (cat) => {
    setEditandoId(cat.id)
    setForm({ name: cat.name, price: String(cat.price), totalQty: String(cat.totalQty) })
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categorías de precio</h1>
          <p>Define las entradas disponibles para cada evento (VIP, General, etc.)</p>
        </div>
      </div>

      <div className="field" style={{ maxWidth: 360, marginBottom: 24 }}>
        <label className="field-label">Selecciona un evento</label>
        <select
          className="select"
          value={eventId ?? ''}
          onChange={(e) => { setParams({ eventId: e.target.value }); resetForm() }}
        >
          <option value="">— Elige un evento —</option>
          {eventos.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {eventId && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
          {/* Form crear/editar */}
          <form onSubmit={handleSubmit} className="card" style={{ padding: 20, alignSelf: 'start' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
              {editandoId ? 'Editar categoría' : 'Nueva categoría'}
            </h3>
            <div className="field">
              <label className="field-label">Nombre</label>
              <input
                className="input"
                placeholder="VIP, General..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label className="field-label">Precio (S/)</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label className="field-label">Cantidad total</label>
              <input
                className="input"
                type="number"
                min="1"
                value={form.totalQty}
                onChange={(e) => setForm({ ...form, totalQty: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saveMut.isPending}>
                {editandoId ? 'Guardar' : 'Crear'}
              </button>
              {editandoId && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {/* Lista */}
          <div>
            {isLoading ? (
              <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>
            ) : categorias.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize: 32 }}>🏷</span>
                <h3>Sin categorías aún</h3>
                <p>Crea la primera con el formulario de la izquierda.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Nombre</th><th>Precio</th><th>Vendidas</th><th>Disponibles</th><th></th></tr>
                  </thead>
                  <tbody>
                    {categorias.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 500 }}>{c.name}</td>
                        <td className="price">{formatPrecio(c.price)}</td>
                        <td>{c.soldQty} / {c.totalQty}</td>
                        <td>{c.totalQty - c.soldQty}</td>
                        <td className="table-actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => handleEditar(c)}>Editar</button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (confirm(`¿Eliminar "${c.name}"?`)) deleteMut.mutate(c.id)
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
        </div>
      )}
    </div>
  )
}
