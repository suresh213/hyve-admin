import router from '@/router'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AuthenticationRoute = ({ children }: any) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const pathname = window.location.pathname

  // Only redirect to login if user is not authenticated and trying to access root
  // Don't redirect for auth-related paths
  if (!isAuthenticated && pathname === '/') {
    return <Navigate to={router.paths.login.path} replace />
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (
    isAuthenticated &&
    (pathname === '/auth' || pathname === '/auth/signup')
  ) {
    return <Navigate to={router.paths.dashboard.path} replace />
  }

  // For all other cases, render the children
  return <>{children}</>
}

export default AuthenticationRoute
