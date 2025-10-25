import { createSlice } from '@reduxjs/toolkit'
import { Job } from '@/types'

export interface JobsState {
  jobs: {
    content: Job[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  } | null
  selectedJob: Job | null
  loading: {
    fetch: boolean
    delete: boolean
  }
  error: any | null
  pagination: {
    page: number
    pageSize: number
    totalItems: number
  }
}

const initialState: JobsState = {
  jobs: null,
  selectedJob: null,
  loading: {
    fetch: false,
    delete: false,
  },
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    totalItems: 0,
  },
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action) => {
      // Handle the actual API response structure
      const responseData = action.payload?.data || action.payload

      state.jobs = {
        content: responseData?.data || [],
        totalElements: responseData?.total || 0,
        totalPages: Math.ceil(
          (responseData?.total || 0) / state.pagination.pageSize
        ),
        size: state.pagination.pageSize,
        number: state.pagination.page,
      }

      state.pagination = {
        page: state.pagination.page,
        pageSize: state.pagination.pageSize,
        totalItems: responseData?.total || 0,
      }
    },
    setSelectedJob: (state, action) => {
      // Handle single job response
      const responseData = action.payload?.data || action.payload
      state.selectedJob = responseData?.data || responseData
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
    removeJob: (state, action) => {
      if (state.jobs?.content) {
        state.jobs.content = state.jobs.content.filter(
          (job) => job.id !== action.payload
        )
        // Update total count
        state.jobs.totalElements = state.jobs.content.length
        state.pagination.totalItems = state.jobs.content.length
      }
    },
  },
})

export const {
  setJobs,
  setSelectedJob,
  setLoading,
  setError,
  clearError,
  removeJob,
} = jobsSlice.actions

export default jobsSlice.reducer
