import { createSlice } from '@reduxjs/toolkit'
import {
  TaskInfo,
  CenterTaskMapRequest,
  TaskSummaryCenter,
  TasksResponse,
} from '@/types'

export interface TasksState {
  tasks: {
    content: TaskInfo[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  } | null
  currentTask: TaskInfo | null
  taskMappings: CenterTaskMapRequest[]
  taskSummary: TaskSummaryCenter[]
  loading: {
    fetch: boolean
    add: boolean
    update: boolean
    delete: boolean
    generate: boolean
  }
  error: any | null
  pagination: {
    page: number
    pageSize: number
    totalItems: number
  }
  filters: {
    date?: string
    centerCode?: string
    role?: string
    summary?: boolean
  }
}

const initialState: TasksState = {
  tasks: null,
  currentTask: null,
  taskMappings: [],
  taskSummary: [],
  loading: {
    fetch: false,
    add: false,
    update: false,
    delete: false,
    generate: false,
  },
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    totalItems: 0,
  },
  filters: {},
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      const responseData: TasksResponse | TaskInfo[] = action.payload

      if (Array.isArray(responseData)) {
        state.tasks = {
          content: responseData,
          totalElements: responseData.length,
          totalPages: Math.ceil(
            responseData.length / state.pagination.pageSize
          ),
          size: state.pagination.pageSize,
          number: state.pagination.page,
        }
        state.taskSummary = []
        state.pagination.totalItems = responseData.length
      } else {
        const taskList = responseData?.taskList || []
        state.tasks = {
          content: taskList,
          totalElements: taskList.length,
          totalPages: Math.ceil(taskList.length / state.pagination.pageSize),
          size: state.pagination.pageSize,
          number: state.pagination.page,
        }
        state.taskSummary = responseData?.taskSummary || []
        state.pagination.totalItems = taskList.length
      }
    },
    setCurrentTask: (state, action) => {
      // Handle single task response
      const responseData = action.payload?.data || action.payload
      state.currentTask = responseData?.data || responseData
    },
    setTaskMappings: (state, action) => {
      const responseData = action.payload?.data || action.payload
      state.taskMappings = responseData?.data || responseData || []
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
    removeTask: (state, action) => {
      if (state.tasks?.content) {
        state.tasks.content = state.tasks.content.filter(
          (task) => task.id !== action.payload
        )
        // Update total count
        state.tasks.totalElements = state.tasks.content.length
        state.pagination.totalItems = state.tasks.content.length
      }
    },
    addNewTask: (state, action) => {
      if (state.tasks?.content) {
        const responseData = action.payload?.data || action.payload
        const newTask = responseData?.data || responseData
        state.tasks.content = [newTask, ...state.tasks.content]
        // Update total count
        state.tasks.totalElements = state.tasks.content.length
        state.pagination.totalItems = state.tasks.content.length
      }
    },
    updateTaskInList: (state, action) => {
      if (state.tasks?.content) {
        const responseData = action.payload?.data || action.payload
        const updatedTask = responseData?.data || responseData
        state.tasks.content = state.tasks.content.map((task) =>
          task.id === updatedTask?.id ? updatedTask : task
        )
      }
    },
    addTaskMapping: (state, action) => {
      const responseData = action.payload?.data || action.payload
      const newMapping = responseData?.data || responseData
      if (Array.isArray(newMapping)) {
        state.taskMappings = [...state.taskMappings, ...newMapping]
      } else if (newMapping) {
        state.taskMappings = [...state.taskMappings, newMapping]
      }
    },
    removeTaskMapping: (state, action) => {
      state.taskMappings = state.taskMappings.filter(
        (mapping) =>
          mapping.centerCode !== action.payload.centerCode ||
          mapping.role !== action.payload.role
      )
    },
  },
})

export const {
  setTasks,
  setCurrentTask,
  setTaskMappings,
  setLoading,
  setError,
  clearError,
  setFilters,
  clearFilters,
  removeTask,
  addNewTask,
  updateTaskInList,
  addTaskMapping,
  removeTaskMapping,
} = tasksSlice.actions

export default tasksSlice.reducer
