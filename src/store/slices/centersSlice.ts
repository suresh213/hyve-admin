import { createSlice } from '@reduxjs/toolkit'
import { CenterInfo } from '@/types'

interface CentersState {
  centers: {
    content: CenterInfo[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  } | null
  currentCenter: CenterInfo | null
  zones: string[]
  roles: string[]
  loading: {
    fetch: boolean
    add: boolean
    update: boolean
    delete: boolean
  }
  error: any | null
  pagination: {
    page: number
    pageSize: number
    totalItems: number
  }
  filters: {
    search?: string
  }
}

const initialState: CentersState = {
  centers: null,
  currentCenter: null,
  zones: [],
  roles: [],
  loading: {
    fetch: false,
    add: false,
    update: false,
    delete: false,
  },
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    totalItems: 0,
  },
  filters: {},
}

const centersSlice = createSlice({
  name: 'centers',
  initialState,
  reducers: {
    setCenters: (state, action) => {
      // Handle the actual API response structure
      const responseData = action.payload?.data || action.payload

      state.centers = {
        content: responseData?.content || responseData?.data || [],
        totalElements: responseData?.totalElements || responseData?.total || 0,
        totalPages: Math.ceil(
          (responseData?.totalElements || responseData?.total || 0) /
            state.pagination.pageSize
        ),
        size: state.pagination.pageSize,
        number: state.pagination.page - 1, // Store as 0-based for consistency
      }

      state.pagination = {
        page: state.pagination.page,
        pageSize: state.pagination.pageSize,
        totalItems: responseData?.totalElements || responseData?.total || 0,
      }
    },
    setCurrentCenter: (state, action) => {
      // Handle single center response
      const responseData = action.payload?.data || action.payload
      state.currentCenter = responseData?.data || responseData
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
    removeCenter: (state, action) => {
      if (state.centers?.content) {
        state.centers.content = state.centers.content.filter(
          (center) => center.id !== action.payload
        )
        state.centers.totalElements = state.centers.content.length
        state.pagination.totalItems = state.centers.content.length
      }
    },
    addNewCenter: (state, action) => {
      if (state.centers?.content) {
        const responseData = action.payload?.data || action.payload
        const newCenter = responseData?.data || responseData
        state.centers.content = [newCenter, ...state.centers.content]
        state.centers.totalElements = state.centers.content.length
        state.pagination.totalItems = state.centers.content.length
      }
    },
    updateCenterInList: (state, action) => {
      if (state.centers?.content) {
        const responseData = action.payload?.data || action.payload
        const updatedCenter = responseData?.data || responseData
        state.centers.content = state.centers.content.map((center) =>
          center.id === updatedCenter?.id ? updatedCenter : center
        )
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
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
  setCenters,
  setCurrentCenter,
  setLoading,
  setError,
  clearError,
  setFilters,
  clearFilters,
  removeCenter,
  addNewCenter,
  updateCenterInList,
  setRoles,
  setPagination,
} = centersSlice.actions

export default centersSlice.reducer
