import { useParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { RUTAS } from '@/constants/rutas.js'

export default function EntradaDetalle() {
  const { id } = useParams()

  return (
    <div>
      <div className="page-header">
        <h1>Detalle de entrada</h1>
      </div>
      <div className="card" style={{ maxWidth: 340, padding: 32, textAlign: 'center' }}>
        <QRCodeSVG value={id} size={200} style={{ margin: '0 auto 20px' }} />
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          {id?.slice(0, 8).toUpperCase()}
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
          Muestra este código QR en la entrada del evento.
        </p>
        <Link to={RUTAS.MIS_ENTRADAS} className="btn btn-ghost btn-sm" style={{ marginTop: 20 }}>
          ← Mis entradas
        </Link>
      </div>
    </div>
  )
}
