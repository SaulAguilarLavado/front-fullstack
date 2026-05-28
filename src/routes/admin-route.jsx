import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children, isAdmin }) {
  return isAdmin ? children : <Navigate to="/" />
}
