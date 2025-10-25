import router from '@/router'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const OnboardingRoute = ({ children }: any) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  )

  if (!isAuthenticated) {
    return <Navigate to={router.paths.login.path} replace />
  }

  if (user?.isOnboardingCompleted) {
    return <Navigate to={router.paths.dashboard.path} replace />
  }

  return <div>{children}</div>
}

export default OnboardingRoute
