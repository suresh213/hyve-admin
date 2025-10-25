import { createSlice } from '@reduxjs/toolkit'
import { UserInfo } from '@/types'

interface UsersState {
  users: {
    content: UserInfo[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  } | null
  currentUser: UserInfo | null
  roles: string[]
  userTypes: ('CLIENT' | 'CLIENT_CENTER' | 'SYS')[]
  loading: {
    fetch: boolean
    add: boolean
    update: boolean
    delete: boolean
    upload: boolean
  }
  error: any | null
  pagination: {
    page: number
    pageSize: number
    totalItems: number
  }
  filters: {
    search?: string
    role?: string
    userType?: 'CLIENT' | 'CLIENT_CENTER' | 'SYS'
    status?: string
    verified?: boolean
    clientCode?: string
    centerCode?: string
  }
}

const initialState: UsersState = {
  users: null,
  currentUser: null,
  roles: [],
  userTypes: ['CLIENT', 'CLIENT_CENTER', 'SYS'],
  loading: {
    fetch: false,
    add: false,
    update: false,
    delete: false,
    upload: false,
  },
  error: null,
  pagination: {
    page: 1, // Using 1-based pagination
    pageSize: 20,
    totalItems: 0,
  },
  filters: {},
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      // Handle the actual API response structure
      const responseData = action.payload?.data || action.payload

      state.users = {
        content: responseData?.content || responseData?.data || [],
        totalElements: responseData?.totalElements || responseData?.total || 0,
        totalPages: Math.ceil(
          (responseData?.totalElements || responseData?.total || 0) /
            state.pagination.pageSize
        ),
        size: state.pagination.pageSize,
        number: state.pagination.page,
      }

      state.pagination = {
        page: state.pagination.page,
        pageSize: state.pagination.pageSize,
        totalItems: responseData?.totalElements || responseData?.total || 0,
      }
    },
    setCurrentUser: (state, action) => {
      // Handle single user response
      const responseData = action.payload?.data || action.payload
      state.currentUser = responseData?.data || responseData
    },
    setLoading: (state, action) => {
      state.loading = { ...state.loading, ...action.payload }
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    removeUser: (state, action) => {
      if (state.users?.content) {
        state.users.content = state.users.content.filter(
          (user) => user.id !== action.payload
        )
        // Update total count
        state.users.totalElements = state.users.content.length
        state.pagination.totalItems = state.users.content.length
      }
    },
    addNewUser: (state, action) => {
      if (state.users?.content) {
        const responseData = action.payload?.data || action.payload
        const newUser = responseData?.data || responseData
        state.users.content = [newUser, ...state.users.content]
        // Update total count
        state.users.totalElements = state.users.content.length
        state.pagination.totalItems = state.users.content.length
      }
    },
    updateUserInList: (state, action) => {
      if (state.users?.content) {
        const responseData = action.payload?.data || action.payload
        const updatedUser = responseData?.data || responseData
        state.users.content = state.users.content.map((user) =>
          user.id === updatedUser?.id ? updatedUser : user
        )
      }
    },
    setRoles: (state, action) => {
      state.roles = action.payload
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
  },
})

export const {
  setUsers,
  setCurrentUser,
  setLoading,
  setError,
  clearError,
  setFilters,
  clearFilters,
  removeUser,
  addNewUser,
  updateUserInList,
  setRoles,
  setPagination,
} = usersSlice.actions

export default usersSlice.reducer
