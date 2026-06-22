import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import reportService from '@/services/report.service.js'
import { formatPrecio } from '@/utils/format-price.js'

const COLORES = ['#0f6e56', '#854f0b', '#5f5e5a', '#a32d2d', '#1d9e75']

export default function AdminReportes() {
  const { data: ventasPorMes = [], isLoading: loadingVentas } = useQuery({
    queryKey: ['reporte-ventas-mes'],
    queryFn: reportService.getVentasPorMes,
  })

  const { data: entradasPorCategoria = [], isLoading: loadingEntradas } = useQuery({
    queryKey: ['reporte-entradas-categoria'],
    queryFn: reportService.getEntradasPorCategoriaPorMes,
  })

  // Transformar [{month, category, ticketsSold}] a formato ancho para
  // recharts: [{ month: '2026-06', VIP: 12, General: 40 }, ...]
  const categorias = [...new Set(entradasPorCategoria.map((d) => d.category))]
  const dataPorMes = {}
  entradasPorCategoria.forEach((d) => {
    if (!dataPorMes[d.month]) dataPorMes[d.month] = { month: d.month }
    dataPorMes[d.month][d.category] = d.ticketsSold
  })
  const dataEntradas = Object.values(dataPorMes)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reportes</h1>
          <p>Métricas de ventas a lo largo del tiempo</p>
        </div>
      </div>

      {/* Ventas por mes */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Ventas por mes</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
          Monto total recaudado, agrupado por mes
        </p>
        {loadingVentas ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando…</p>
        ) : ventasPorMes.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Sin datos de ventas todavía.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip
                formatter={(value) => formatPrecio(value)}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--color-border)' }}
              />
              <Line
                type="monotone"
                dataKey="totalSales"
                name="Ventas"
                stroke="#0f6e56"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Entradas vendidas por categoría por mes */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Entradas vendidas por categoría</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
          Cantidad de entradas vendidas por mes, agrupadas por categoría de precio
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
    </div>
  )
}
