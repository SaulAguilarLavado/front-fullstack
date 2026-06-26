import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import reportService from '@/services/report.service.js'
import useMetricsUpdates from '@/hooks/use-metrics-updates.js'

const COLORES = ['#0f6e56', '#854f0b', '#5f5e5a', '#a32d2d', '#1d9e75']

// Las métricas deben caer en vivo: polling de respaldo + invalidación por
// WebSocket (useMetricsUpdates) cuando ocurre una venta en otra sesión.
const LIVE_OPTS = { staleTime: 0, refetchInterval: 15000, refetchOnWindowFocus: true }

// Convierte [{month, category, ticketsSold}] a formato ancho para recharts.
function aFormatoAncho(filas) {
  const cats = [...new Set(filas.map((d) => d.category))]
  const porMes = {}
  filas.forEach((d) => {
    if (!porMes[d.month]) porMes[d.month] = { month: d.month }
    porMes[d.month][d.category] = d.ticketsSold
  })
  return { cats, data: Object.values(porMes) }
}

export default function AdminReportes() {
  useMetricsUpdates()

  const { data: clientesPorMes = [], isLoading: loadingClientes } = useQuery({
    queryKey: ['reporte-clientes-mes'],
    queryFn: reportService.getClientesPorMes,
    ...LIVE_OPTS,
  })

  const { data: entradasPorCategoria = [], isLoading: loadingEntradas } = useQuery({
    queryKey: ['reporte-entradas-categoria'],
    queryFn: reportService.getEntradasPorCategoriaPorMes,
    ...LIVE_OPTS,
  })

  const { data: entradasPorEvento = [], isLoading: loadingEvento } = useQuery({
    queryKey: ['reporte-entradas-evento-categoria'],
    queryFn: reportService.getEntradasPorCategoriaEventoPorMes,
    ...LIVE_OPTS,
  })

  const { cats: categorias, data: dataEntradas } = aFormatoAncho(entradasPorCategoria)
  const { cats: categoriasEvento, data: dataEvento } = aFormatoAncho(entradasPorEvento)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reportes</h1>
          <p>Métricas por proceso de negocio</p>
        </div>
      </div>

      {/* Clientes registrados por mes */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Clientes registrados por mes</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
          Cantidad de clientes registrados, agrupados por mes
        </p>
        {loadingClientes ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando…</p>
        ) : clientesPorMes.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Sin registros de clientes todavía.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clientesPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--color-border)' }} />
              <Line
                type="monotone"
                dataKey="totalClients"
                name="Clientes"
                stroke="#0f6e56"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Entradas vendidas por tipo de entrada (VIP/General) por mes */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Entradas vendidas por tipo de entrada</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
          Cantidad de entradas vendidas por mes, agrupadas por tipo de entrada (VIP, General, etc.)
        </p>
        {loadingEntradas ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando…</p>
        ) : dataEntradas.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Sin datos todavía.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataEntradas}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--color-border)' }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              {categorias.map((cat, i) => (
                <Bar key={cat} dataKey={cat} fill={COLORES[i % COLORES.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Entradas vendidas por categoría de evento (Concierto/Teatro) por mes */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Entradas vendidas por categoría de evento</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
          Cantidad de entradas vendidas por mes, agrupadas por categoría del evento (Concierto, Teatro, etc.)
        </p>
        {loadingEvento ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando…</p>
        ) : dataEvento.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Sin datos todavía.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataEvento}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--color-border)' }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              {categoriasEvento.map((cat, i) => (
                <Bar key={cat} dataKey={cat} fill={COLORES[i % COLORES.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
