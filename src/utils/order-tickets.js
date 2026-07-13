export const flattenOrderTickets = (orders) =>
  orders.flatMap((orden) =>
    (orden.generatedTickets ?? []).map((ticket) => ({ ...ticket, orden }))
  )
