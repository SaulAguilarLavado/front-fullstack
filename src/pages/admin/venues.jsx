import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import venueService from '@/services/venue.service.js'

const FORM_VACIO = { name: '', address: '', city: '', capacity: '' }

export default function AdminVenues() {
  const qc = useQueryClient()
  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: () => venueService.getVenues({ size: 50 }),
  })

  const resetForm = () => { setForm(FORM_VACIO); setEditandoId(null); setMostrarForm(false) }

  const saveMut = useMutation({
    mutationFn: (data) => editandoId ? venueService.editar(editandoId, data) : venueService.crear(data),
    onSuccess: () => {
      toast.success(editandoId ? 'Venue actualizado' : 'Venue creado')
      qc.invalidateQueries(['admin-venues'])
      resetForm()
    },
    onError: (e) => toast.error(e.message),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => venueService.eliminar(id),
    onSuccess: () => {
      toast.success('Venue eliminado')
      qc.invalidateQueries(['admin-venues'])
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo eliminar (¿tiene eventos?)'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMut.mutate({ ...form, capacity: Number(form.capacity) })
  }

  const handleEditar = (v) => {
    setEditandoId(v.id)
    setForm({ name: v.name, address: v.address ?? '', city: v.city ?? '', capacity: String(v.capacity) })
    setMostrarForm(true)
  }

  const venues = data?.content ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Venues</h1>
          <p>Lugares donde se realizan los eventos</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setMostrarForm(true) }}>
          + Nuevo venue
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: 24, marginBottom: 24, maxWidth: 480 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            {editandoId ? 'Editar venue' : 'Nuevo venue'}
          </h3>
          <div className="field">
            <label className="field-label">Nombre</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label className="field-label">Dirección</label>
            <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="field">
            <label className="field-label">Ciudad</label>
            <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          </div>
          <div className="field">
            <label className="field-label">Aforo</label>
            <input className="input" type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saveMut.isPending}>
              {editandoId ? 'Guardar' : 'Crear'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancelar</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>
      ) : venues.length === 0 ? (
        <div className="empty-state"><h3>Sin venues registrados</h3></div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Nombre</th><th>Ciudad</th><th>Dirección</th><th>Aforo</th><th></th></tr></thead>
            <tbody>
              {venues.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 500 }}>{v.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{v.city}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{v.address}</td>
                  <td>{v.capacity}</td>
                  <td className="table-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEditar(v)}>Editar</button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => { if (confirm(`¿Eliminar "${v.name}"?`)) deleteMut.mutate(v.id) }}
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
