import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { AppDispatch } from '@/store'
import {
  fetchCitiesForState,
  setSelectedState,
  selectStates,
  selectCenters,
  selectSelectedStateId,
  selectCommonLoading,
  selectCommonError,
  State,
  City,
  Center,
} from '@/store/slices/commonSlice'

/**
 * Custom hook for managing states, cities, and centers data
 *
 * Usage examples:
 *
 * Basic usage:
 * ```tsx
 * const { stateOptions, getCityOptions, centerOptions } = useStatesAndCities()
 * ```
 *
 * With state selection:
 * ```tsx
 * const { selectState, getStateByName } = useStatesAndCities()
 * selectState(stateId) // Load cities for selected state
 * ```
 *
 * With loading states:
 * ```tsx
 * const { loading } = useStatesAndCities()
 * if (loading.states) return <div>Loading states...</div>
 * ```
 */
export const useStatesAndCities = () => {
  const dispatch = useDispatch<AppDispatch>()

  const states = useSelector(selectStates)
  const centers = useSelector(selectCenters)
  const selectedStateId = useSelector(selectSelectedStateId)
  const loading = useSelector(selectCommonLoading)
  const error = useSelector(selectCommonError)

  // Get cities for a specific state
  const getCitiesForState = (): City[] => {
    // Note: This function should be used within a React component or custom hook
    // useSelector cannot be called inside regular functions
    return []
  }

  // Memoized options for dropdowns
  const stateOptions = useMemo(
    () =>
      states.map((state) => ({
        value: state.id,
        label: state.name,
        ...state,
      })),
    [states]
  )

  const centerOptions = useMemo(
    () =>
      centers.map((center) => ({
        value: center.id,
        label: center.name,
        ...center,
      })),
    [centers]
  )

  // Get city options for a specific state
  const getCityOptions = (stateId: string) => {
    const cities = getCitiesForState(stateId)
    return cities.map((city) => ({
      value: city.id,
      label: city.name,
      ...city,
    }))
  }

  // Select a state and load its cities
  const selectState = (stateId: string) => {
    dispatch(setSelectedState(stateId))
    dispatch(fetchCitiesForState(stateId))
  }

  // Helper function to find state by name
  const getStateByName = (name: string): State | undefined => {
    return states.find((state) => state.name === name)
  }

  // Helper function to find city by name in a state
  const getCityByName = (stateId: string, name: string): City | undefined => {
    const cities = getCitiesForState(stateId)
    return cities.find((city) => city.name === name)
  }

  // Helper function to find center by name
  const getCenterByName = (name: string): Center | undefined => {
    return centers.find((center) => center.name === name)
  }

  return {
    // Data
    states,
    centers,
    selectedStateId,

    // Options for dropdowns
    stateOptions,
    centerOptions,
    getCityOptions,

    // Functions
    selectState,
    getCitiesForState,

    // Helper functions
    getStateByName,
    getCityByName,
    getCenterByName,

    // Loading and error states
    loading,
    error,
  }
}

export default useStatesAndCities
