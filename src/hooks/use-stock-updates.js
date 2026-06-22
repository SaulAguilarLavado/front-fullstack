import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws'

export default function useStockUpdates(ticketTypeIds = []) {
  const [stockByTicketType, setStockByTicketType] = useState({})
  const clientRef = useRef(null)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 4000,
      onConnect: () => {
        client.subscribe('/topic/stock-updates', (message) => {
          const payload = JSON.parse(message.body)
          if (ticketTypeIds.includes(payload.ticketTypeId)) {
            setStockByTicketType((prev) => ({
              ...prev,
              [payload.ticketTypeId]: payload.availableStock,
            }))
          }
        })
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [JSON.stringify(ticketTypeIds)])

  return stockByTicketType
}
