import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { config } from '../config/config'

// Define the base URL of the API - include /api since all endpoints use it
const API_BASE_URL = config.api.url

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach the access token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from auth state stored in localStorage
    const authData = localStorage.getItem('authData')
    let accessToken = null

    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData)
        accessToken = parsedAuth.accessToken
      } catch (error) {
        console.error('Failed to parse auth data from localStorage:', error)
      }
    }

    // Fallback to direct accessToken key for backward compatibility
    if (!accessToken) {
      accessToken = localStorage.getItem('accessToken')
    }

    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle token refresh automatically
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: any) => {
    const originalRequest = error.config

    // Check if the error is due to an expired access token and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
    }

    // Only redirect to login for 401 errors on authenticated routes
    // Don't redirect for login/signup endpoints
    if (error.response?.status === 401 && 
        !originalRequest.url?.includes('/auth/login') && 
        !originalRequest.url?.includes('/auth/signup')) {
      localStorage.removeItem('authData')
      localStorage.removeItem('accessToken')
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/auth' && window.location.pathname !== '/auth/signup') {
        window.location.href = '/auth'
      }
    }

    // Reject the error so it can be handled by the calling component
    return Promise.reject(error)
  }
)

export default api
