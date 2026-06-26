import http from './http.js'

// ReportController real: solo ADMIN (@PreAuthorize a nivel de clase).
// GET /api/reports/clients-by-month → [{ month: "2026-06", totalClients: 12 }]
// GET /api/reports/tickets-by-category-by-month → [{ month, category, ticketsSold }]
const reportService = {
  getClientesPorMes: () =>
    http.get('/reports/clients-by-month').then((r) => r.data.data),

  getVentasPorMes: () =>
    http.get('/reports/sales-by-month').then((r) => r.data.data),

  // Agrupado por tipo de ticket (VIP/General).
  getEntradasPorCategoriaPorMes: () =>
    http.get('/reports/tickets-by-category-by-month').then((r) => r.data.data),

  // Agrupado por la CATEGORÍA del evento (Concierto, Teatro, etc.).
  getEntradasPorCategoriaEventoPorMes: () =>
    http.get('/reports/tickets-by-event-category-by-month').then((r) => r.data.data),
}

export default reportService
