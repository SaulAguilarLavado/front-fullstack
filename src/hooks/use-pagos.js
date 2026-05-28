import { useState } from 'react'

export function usePagos() {
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(false)

  return { pagos, loading }
}
