import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'

export default function QrCodeTools({
  value,
  filename = 'ticket-qr',
  label = 'Código QR de entrada',
  size = 130,
}) {
  const [ampliado, setAmpliado] = useState(false)
  const canvasId = useId().replaceAll(':', '')

  useEffect(() => {
    if (!ampliado) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setAmpliado(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [ampliado])

  const descargarQr = () => {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${filename}.png`
    link.click()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAmpliado(true)}
        aria-label="Ampliar código QR"
        style={{
          display: 'block',
          border: 0,
          background: 'transparent',
          margin: '0 auto 12px',
          padding: 0,
          cursor: 'zoom-in',
        }}
      >
        <QRCodeSVG value={value} size={size} title={label} />
      </button>

      <QRCodeCanvas
        id={canvasId}
        value={value}
        size={720}
        level="M"
        includeMargin
        style={{ position: 'absolute', left: -9999, top: -9999 }}
      />

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAmpliado(true)}>
          Ampliar QR
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={descargarQr}>
          Descargar
        </button>
      </div>

      {ampliado && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={() => setAmpliado(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'grid',
            placeItems: 'center',
            padding: 24,
            background: 'rgba(15, 23, 42, 0.72)',
          }}
        >
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(92vw, 420px)', padding: 28, textAlign: 'center' }}
          >
            <QRCodeSVG value={value} size={300} title={label} style={{ margin: '0 auto 18px' }} />
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', wordBreak: 'break-all', marginBottom: 16 }}>
              {value}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={descargarQr}>
                Descargar PNG
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAmpliado(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
