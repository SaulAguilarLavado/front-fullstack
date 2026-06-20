import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import eventosService from '@/services/eventos.service.js'
import venueService from '@/services/venue.service.js'
import useAuthStore from '@/store/auth.store.js'
import { RUTAS } from '@/constants/rutas.js'

export default function EventoForm() {
  const { id } = useParams()
  const esEdicion = !!id
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    imageUrl: '',
    venueId: '',
  })

  const { data: venues = [] } = useQuery({
    queryKey: ['venues-select'],
    queryFn: () => venueService.getVenues({ size: 100 }).then((r) => r.content ?? r),
  })

  const { data: eventoActual } = useQuery({
    queryKey: ['evento', id],
    queryFn: () => eventosService.getEventoById(id),
    enabled: esEdicion,
  })

  useEffect(() => {
    if (eventoActual) {
      setForm({
        title: eventoActual.title ?? '',
        description: eventoActual.description ?? '',
        dateTime: eventoActual.dateTime?.slice(0, 16) ?? '',
        imageUrl: eventoActual.imageUrl ?? '',
        venueId: eventoActual.venue?.id ?? '',
      })
    }
  }, [eventoActual])

  const saveMut = useMutation({
    mutationFn: (data) =>
      esEdicion ? eventosService.editarEvento(id, data) : eventosService.crearEvento(data),
    onSuccess: () => {
      toast.success(esEdicion ? 'Evento actualizado' : 'Evento creado')
      navigate(RUTAS.ORG_MIS_EVENTOS)
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
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            maxLength={200}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="description">Descripción</label>
          <textarea
            id="description"
            className="textarea"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="dateTime">Fecha y hora</label>
          <input
            id="dateTime"
            type="datetime-local"
            className="input"
            value={form.dateTime}
            onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="venueId">Lugar (venue)</label>
          <select
            id="venueId"
            className="select"
            value={form.venueId}
            onChange={(e) => setForm({ ...form, venueId: e.target.value })}
            required
          >
            <option value="">Selecciona un venue</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>{v.name} — {v.city}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="imageUrl">URL de imagen (opcional)</label>
          <input
            id="imageUrl"
            className="input"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
