import http from './http.js'

const reportService = {
  getClientesPorMes: () =>
    http.get('/reports/clients-by-month').then((r) => r.data.data),

  getVentasPorMes: () =>
    http.get('/reports/sales-by-month').then((r) => r.data.data),

  getEntradasPorCategoriaPorMes: () =>
    http.get('/reports/tickets-by-category-by-month').then((r) => r.data.data),
}

export default reportService
