import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import sidebarSlice from './slices/sidebarSlice'
import centersSlice from './slices/centersSlice'
import tasksSlice from './slices/tasksSlice'
import jobsSlice from './slices/jobsSlice'
import commonSlice from './slices/commonSlice'
import usersSlice from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    sidebar: sidebarSlice,
    centers: centersSlice,
    tasks: tasksSlice,
    jobs: jobsSlice,
    common: commonSlice,
    users: usersSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
