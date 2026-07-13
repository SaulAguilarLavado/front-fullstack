import { create } from 'zustand'

const useEventoStore = create((set) => ({
  filtros: {
    busqueda: '',
    categoria: '',
    ciudad: '',
    fechaDesde: '',
    precioMax: '',
  },
  pagina: 0,
  size: 12,

  setFiltro: (campo, valor) =>
    set((s) => ({ filtros: { ...s.filtros, [campo]: valor }, pagina: 0 })),

  resetFiltros: () =>
    set({
      filtros: { busqueda: '', categoria: '', ciudad: '', fechaDesde: '', precioMax: '' },
      pagina: 0,
    }),

  setPagina: (pagina) => set({ pagina }),
}))

export default useEventoStore
