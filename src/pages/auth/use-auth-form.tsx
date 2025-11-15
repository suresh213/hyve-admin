/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from '@/components/ui/use-toast'
import router from '@/router'
import { LoginRequest, UserPayload, UserType } from '@/types'
import { getErrorMessage } from '@/utils'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Icons } from '../../components/ui/icons'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { cn } from '../../lib/utils'
import { authApi } from '../../service/authApi'
import { setAuth } from '../../store/slices/authSlice'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  // Determine if we're in signup mode based on the current path
  const isSignupMode = location.pathname.includes('/signup')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
  })

  // Reset form and error when switching between login/signup modes
  useEffect(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      password: '',
      confirmPassword: '',
    })
    setError(null)
  }, [isSignupMode])

  // Clear error when user starts typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  // Add error boundary effect to catch any unexpected errors
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error)
      // Prevent default error handling that might cause redirects
      event.preventDefault()
      // Set a generic error message
      setError('An unexpected error occurred. Please try again.')
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      // Prevent default error handling that might cause redirects
      event.preventDefault()
      // Set a generic error message
      setError('An unexpected error occurred. Please try again.')
    }

    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const getInputFields = () => {
    const baseFields = []

    // Add registration fields only for signup
    if (isSignupMode) {
      baseFields.push(
        {
          id: 'firstName',
          type: 'text',
          placeholder: 'John',
          label: 'First Name',
          autoComplete: 'given-name',
        },
        {
          id: 'lastName',
          type: 'text',
          placeholder: 'Doe',
          label: 'Last Name',
          autoComplete: 'family-name',
        },
        {
          id: 'contact',
          type: 'tel',
          placeholder: '+91 9876543210',
          label: 'Contact Number',
          autoComplete: 'tel',
        },
        {
          id: 'email',
          type: 'email',
          placeholder: 'john.doe@example.com',
          label: 'Email (Optional)',
          autoComplete: 'email',
        }
      )
    }

    baseFields.push(
      {
        id: 'email',
        type: 'email',
        placeholder: isSignupMode ? 'admin@hyve.com' : 'admin@hyve.com',
        label: 'Email',
        autoComplete: 'email',
      },
      {
        id: 'password',
        type: 'password',
        placeholder: '**********',
        label: 'Password',
        autoComplete: isSignupMode ? 'new-password' : 'current-password',
      }
    )

    if (isSignupMode) {
      baseFields.push({
        id: 'confirmPassword',
        type: 'password',
        placeholder: '**********',
        label: 'Confirm Password',
        autoComplete: 'new-password',
      })
    }

    return baseFields
  }

  const validateForm = () => {
    // Clear any previous errors
    setError(null)

    if (isSignupMode) {
      if (
        !formData.firstName ||
        !formData.email ||
        !formData.contact ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        const errorMsg = 'Please fill in all required fields'
        setError(errorMsg)
        toast({
          title: errorMsg,
          variant: 'destructive',
        })
        return false
      }
      if (formData.firstName.trim().length < 2) {
        const errorMsg = 'First name must be at least 2 characters long'
        setError(errorMsg)
        toast({
          title: errorMsg,
          variant: 'destructive',
        })
        return false
      }
      if (!formData.email.includes('@')) {
        const errorMsg = 'Please enter a valid email address'
        setError(errorMsg)
        toast({
          title: errorMsg,
          variant: 'destructive',
        })
        return false
      }
      if (formData.contact.length < 10) {
        const errorMsg = 'Please enter a valid contact number'
        setError(errorMsg)
        toast({
          title: errorMsg,
          variant: 'destructive',
        })
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        const errorMsg = 'Passwords do not match'
        setError(errorMsg)
        toast({
          title: errorMsg,
          variant: 'destructive',
        })
        return false
      }
      if (formData.password.length < 6) {
        const errorMsg = 'Password must be at least 6 characters long'
        setError(errorMsg)
        toast({
          title: errorMsg,
          variant: 'destructive',
        })
        return false
      }
    } else {
      if (!formData.email || !formData.password) {
        const errorMsg = 'Please fill in all required fields'
        setError(errorMsg)
        toast({
          title: errorMsg,
          variant: 'destructive',
        })
        return false
      }
    }

    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const signupData: UserPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        role: 'ADMIN', // Set role to admin for admin panel
      }

      const response = await authApi.register(signupData)

      // LogiTrack API returns generic object, so we need to handle the actual structure
      const user = response.user || response
      const accessToken = response.accessToken || response.token || 'temp_token'

      // Store tokens and user data
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('accessToken', accessToken)

      dispatch(
        setAuth({
          isAuthenticated: true,
          user,
          accessToken,
        })
      )

      toast({
        title: 'Account created successfully!',
        description: 'Welcome to HYVE.',
      })

      // Navigate to freelancers page (admin panel default)
      try {
        navigate(router.paths.freelancers.path)
      } catch (navError) {
        console.error('Navigation error:', navError)
        // If navigation fails, still show success but log the error
        toast({
          title: 'Account created but navigation failed',
          description: 'Please refresh the page or navigate manually.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error('Signup error details:', {
        error: err,
        response: err?.response,
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
        code: err?.code,
      })

      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password,
      }

      const response = await authApi.login(loginData)

      // LogiTrack API returns generic object, so we need to handle the actual structure
      const user = response.user
      const accessToken = response.tokens.access.token

      // Store tokens and user data
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('accessToken', accessToken)
      dispatch(
        setAuth({
          isAuthenticated: true,
          user,
          accessToken,
        })
      )

      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.name || user.username || 'User'}`,
      })

      // Navigate to freelancers page (admin panel default)
      try {
        navigate(router.paths.freelancers.path)
      } catch (navError) {
        console.error('Navigation error:', navError)
        // If navigation fails, still show success but log the error
        toast({
          title: 'Login successful but navigation failed',
          description: 'Please refresh the page or navigate manually.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error('Login error details:', {
        error: err,
        response: err?.response,
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
        code: err?.code,
      })

      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = isSignupMode ? handleSignup : handleLogin

  const onSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault()
      handleSubmit(e)
    } catch (error) {
      console.error('Form submission error:', error)
      setError(
        'An unexpected error occurred while submitting the form. Please try again.'
      )
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...props}>
      <form className='space-y-6' onSubmit={onSubmit}>
        <div className='space-y-6'>
          {getInputFields().map((field) => (
            <div key={field.id}>
              <Label
                htmlFor={field.id}
                className='block text-sm font-medium text-gray-600'
              >
                {field.label}
                {isSignupMode &&
                  [
                    'firstName',
                    'username',
                    'contact',
                    'password',
                    'confirmPassword',
                  ].includes(field.id) && (
                    <span className='ml-1 text-red-500'>*</span>
                  )}
              </Label>
              <Input
                id={field.id}
                placeholder={field.placeholder}
                type={field.type}
                autoComplete={field.autoComplete}
                value={formData[field.id as keyof typeof formData]}
                onChange={handleChange}
                disabled={isLoading}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-gray-500 sm:text-sm'
              />
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className='rounded-md border border-red-200 bg-red-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            </div>
          </div>
        )}

        <Button type='submit' disabled={isLoading} className='mt-4 w-full'>
          {isLoading ? (
            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
          ) : isSignupMode ? (
            'Create Account'
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </div>
  )
}
