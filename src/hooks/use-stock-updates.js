import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws'

// Se conecta una sola vez al montar y escucha /topic/stock-updates,
// el mismo topic que AvailabilityPublisher/OrderServiceImpl usa en el
// backend para avisar cuando soldQty cambia (compra o cancelación).
//
// El backend publica StockUpdateMessage { ticketTypeId, availableStock }
// sin filtrar por evento — el filtro de "solo me interesan los
// ticketTypes de este evento" se hace aquí en el front.
export default function useStockUpdates(ticketTypeIds = []) {
  const [stockByTicketType, setStockByTicketType] = useState({})
  const clientRef = useRef(null)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 2000,        // reconexión rápida si se cae
      heartbeatIncoming: 10000,    // alineado con el broker del backend
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.info('[WS] conectado a', WS_URL)
        client.subscribe('/topic/stock-updates', (message) => {
          const payload = JSON.parse(message.body)
          console.debug('[WS] stock-update', payload)
          // Solo actualiza si el ticketType que cambió es uno de los
          // que esta pantalla está mostrando — evita renders innecesarios
          // cuando alguien compra entradas de OTRO evento.
          if (ticketTypeIds.includes(payload.ticketTypeId)) {
            setStockByTicketType((prev) => ({
              ...prev,
              [payload.ticketTypeId]: payload.availableStock,
            }))
          }
        })
      },
      onStompError: (frame) => console.error('[WS] STOMP error', frame.headers['message']),
      onWebSocketClose: (e) => console.warn('[WS] cerrado', e?.reason),
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ticketTypeIds)])

  return stockByTicketType
}
