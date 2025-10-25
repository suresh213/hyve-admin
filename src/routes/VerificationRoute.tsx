import AppShell from '@/components/app-shell'
import router from '@/router'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const VerificationRoute = ({ children }: any) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  )

  if (!isAuthenticated) {
    return <Navigate to={router.paths.login.path} replace />
  }

  if (user?.isEmailVerified) {
    return <Navigate to={router.paths.dashboard.path} replace />
  }

  return <AppShell>{children}</AppShell>
}

export default VerificationRoute
