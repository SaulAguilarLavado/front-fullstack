import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import categoryService from '@/services/category.service.js'

const FORM_VACIO = { name: '', description: '' }

export default function AdminCategorias() {
  const qc = useQueryClient()
  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoryService.getAll,
  })

  const resetForm = () => { setForm(FORM_VACIO); setEditandoId(null) }

  const saveMut = useMutation({
    mutationFn: (data) =>
      editandoId ? categoryService.editar(editandoId, data) : categoryService.crear(data),
    onSuccess: () => {
      toast.success(editandoId ? 'Categoría actualizada' : 'Categoría creada')
      qc.invalidateQueries({ queryKey: ['categorias'] })
      resetForm()
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo guardar'),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => categoryService.eliminar(id),
    onSuccess: () => {
      toast.success('Categoría eliminada')
      qc.invalidateQueries({ queryKey: ['categorias'] })
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo eliminar (¿tiene eventos asociados?)'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMut.mutate({ name: form.name, description: form.description || null })
  }

  const handleEditar = (c) => {
    setEditandoId(c.id)
    setForm({ name: c.name, description: c.description ?? '' })
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categorías de evento</h1>
          <p>Géneros para clasificar los eventos (Concierto, Teatro, Deportes, etc.)</p>
        </div>
      </div>

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
              placeholder="Concierto, Teatro..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              maxLength={60}
            />
          </div>
          <div className="field">
            <label className="field-label">Descripción (opcional)</label>
            <input
              className="input"
              placeholder="Breve descripción"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              maxLength={255}
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
                  <tr><th>Nombre</th><th>Descripción</th><th></th></tr>
                </thead>
                <tbody>
                  {categorias.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{c.description || '—'}</td>
                      <td className="table-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEditar(c)}>Editar</button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => { if (confirm(`¿Eliminar "${c.name}"?`)) deleteMut.mutate(c.id) }}
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
    </div>
  )
}
