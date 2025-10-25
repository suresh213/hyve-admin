/* eslint-disable react-refresh/only-export-components */
import {
  Building2,
  UserCheck,
  FolderOpen,
  TrendingUp,
  Users,
  LayoutDashboard,
} from 'lucide-react'
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Loader from './components/suspense-loader.tsx'
import NotFoundError from './pages/errors/not-found-error.tsx'

import AdminRoute from './routes/AdminRoute.tsx'
import AuthenticationRoute from './routes/AuthenticationRoute.tsx'
import OnboardingRoute from './routes/OnboardingRoute.tsx'
import PrivateRoute from './routes/PrivateRoute.tsx'

// Lazy load the components
const Login = lazy(() => import('./pages/auth/index.tsx'))
const DashboardPage = lazy(() => import('./pages/dashboard/index.tsx'))

// HYVE Admin Pages
const FreelancersPage = lazy(() => import('./pages/freelancers/index.tsx'))
const CompaniesPage = lazy(() => import('./pages/companies/index.tsx'))
const TeamsPage = lazy(() => import('./pages/teams/index.tsx'))
const ProjectsPage = lazy(() => import('./pages/projects/index.tsx'))
const AnalyticsPage = lazy(() => import('./pages/analytics/index.tsx'))

// HYVE Detail Pages
const FreelancerDetailsPage = lazy(() => import('./pages/freelancers/[id]'))
const CompanyDetailsPage = lazy(() => import('./pages/companies/[id]'))
const TeamDetailsPage = lazy(() => import('./pages/teams/[id]'))
const ProjectDetailsPage = lazy(() => import('./pages/projects/[id]'))

// Helper function to create a route with authentication
const createRoute = (
  path: string,
  Component: React.ReactNode,
  isPrivate = false,
  isAuth = false,
  isOnboarding = false,
  isAdmin = false
) => {
  const element = (
    <Suspense fallback={<Loader />}>
      {isAuth && <AuthenticationRoute>{Component}</AuthenticationRoute>}
      {isOnboarding && <OnboardingRoute>{Component}</OnboardingRoute>}
      {isAdmin && (
        <AdminRoute>
          <PrivateRoute>{Component}</PrivateRoute>
        </AdminRoute>
      )}
      {isPrivate && !isAdmin && <PrivateRoute>{Component}</PrivateRoute>}
      {!isPrivate && !isAuth && !isOnboarding && !isAdmin && Component}
    </Suspense>
  )

  return { path, element }
}

type Path = {
  path: string
  component: React.ReactNode
  isPrivate: boolean
  isAuth: boolean
  isOnboarding: boolean
  isAdmin: boolean
}

const paths = {
  login: {
    path: '/auth',
    component: <Login />,
    isPrivate: false,
    isAuth: true,
    isOnboarding: false,
    isAdmin: false,
  },
  signup: {
    path: '/auth/signup',
    component: <Login />,
    isPrivate: false,
    isAuth: true,
    isOnboarding: false,
    isAdmin: false,
  },
  dashboard: {
    path: '/dashboard',
    component: <DashboardPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  // HYVE Admin Routes
  freelancers: {
    path: '/freelancers',
    component: <FreelancersPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  freelancerDetails: {
    path: '/freelancers/:id',
    component: <FreelancerDetailsPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  companies: {
    path: '/companies',
    component: <CompaniesPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  companyDetails: {
    path: '/companies/:id',
    component: <CompanyDetailsPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  teams: {
    path: '/teams',
    component: <TeamsPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  teamDetails: {
    path: '/teams/:id',
    component: <TeamDetailsPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  projects: {
    path: '/projects',
    component: <ProjectsPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  projectDetails: {
    path: '/projects/:id',
    component: <ProjectDetailsPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  analytics: {
    path: '/analytics',
    component: <AnalyticsPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  404: {
    path: '/404',
    component: <NotFoundError />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: false,
  },
  root: {
    path: '/',
    component: <DashboardPage />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: true,
  },
  '*': {
    path: '*',
    component: <NotFoundError />,
    isPrivate: false,
    isAuth: false,
    isOnboarding: false,
    isAdmin: false,
  },
}

const router = createBrowserRouter(
  Object.values(paths).map((path: Path) =>
    createRoute(
      path.path,
      path.component,
      path.isPrivate,
      path.isAuth,
      path.isOnboarding,
      path.isAdmin
    )
  )
)

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
  className?: string
  isComingSoon?: boolean
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sideBarSections: SideLink[] = [
  {
    title: 'Dashboard',
    label: 'Dashboard',
    href: paths.dashboard.path,
    icon: <LayoutDashboard className='h-5 w-5' />,
    isComingSoon: false,
  },
  {
    title: 'Freelancers',
    label: 'Freelancers',
    href: paths.freelancers.path,
    icon: <UserCheck className='h-5 w-5' />,
    isComingSoon: false,
  },
  {
    title: 'Companies',
    label: 'Companies',
    href: paths.companies.path,
    icon: <Building2 className='h-5 w-5' />,
    isComingSoon: false,
  },
  {
    title: 'Teams',
    label: 'Teams',
    href: paths.teams.path,
    icon: <Users className='h-5 w-5' />,
    isComingSoon: false,
  },
  {
    title: 'Projects',
    label: 'Projects',
    href: paths.projects.path,
    icon: <FolderOpen className='h-5 w-5' />,
    isComingSoon: false,
  },
  {
    title: 'Analytics',
    label: 'Analytics',
    href: paths.analytics.path,
    icon: <TrendingUp className='h-5 w-5' />,
    isComingSoon: false,
  },
]

// Function to get filtered sidebar sections based on user role
export const getFilteredSidebarSections = (userType?: string): SideLink[] => {
  // For Center Administrators, show relevant HYVE sections
  if (userType === 'CLIENT_CENTER') {
    return [
      {
        title: 'Dashboard',
        label: 'Dashboard',
        href: paths.dashboard.path,
        icon: <LayoutDashboard className='h-5 w-5' />,
        isComingSoon: false,
      },
      {
        title: 'Companies',
        label: 'Companies',
        href: paths.companies.path,
        icon: <Building2 className='h-5 w-5' />,
        isComingSoon: false,
      },
      {
        title: 'Freelancers',
        label: 'Freelancers',
        href: paths.freelancers.path,
        icon: <UserCheck className='h-5 w-5' />,
        isComingSoon: false,
      },
      {
        title: 'Projects',
        label: 'Projects',
        href: paths.projects.path,
        icon: <FolderOpen className='h-5 w-5' />,
        isComingSoon: false,
      },
    ]
  }

  // For other users, show all HYVE sections
  return sideBarSections
}

export default {
  router,
  paths,
  sideBarSections,
}
