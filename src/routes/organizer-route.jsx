import { Navigate } from 'react-router-dom'

export default function OrganizerRoute({ children, isOrganizer }) {
  return isOrganizer ? children : <Navigate to="/" />
}
