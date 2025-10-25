import React from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useStatesAndCities } from '@/hooks/useStatesAndCities'

interface StateCitySelectProps {
  selectedState?: string
  selectedCity?: string
  onStateChange?: (stateId: string, stateName: string) => void
  onCityChange?: (cityId: string, cityName: string) => void
  stateLabel?: string
  cityLabel?: string
  statePlaceholder?: string
  cityPlaceholder?: string
  stateRequired?: boolean
  cityRequired?: boolean
  disabled?: boolean
  returnNames?: boolean // If true, returns names instead of IDs
}

export const StateCitySelect: React.FC<StateCitySelectProps> = ({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  stateLabel = 'State',
  cityLabel = 'City',
  statePlaceholder = 'Select state',
  cityPlaceholder = 'Select city',
  stateRequired = false,
  cityRequired = false,
  disabled = false,
  returnNames = false,
}) => {
  const {
    stateOptions,
    getCityOptions,
    selectState,
    getStateByName,
    getStateById,
  } = useStatesAndCities()

  const handleStateChange = (value: string) => {
    const state = returnNames ? getStateByName(value) : getStateById(value)
    if (state) {
      selectState(state.id)
      if (onStateChange) {
        onStateChange(returnNames ? state.name : state.id, state.name)
      }
      // Clear city selection when state changes
      if (onCityChange) {
        onCityChange('', '')
      }
    }
  }

  const handleCityChange = (value: string) => {
    if (onCityChange) {
      // Find the city to get both ID and name
      const stateId = returnNames
        ? getStateByName(selectedState || '')?.id
        : selectedState

      if (stateId) {
        const cities = getCityOptions(stateId)
        const city = cities.find((c) =>
          returnNames ? c.label === value : c.value === value
        )
        if (city) {
          onCityChange(returnNames ? city.label : city.value, city.label)
        }
      }
    }
  }

  const stateSelectOptions = returnNames
    ? stateOptions.map((state) => ({ value: state.label, label: state.label }))
    : stateOptions

  const currentStateId = returnNames
    ? getStateByName(selectedState || '')?.id
    : selectedState

  const citySelectOptions = currentStateId
    ? getCityOptions(currentStateId).map((city) =>
        returnNames ? { value: city.label, label: city.label } : city
      )
    : []

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='state'>
          {stateLabel}
          {stateRequired && <span className='ml-1 text-red-500'>*</span>}
        </Label>
        <Select
          value={selectedState || ''}
          onValueChange={handleStateChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={statePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {stateSelectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='city'>
          {cityLabel}
          {cityRequired && <span className='ml-1 text-red-500'>*</span>}
        </Label>
        <Select
          value={selectedCity || ''}
          onValueChange={handleCityChange}
          disabled={disabled || !currentStateId}
        >
          <SelectTrigger>
            <SelectValue placeholder={cityPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {citySelectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default StateCitySelect
