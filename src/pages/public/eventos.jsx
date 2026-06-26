import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import eventosService from '@/services/eventos.service.js'
import categoryService from '@/services/category.service.js'
import useEventoStore from '@/store/evento.store.js'
import { RUTAS, toRuta } from '@/constants/rutas.js'
import { formatFecha, formatHora } from '@/utils/format-date.js'
import { formatPrecio } from '@/utils/format-price.js'
import './eventos.css'
import '../public/home.css'

export default function Eventos() {
  const { filtros, pagina, size, setFiltro, resetFiltros, setPagina } = useEventoStore()

  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoryService.getAll,
  })

  const params = {
    page: pagina,
    size,
    sort: 'dateTime,asc',
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
          <input
            className="input"
            placeholder="Lima, Arequipa..."
            value={filtros.ciudad}
            onChange={(e) => setFiltro('ciudad', e.target.value)}
          />
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
            <Link
              key={e.id}
              to={toRuta(RUTAS.EVENTO_DETALLE, { id: e.id })}
              className="card card-hoverable evento-card"
            >
              {e.imageUrl ? (
                <img src={e.imageUrl} alt={e.title} className="evento-card-img" loading="lazy" />
              ) : (
                <div className="evento-card-img-placeholder">🎭</div>
              )}
              <div className="evento-card-body">
                <span className="evento-card-fecha">
                  {formatFecha(e.dateTime)} · {formatHora(e.dateTime)}
                </span>
                <h3 className="evento-card-title">{e.title}</h3>
                <span className="evento-card-venue">
                  {e.venue?.name}{e.venue?.city ? `, ${e.venue.city}` : ''}
                </span>
                {e.minPrice != null && (
                  <span className="evento-card-price">Desde {formatPrecio(e.minPrice)}</span>
                )}
              </div>
            </Link>
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
