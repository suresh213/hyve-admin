import Logo from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserAuthForm } from './use-auth-form'

export default function Component() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <div className='mb-8 flex justify-center'>
            <Logo size='2xl' mdSize='4xl' />
          </div>
          <h2 className='text-2xl font-medium text-gray-700 dark:text-gray-200'>
            Welcome to HYVE
          </h2>
        </div>
        <div className='rounded-lg bg-white p-8 shadow-md dark:bg-gray-800'>
          <UserAuthForm />
        </div>
        <div className='text-center'>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
