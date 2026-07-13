import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import EventoCard from '@/components/eventos/evento-card.jsx'
import eventosService from '@/services/eventos.service.js'
import { RUTAS } from '@/constants/rutas.js'
import './home.css'

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['eventos-home'],
    queryFn: () => eventosService.getEventos({ size: 8, sort: 'dateTime,asc', upcomingOnly: true }),
  })

  const eventos = data?.content ?? []

  return (
    <>
      {/* Hero */}
      <section className="home-hero">
        <div className="container">
          <h1>Entradas para los mejores eventos del país</h1>
          <p>Conciertos, teatro, stand-up y más. Compra rápido, seguro y sin filas.</p>
          <div className="home-hero-actions">
            <Link to={RUTAS.EVENTOS} className="btn btn-primary btn-lg">
              Ver todos los eventos
            </Link>
            <Link to={RUTAS.REGISTER} className="btn btn-secondary btn-lg">
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Grid de eventos */}
      <div className="container">
        <section className="home-section">
          <div className="home-section-header">
            <h2>Próximos eventos</h2>
            <Link to={RUTAS.EVENTOS} className="btn btn-ghost btn-sm">
              Ver todos →
            </Link>
          </div>

          {isLoading ? (
            <div className="eventos-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="card"
                  style={{ height: 280, background: 'var(--color-bg-secondary)' }}
                />
              ))}
            </div>
          ) : eventos.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: 40 }}>🎭</span>
              <h3>No hay eventos disponibles</h3>
              <p>Vuelve pronto, se vienen novedades.</p>
            </div>
          ) : (
            <div className="eventos-grid">
              {eventos.map((e) => (
                <EventoCard key={e.id} evento={e} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
