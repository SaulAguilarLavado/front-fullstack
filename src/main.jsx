import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query'
import { Toaster, toast } from 'sonner'
import App from './App.jsx'
import ErrorBoundary from './components/error-boundary.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 minutos antes de revalidar
      retry: 1,
    },
  },
  // Manejo global de errores de lectura: notifica sin repetir onError en
  // cada pantalla. El 401 ya lo gestiona el interceptor de axios (redirige
  // a /login), así que no se muestra toast para ese caso.
  queryCache: new QueryCache({
    onError: (error) => {
      if (error?.response?.status !== 401) {
        toast.error(error?.message ?? 'Error al cargar datos')
      }
    },
  }),
  // Manejo global de errores de mutaciones (crear/editar/eliminar).
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error?.response?.status !== 401) {
        toast.error(error?.message ?? 'No se pudo completar la acción')
      }
    },
  }),
})

// Red de seguridad para errores que escapan a React/axios.
window.addEventListener('unhandledrejection', (e) => {
  console.error('[global] promesa no manejada:', e.reason)
})
window.addEventListener('error', (e) => {
  console.error('[global] error no capturado:', e.message)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" richColors closeButton />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)
