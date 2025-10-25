import { cn } from '@/lib/utils'
import { AppDispatch, RootState } from '@/store'
import { toggleCollapsed } from '@/store/slices/sidebarSlice'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from './sidebar'
import { Button } from './ui/button'

export default function AppShell({ children }: any) {
  const dispatch = useDispatch<AppDispatch>()
  const { isCollapsed } = useSelector((state: RootState) => state.sidebar)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Toggle sidebar collapse state
  const handleToggleSidebar = () => {
    dispatch(toggleCollapsed())
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900'>
      {/* Mobile menu button */}
      <Button
        variant='ghost'
        size='icon'
        className='fixed left-4 top-4 z-50 md:hidden'
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? (
          <X className='h-6 w-6' />
        ) : (
          <Menu className='h-6 w-6' />
        )}
      </Button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 z-30 bg-black/50 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar for desktop */}
      <div
        className={cn(
          'fixed inset-y-0 z-40 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-72',
          // Mobile styles
          isMobileMenuOpen ? 'left-0' : '-left-80 md:left-0'
        )}
      >
        <Sidebar isCollapsed={isCollapsed} />

        {/* Sidebar Toggle Button (desktop only) */}
        <Button
          variant='ghost'
          size='icon'
          className='absolute -right-3 top-[60px] z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 md:flex'
          onClick={handleToggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </Button>
      </div>

      {/* Main content */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          isCollapsed ? 'md:ml-20' : 'md:ml-72'
        )}
      >
        <main className='flex-1 overflow-hidden'>
          <div className='h-full overflow-auto bg-white shadow-sm dark:bg-gray-800'>
            <div className='min-h-full'>{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
