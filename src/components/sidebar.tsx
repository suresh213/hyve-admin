import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sideBarSections, getFilteredSidebarSections } from '@/router'
import { RootState } from '@/store'
import { logout } from '@/store/slices/authSlice'
import { LogOut } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './logo'
import { UserType } from '@/types'

interface SidebarProps {
  isCollapsed?: boolean
}

const Sidebar = ({ isCollapsed = false }: SidebarProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Get user data from Redux store
  const { user, isAdmin, isCenterAdmin } = useSelector(
    (state: RootState) => state.auth
  )

  // Filter sidebar sections based on user type and roles
  const filteredSections = (() => {
    if (!user) return []

    // For Center Administrators, show only limited sections
    if (isCenterAdmin) {
      return getFilteredSidebarSections(user.userType)
    }

    if (isAdmin) {
      return sideBarSections
    }

    const userTypeStr = String((user as any)?.userType).toUpperCase()
    const userRoles = (user as any)?.roles || []

    // Hide Background Jobs for userType=CLIENT or role=ROLE_CENTER_ADMIN
    const hideBackgroundJobs =
      userTypeStr === 'CLIENT' ||
      userRoles.some((role: any) => role.shortName === 'ROLE_CENTER_ADMIN')

    // Show everything for userType=SYS or roles ROLE_SYS_ADMIN, ROLE_SUSER
    const showAllSections =
      userTypeStr === 'SYS' ||
      userRoles.some(
        (role: any) =>
          role.shortName === 'ROLE_SYS_ADMIN' || role.shortName === 'ROLE_SUSER'
      )

    if (showAllSections) {
      return sideBarSections
    }

    // Default filtering - hide Background Jobs for restricted users
    if (hideBackgroundJobs) {
      return sideBarSections.filter(
        (section) => section.title !== 'Background Jobs'
      )
    }

    return sideBarSections
  })()

  return (
    <div className='flex h-full w-full flex-col overflow-y-auto border-r border-gray-200 bg-white font-sans text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'>
      {/* Header with Logo */}
      <div className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
        {!isCollapsed ? (
          <Logo />
        ) : (
          <div className='flex w-full justify-center'>
            <Logo isCollapsed={true} />
          </div>
        )}
      </div>

      {/* User Info Section */}
      {user && !isCollapsed && (
        <div className='border-b border-gray-200 p-4 dark:border-gray-700'>
          <div className='flex items-center space-x-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={user.photoUrl}
                alt={user.name || user.username}
              />
              <AvatarFallback className='bg-primary/10 text-primary'>
                {user.firstName?.charAt(0)?.toUpperCase() ||
                  user.username?.charAt(0)?.toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium text-gray-900 dark:text-gray-100'>
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.username}
              </p>
              <p className='truncate text-xs text-gray-500 dark:text-gray-400'>
                {user.userType === UserType.ADMIN
                  ? 'Administrator'
                  : user.userType === UserType.DE
                    ? 'Data Entry'
                    : user.userType === UserType.DEH
                      ? 'Data Entry Head'
                      : 'User'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed User Avatar */}
      {user && isCollapsed && (
        <div className='border-b border-gray-200 py-4 dark:border-gray-700'>
          <div className='flex justify-center'>
            <Avatar className='h-10 w-10'>
              <AvatarImage
                src={user.photoUrl}
                alt={user.name || user.username}
              />
              <AvatarFallback className='bg-primary/10 text-primary'>
                {user.firstName?.charAt(0)?.toUpperCase() ||
                  user.username?.charAt(0)?.toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className={cn('flex-1', isCollapsed ? 'px-2 py-6' : 'px-4 py-6')}>
        <nav className='space-y-1'>
          {filteredSections.map((link: any) => {
            const isActive =
              location.pathname === link.href ||
              location.pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.title}
                to={link.href}
                className={cn(
                  'group relative flex items-center rounded-lg transition-all duration-200',
                  isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5',
                  'text-sm font-normal',
                  isActive
                    ? 'border border-brand-secondary/20 bg-brand-secondary/10 text-brand-secondary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-secondary dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-brand-secondary'
                )}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center transition-colors',
                    isCollapsed ? '' : 'mr-3',
                    isActive
                      ? 'text-brand-secondary'
                      : 'text-gray-500 group-hover:text-brand-secondary dark:text-gray-400 dark:group-hover:text-brand-secondary'
                  )}
                >
                  {link.icon}
                </div>
                {!isCollapsed && (
                  <div className='flex flex-1 items-center justify-between'>
                    <span className='font-medium'>{link.label}</span>
                  </div>
                )}
                {isActive && !link.isComingSoon && !isCollapsed && (
                  <div className='absolute right-2 h-2 w-2 rounded-full bg-brand-secondary' />
                )}
                {isCollapsed && <span className='sr-only'>{link.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div className='border-t border-gray-200 p-4 dark:border-gray-700'>
        <Button
          variant='ghost'
          className={cn(
            'font-normal text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300',
            isCollapsed ? 'mx-auto h-10 w-10 p-0' : 'w-full justify-start'
          )}
          onClick={() => {
            dispatch(logout())
            navigate('/auth')
          }}
          aria-label='Sign Out'
        >
          <LogOut className={cn('h-4 w-4', isCollapsed ? '' : 'mr-2')} />
          {!isCollapsed && 'Sign Out'}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
