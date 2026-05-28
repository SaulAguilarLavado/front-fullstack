import { useState } from 'react'

export function useEntradas() {
  const [entradas, setEntradas] = useState([])
  const [loading, setLoading] = useState(false)

  return { entradas, loading }
}
