import { create } from 'zustand'

const useCarritoStore = create((set, get) => ({
  eventoId: null,   // solo puede haber items de UN evento a la vez
  eventoNombre: '',
  items: [],        // [{ ticketTypeId, nombre, precio, cantidad, maxPorPersona }]

  getTotal: () => get().items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
  getCantidadTotal: () => get().items.reduce((sum, i) => sum + i.cantidad, 0),

  // retorna true si el item se agregó, false si hay conflicto de evento
  agregarItem: (eventoId, eventoNombre, item) => {
    const state = get()

    // conflicto: hay items de otro evento
    if (state.eventoId && state.eventoId !== eventoId) {
      return false
    }

    const existente = state.items.find((i) => i.ticketTypeId === item.ticketTypeId)
    const cantidad = item.cantidad ?? 1
    const maxPorPersona = item.maxPorPersona ?? Number.MAX_SAFE_INTEGER

    if (existente) {
      set((s) => ({
        items: s.items.map((i) =>
          i.ticketTypeId === item.ticketTypeId
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, maxPorPersona) }
            : i
        ),
      }))
    } else {
      set((s) => ({
        eventoId,
        eventoNombre,
        items: [...s.items, { ...item, cantidad: Math.min(cantidad, maxPorPersona), maxPorPersona }],
      }))
    }

    return true
  },

  quitarItem: (ticketTypeId) => {
    const state = get()
    const existente = state.items.find((i) => i.ticketTypeId === ticketTypeId)
    if (!existente) return

    if (existente.cantidad === 1) {
      const nuevos = state.items.filter((i) => i.ticketTypeId !== ticketTypeId)
      set({ items: nuevos, eventoId: nuevos.length === 0 ? null : state.eventoId })
    } else {
      set((s) => ({
        items: s.items.map((i) =>
          i.ticketTypeId === ticketTypeId ? { ...i, cantidad: i.cantidad - 1 } : i
        ),
      }))
    }
  },

  limpiarCarrito: () => set({ eventoId: null, eventoNombre: '', items: [] }),

  // OrderRequest real del backend: { paymentMethod, items: [{ ticketTypeId,
  // quantity }] }. NO se manda totalAmount — el backend lo calcula con el
  // precio real de cada TicketType en el momento del checkout, así nadie
  // puede manipular el total interceptando la petición.
  toOrderRequest: (paymentMethod) => ({
    paymentMethod,
    items: get().items.map((i) => ({
      ticketTypeId: i.ticketTypeId,
      quantity: i.cantidad,
    })),
  }),
}))

export default useCarritoStore
