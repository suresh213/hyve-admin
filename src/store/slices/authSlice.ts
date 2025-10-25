import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, UserType } from '@/types'

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isCenterAdmin: boolean
}

const loadState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem('authData')
    if (serializedState === null) {
      return {
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isAdmin: false,
        isCenterAdmin: false,
      }
    }
    return JSON.parse(serializedState) as AuthState
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isAdmin: false,
      isCenterAdmin: false,
    }
  }
}

const saveState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('authData', serializedState)
  } catch (err) {
    console.error('Could not save state to localStorage', err)
  }
}

const initialState: AuthState = loadState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        isAuthenticated: boolean
      }>
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = action.payload.isAuthenticated
      state.isAdmin = action.payload.user.userType === 'admin'
      state.isCenterAdmin = action.payload.user.userType === 'CLIENT_CENTER'
      saveState(state)
    },

    resetAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.isAdmin = false
      state.isCenterAdmin = false
      saveState(state)
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAdmin = action.payload.userType === 'admin'
      state.isCenterAdmin = action.payload.userType === 'client_center'
      saveState(state)
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      state.isAuthenticated = !!action.payload
      saveState(state)
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
      saveState(state)
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.isAdmin = false
      state.isCenterAdmin = false
      saveState(state)

      localStorage.clear()
    },
  },
})

export const {
  setAuth,
  resetAuth,
  setUser,
  setAccessToken,
  setIsAuthenticated,
  logout,
} = authSlice.actions

export default authSlice.reducer
