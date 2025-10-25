import { useCallback, useEffect, useRef, useState } from 'react'

interface UseDebouncedSearchOptions {
  delay?: number
  minLength?: number
}

export function useDebouncedSearch(
  initialValue: string = '',
  onSearch: (value: string) => void,
  options: UseDebouncedSearchOptions = {}
) {
  const { delay = 300, minLength = 0 } = options
  const [searchText, setSearchText] = useState(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onSearchRef = useRef(onSearch)
  const previousValueRef = useRef<string>(initialValue)

  // Update the ref when onSearch changes
  useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  // Debounce the search value
  useEffect(() => {
    const trimmedValue = searchText.trim()

    // Only trigger search if value has actually changed and meets minimum length
    if (trimmedValue === previousValueRef.current) {
      return
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // If value is empty or meets minimum length, trigger search immediately
    if (trimmedValue === '' || trimmedValue.length >= minLength) {
      timeoutRef.current = setTimeout(
        () => {
          previousValueRef.current = trimmedValue
          onSearchRef.current(trimmedValue)
        },
        trimmedValue === '' ? 0 : delay
      ) // Immediate for empty, delayed for search
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchText, delay, minLength])

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchText('')
  }, [])

  return {
    searchText,
    handleSearchChange,
    clearSearch,
  }
}
