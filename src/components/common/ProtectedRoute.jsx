import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../context/AuthContext'
import Loading from './Loading'

export default function ProtectedRoute() {
  const { user, loading } = useAuthStore()

  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
