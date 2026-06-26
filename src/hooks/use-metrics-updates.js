import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws'

// Escucha /topic/metrics-updates y refresca las queries de métricas del
// administrador en cuanto el backend confirma una venta o cancelación
// (incluso si ocurre en otra sesión/navegador). Resuelve el retraso de la
// caché de React Query para los dashboards admin.
export default function useMetricsUpdates() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 2000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.info('[WS metrics] conectado')
        client.subscribe('/topic/metrics-updates', () => {
          console.debug('[WS metrics] cambio de ventas → refrescando métricas')
          queryClient.invalidateQueries({ queryKey: ['reporte-clientes-mes'] })
          queryClient.invalidateQueries({ queryKey: ['reporte-ventas-mes'] })
          queryClient.invalidateQueries({ queryKey: ['reporte-entradas-categoria'] })
          queryClient.invalidateQueries({ queryKey: ['reporte-entradas-evento-categoria'] })
          queryClient.invalidateQueries({ queryKey: ['admin-ventas'] })
          queryClient.invalidateQueries({ queryKey: ['admin-eventos-resumen'] })
          queryClient.invalidateQueries({ queryKey: ['admin-usuarios-resumen'] })
        })
      },
      onStompError: (frame) => console.error('[WS metrics] STOMP error', frame.headers['message']),
      onWebSocketClose: (e) => console.warn('[WS metrics] cerrado', e?.reason),
    })

    client.activate()
    return () => {
      client.deactivate()
    }
  }, [queryClient])
}
