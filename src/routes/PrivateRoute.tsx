import AppShell from '@/components/app-shell'
import router from '@/router'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }: any) => {
  const pathname = window.location.pathname

  const { isAuthenticated, user, isAdmin } = useSelector(
    (state: RootState) => state.auth
  )

  if (!isAuthenticated) {
    return <Navigate to={router.paths.login.path} replace />
  }

  // if (!user?.isOnboardingCompleted) {
  //   return <Navigate to={router.paths.onboarding.path} replace />
  // }

  if (isAuthenticated && pathname === '/') {
    // Check if user is CLIENT or ROLE_CENTER_ADMIN
    const userTypeStr = String((user as any)?.userType).toUpperCase()
    const userRole = String((user as any)?.role).toUpperCase()
    const isClient = userTypeStr === 'CLIENT'
    const isCenterAdmin = userRole === 'ROLE_CENTER_ADMIN'
    const userCenterCode = (user as any)?.centerCode

    // Redirect CLIENT or ROLE_CENTER_ADMIN users to dashboard
    if ((isClient || isCenterAdmin) && userCenterCode) {
      return <Navigate to={router.paths.dashboard.path} replace />
    }

    return <Navigate to={router.paths.dashboard.path} replace />
  }

  // Handle CLIENT/ROLE_CENTER_ADMIN user routing
  if (isAuthenticated && user && !isAdmin) {
    const userTypeStr = String((user as any)?.userType).toUpperCase()
    const userRole = String((user as any)?.role).toUpperCase()
    const isClient = userTypeStr === 'CLIENT'
    const isCenterAdmin = userRole === 'ROLE_CENTER_ADMIN'
    const userCenterCode = (user as any)?.centerCode

    // Redirect CLIENT or ROLE_CENTER_ADMIN users to dashboard
    if ((isClient || isCenterAdmin) && userCenterCode) {
      if (pathname === router.paths.dashboard.path) {
        return <Navigate to={router.paths.dashboard.path} replace />
      }
    }

    // Enforce CLIENT user access to only Dashboard
    if (isClient) {
      const allowed = [router.paths.dashboard.path]
      const isAllowed =
        pathname === '/' ||
        allowed.some((p) => pathname === p || pathname.startsWith(`${p}/`))
      if (!isAllowed) {
        return <Navigate to={router.paths.dashboard.path} replace />
      }
    }
  }

  return <AppShell>{children}</AppShell>
}

export default PrivateRoute
