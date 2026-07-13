import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import eventosService from '@/services/eventos.service.js'
import venueService from '@/services/venue.service.js'
import categoryService from '@/services/category.service.js'
import useAuthStore from '@/store/auth.store.js'
import { RUTAS } from '@/constants/rutas.js'

const EMPTY_EVENT_FORM = {
  title: '',
  description: '',
  dateTime: '',
  imageUrl: '',
  venueId: '',
  categoryId: '',
}

export default function EventoForm() {
  const { id } = useParams()
  const esEdicion = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const [formDraft, setFormDraft] = useState({})

  const { data: venues = [] } = useQuery({
    queryKey: ['venues-select'],
    queryFn: () => venueService.getVenues({ size: 100 }).then((r) => r.content ?? r),
  })

  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoryService.getAll,
  })

  const { data: eventoActual } = useQuery({
    queryKey: ['evento', id],
    queryFn: () => eventosService.getEventoById(id),
    enabled: esEdicion,
  })

  const initialForm = useMemo(() => {
    if (!eventoActual) return EMPTY_EVENT_FORM

    return {
      title: eventoActual.title ?? '',
      description: eventoActual.description ?? '',
      dateTime: eventoActual.dateTime?.slice(0, 16) ?? '',
      imageUrl: eventoActual.imageUrl ?? '',
      venueId: eventoActual.venue?.id ?? '',
      categoryId: eventoActual.categoryId ?? '',
    }
  }, [eventoActual])

  const form = { ...initialForm, ...formDraft }
  const updateForm = (field, value) => setFormDraft((current) => ({ ...current, [field]: value }))

  const saveMut = useMutation({
    mutationFn: (data) =>
      esEdicion ? eventosService.editarEvento(id, data) : eventosService.crearEvento(data),
    onSuccess: () => {
      toast.success(esEdicion ? 'Evento actualizado' : 'Evento creado')
      qc.invalidateQueries({ queryKey: ['eventos'] })
      qc.invalidateQueries({ queryKey: ['eventos-home'] })
      qc.invalidateQueries({ queryKey: ['admin-eventos'] })
      qc.invalidateQueries({ queryKey: ['org-mis-eventos'] })
      qc.invalidateQueries({ queryKey: ['org-eventos'] })
      qc.invalidateQueries({ queryKey: ['admin-eventos-resumen'] })
      if (id) qc.invalidateQueries({ queryKey: ['evento', id] })
      navigate(user?.roleName === 'ADMIN' ? RUTAS.ADMIN_EVENTOS : RUTAS.ORG_MIS_EVENTOS)
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo guardar el evento'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMut.mutate({
      title: form.title,
      description: form.description,
      dateTime: form.dateTime, // datetime-local ya viene en formato ISO sin zona
      imageUrl: form.imageUrl || null,
      venueId: Number(form.venueId),
      categoryId: Number(form.categoryId),
    })
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{esEdicion ? 'Editar evento' : 'Nuevo evento'}</h1>
          <p>Completa la información del evento</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 560, padding: 28 }}>
        <div className="field">
          <label className="field-label" htmlFor="title">Nombre del evento</label>
          <input
            id="title"
            className="input"
            value={form.title}
            onChange={(e) => updateForm('title', e.target.value)}
            required
            maxLength={150}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="description">Descripción</label>
          <textarea
            id="description"
            className="textarea"
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="dateTime">Fecha y hora</label>
          <input
            id="dateTime"
            type="datetime-local"
            className="input"
            value={form.dateTime}
            onChange={(e) => updateForm('dateTime', e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="venueId">Lugar (venue)</label>
          <select
            id="venueId"
            className="select"
            value={form.venueId}
            onChange={(e) => updateForm('venueId', e.target.value)}
            required
          >
            <option value="">Selecciona un venue</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>{v.name} — {v.city}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="categoryId">Categoría</label>
          <select
            id="categoryId"
            className="select"
            value={form.categoryId}
            onChange={(e) => updateForm('categoryId', e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="imageUrl">URL de imagen (opcional)</label>
          <input
            id="imageUrl"
            className="input"
            value={form.imageUrl}
            onChange={(e) => updateForm('imageUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={saveMut.isPending}>
            {saveMut.isPending ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear evento'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
