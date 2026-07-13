import { useQuery } from '@tanstack/react-query'
import EventoCard from '@/components/eventos/evento-card.jsx'
import eventosService from '@/services/eventos.service.js'
import useEventoStore from '@/store/evento.store.js'
import './eventos.css'
import '../public/home.css'

export default function Eventos() {
  const { filtros, pagina, size, setFiltro, resetFiltros, setPagina } = useEventoStore()

  const { data: opcionesData } = useQuery({
    queryKey: ['eventos-filter-options'],
    queryFn: () => eventosService.getEventos({ page: 0, size: 1000, sort: 'dateTime,asc', upcomingOnly: true }),
  })

  const params = {
    page: pagina,
    size,
    sort: 'dateTime,asc',
    upcomingOnly: true,
    ...(filtros.busqueda && { title: filtros.busqueda }),
    ...(filtros.ciudad && { city: filtros.ciudad }),
    ...(filtros.categoria && { categoryId: filtros.categoria }),
    ...(filtros.precioMax && { maxPrice: filtros.precioMax }),
  }

  const { data, isLoading } = useQuery({
    queryKey: ['eventos', params],
    queryFn: () => eventosService.getEventos(params),
    keepPreviousData: true,
  })

  const eventos = data?.content ?? []
  const totalPaginas = data?.totalPages ?? 0
  const totalElementos = data?.totalElements ?? 0
  const eventosOpciones = opcionesData?.content ?? []
  const ciudadesDisponibles = [...new Set(
    eventosOpciones.map((e) => e.venue?.city).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'es'))
  const categorias = [...new Map(
    eventosOpciones
      .filter((e) => e.categoryId && e.categoryName)
      .map((e) => [String(e.categoryId), { id: e.categoryId, name: e.categoryName }])
  ).values()].sort((a, b) => a.name.localeCompare(b.name, 'es'))

  return (
    <div className="container eventos-page">
      <div className="page-header">
        <div>
          <h1>Eventos</h1>
          <p>Encuentra el próximo espectáculo que no te puedes perder</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="eventos-toolbar">
        <div className="field">
          <label className="field-label">Buscar</label>
          <input
            className="input"
            placeholder="Nombre del evento..."
            value={filtros.busqueda}
            onChange={(e) => setFiltro('busqueda', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">Ciudad</label>
          <select
            className="select"
            value={filtros.ciudad}
            onChange={(e) => setFiltro('ciudad', e.target.value)}
          >
            <option value="">Todas</option>
            {ciudadesDisponibles.map((ciudad) => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
        </div>
        <div className="field" style={{ maxWidth: 180 }}>
          <label className="field-label">Categoría</label>
          <select
            className="select"
            value={filtros.categoria}
            onChange={(e) => setFiltro('categoria', e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="field" style={{ maxWidth: 160 }}>
          <label className="field-label">Precio máx. (S/)</label>
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Sin límite"
            value={filtros.precioMax}
            onChange={(e) => setFiltro('precioMax', e.target.value)}
          />
        </div>
        <button className="btn btn-ghost btn-sm" onClick={resetFiltros}>
          Limpiar
        </button>
      </div>

      {/* Conteo */}
      {!isLoading && (
        <p className="eventos-count">
          {totalElementos} evento{totalElementos !== 1 ? 's' : ''} encontrado{totalElementos !== 1 ? 's' : ''}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="eventos-grid-wrap">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card" style={{ height: 280, background: 'var(--color-bg-secondary)' }} />
          ))}
        </div>
      ) : eventos.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🔍</span>
          <h3>Sin resultados</h3>
          <p>Prueba ajustando los filtros de búsqueda.</p>
          <button className="btn btn-secondary" onClick={resetFiltros}>Quitar filtros</button>
        </div>
      ) : (
        <div className="eventos-grid-wrap">
          {eventos.map((e) => (
            <EventoCard key={e.id} evento={e} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={pagina === 0}
            onClick={() => setPagina(pagina - 1)}
          >
            ← Anterior
          </button>
          <span className="pagination-info">
            Página {pagina + 1} de {totalPaginas}
          </span>
          <button
            className="pagination-btn"
            disabled={pagina >= totalPaginas - 1}
            onClick={() => setPagina(pagina + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
