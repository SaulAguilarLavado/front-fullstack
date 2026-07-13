import { Link } from 'react-router-dom'
import { RUTAS, toRuta } from '@/constants/rutas.js'
import { formatFecha, formatHora } from '@/utils/format-date.js'
import { formatPrecio } from '@/utils/format-price.js'

export default function EventoCard({ evento }) {
  return (
    <Link
      to={toRuta(RUTAS.EVENTO_DETALLE, { id: evento.id })}
      className="card card-hoverable evento-card"
    >
      {evento.imageUrl ? (
        <img
          src={evento.imageUrl}
          alt={evento.title}
          className="evento-card-img"
          loading="lazy"
        />
      ) : (
        <div className="evento-card-img-placeholder">🎭</div>
      )}
      <div className="evento-card-body">
        <span className="evento-card-fecha">
          {formatFecha(evento.dateTime)} · {formatHora(evento.dateTime)}
        </span>
        <h3 className="evento-card-title">{evento.title}</h3>
        <span className="evento-card-venue">
          {evento.venue?.name}{evento.venue?.city ? `, ${evento.venue.city}` : ''}
        </span>
        {evento.minPrice != null && (
          <span className="evento-card-price">
            Desde {formatPrecio(evento.minPrice)}
          </span>
        )}
      </div>
    </Link>
  )
}
