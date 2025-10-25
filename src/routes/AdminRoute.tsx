import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '@/store'

interface AdminRouteProps {
  children: ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user, isAdmin } = useSelector(
    (state: RootState) => state.auth
  )

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to='/auth' replace />
  }

  // Redirect to dashboard if not admin
  if (!user || !user.userType || (user.userType !== 'admin' && !isAdmin)) {
    return <Navigate to='/dashboard' replace />
  }

  return <>{children}</>
}

export default AdminRoute
