import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { CommonApiService } from '@/service/commonApi'

// Types for states, cities, and centers
export interface State {
  id: string
  name: string
  lat: number
  lng: number
}

export interface City {
  id: string
  name: string
  lat: number
  lng: number
  stateId: string
}

export interface Center {
  id: string
  name: string
  address?: string
  city?: string
  state?: string
  pinCode?: string
  lat?: number
  lng?: number
}

// Async thunks for API operations
export const fetchConfig = createAsyncThunk('common/fetchConfig', async () => {
  const response = await CommonApiService.getConfig()
  return response
})
export const fetchAllStates = createAsyncThunk(
  'common/fetchAllStates',
  async () => {
    const response = await CommonApiService.getAllStates()
    return response.data || response
  }
)

export const fetchCitiesForState = createAsyncThunk(
  'common/fetchCitiesForState',
  async (stateId: string) => {
    const response = await CommonApiService.getAllCitiesOfState(stateId)
    return { stateId, cities: response.data || response }
  }
)

export const fetchAllCenters = createAsyncThunk(
  'common/fetchAllCenters',
  async () => {
    const response = await CommonApiService.getAllCenters()
    return response.data || response
  }
)

export const fetchZones = createAsyncThunk('common/fetchZones', async () => {
  const response = await CommonApiService.getZones()
  return response.data || response
})

// Configuration interface
interface Config {
  clientCodes: string[]
  securityIssueCats: string[]
  zones: string[]
  centerManagerIssueCats: string[]
  roles: string[]
}

// State interface
interface CommonState {
  states: State[]
  cities: Record<string, City[]> // stateId -> cities
  centers: Center[]
  zones: string[]
  selectedStateId: string | null
  config: Config | null
  securityIssueCats: string[]
  centerManagerIssueCats: string[]
  roles: string[]
  loading: {
    states: boolean
    cities: boolean
    centers: boolean
    zones: boolean
    config: boolean
  }
  error: string | null
}

const initialState: CommonState = {
  states: [],
  cities: {},
  centers: [],
  zones: [],
  selectedStateId: null,
  config: null,
  securityIssueCats: [],
  centerManagerIssueCats: [],
  roles: [],
  loading: {
    states: false,
    cities: false,
    centers: false,
    zones: false,
    config: false,
  },
  error: null,
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setSelectedState: (state, action: PayloadAction<string | null>) => {
      state.selectedStateId = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearCitiesForState: (state, action: PayloadAction<string>) => {
      delete state.cities[action.payload]
    },
  },
  extraReducers: (builder) => {
    // Fetch all states
    builder
      .addCase(fetchAllStates.pending, (state) => {
        state.loading.states = true
        state.error = null
      })
      .addCase(fetchAllStates.fulfilled, (state, action) => {
        state.loading.states = false
        state.states = action.payload
      })
      .addCase(fetchAllStates.rejected, (state, action) => {
        state.loading.states = false
        state.error = action.error.message || 'Failed to fetch states'
      })

    // Fetch cities for state
    builder
      .addCase(fetchCitiesForState.pending, (state) => {
        state.loading.cities = true
        state.error = null
      })
      .addCase(fetchCitiesForState.fulfilled, (state, action) => {
        state.loading.cities = false
        const { stateId, cities } = action.payload
        state.cities[stateId] = cities
      })
      .addCase(fetchCitiesForState.rejected, (state, action) => {
        state.loading.cities = false
        state.error = action.error.message || 'Failed to fetch cities'
      })

    // Fetch all centers
    builder
      .addCase(fetchAllCenters.pending, (state) => {
        state.loading.centers = true
        state.error = null
      })
      .addCase(fetchAllCenters.fulfilled, (state, action) => {
        state.loading.centers = false
        state.centers = action.payload
      })
      .addCase(fetchAllCenters.rejected, (state, action) => {
        state.loading.centers = false
        state.error = action.error.message || 'Failed to fetch centers'
      })

    // Fetch zones
    builder
      .addCase(fetchZones.pending, (state) => {
        state.loading.zones = true
        state.error = null
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.loading.zones = false
        state.zones = action.payload
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.loading.zones = false
        state.error = action.error.message || 'Failed to fetch zones'
      })

    // Fetch config
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.loading.config = true
        state.error = null
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.loading.config = false
        state.config = action.payload
        state.zones = action.payload.zones || []
        state.securityIssueCats = action.payload.securityIssueCats || []
        state.centerManagerIssueCats =
          action.payload.centerManagerIssueCats || []
        state.roles = action.payload.roles || []
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.loading.config = false
        state.error = action.error.message || 'Failed to fetch config'
      })
  },
})

export const { setSelectedState, clearError, clearCitiesForState } =
  commonSlice.actions

// Selectors
export const selectStates = (state: any) => state.common.states
export const selectCitiesForState = (state: any, stateId: string) =>
  state.common.cities[stateId] || []
export const selectCenters = (state: any) => state.common.centers
export const selectZones = (state: any) => state.common.zones
export const selectSelectedStateId = (state: any) =>
  state.common.selectedStateId
export const selectCommonLoading = (state: any) => state.common.loading
export const selectCommonError = (state: any) => state.common.error
export const selectConfig = (state: any) => state.common.config
export const selectClientCodes = (state: any) =>
  state.common.config?.clientCodes || []
export const selectSecurityIssueCats = (state: any) =>
  state.common.securityIssueCats || []
export const selectCenterManagerIssueCats = (state: any) =>
  state.common.centerManagerIssueCats || []
export const selectRoles = (state: any) => state.common.roles || []

export default commonSlice.reducer
