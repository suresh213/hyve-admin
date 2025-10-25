import api from './api'

interface LoginRequest {
  email: string
  password: string
}

interface PasswordResetRequest {
  userId: string
  password: string
}

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  contact: string
  password: string
  role: string
}

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await api.post('/auth/login', data)
    return response.data.data
  },
  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data)
    return response.data.data
  },
  resetPassword: async (data: PasswordResetRequest) => {
    const response = await api.put('/auth/reset-password', data)
    return response.data.data
  },
}
