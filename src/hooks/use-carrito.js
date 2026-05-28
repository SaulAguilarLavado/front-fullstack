import { useState, useCallback } from 'react'

export function useCarrito() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)

  return { items, total }
}
