import { useState, useEffect } from 'react'

export function useEventos() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  return { eventos, loading, error }
}
