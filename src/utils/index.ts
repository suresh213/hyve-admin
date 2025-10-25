export const getErrorMessage = (error: any) => {
  console.log('Error details:', error)

  // Handle different error response formats
  const errorResponse = error?.response?.data

  // Priority 1: Check for notify.message (primary API format)
  if (errorResponse?.notify?.message) {
    return errorResponse.notify.message
  }

  // Priority 2: Check for standard message field
  if (errorResponse?.message) {
    return errorResponse.message
  }

  // Priority 3: Check for error field
  if (errorResponse?.error) {
    return errorResponse.error
  }

  // Priority 4: Check for direct error message
  if (error?.message) {
    return error.message
  }

  // Priority 5: Check for response status text
  if (error?.response?.statusText) {
    return error.response.statusText
  }

  // Priority 6: Check for generic error response
  if (typeof errorResponse === 'string') {
    return errorResponse
  }

  // HTTP Status Code specific handling
  if (error?.response?.status === 401) {
    return 'Invalid username or password. Please try again.'
  }

  if (error?.response?.status === 404) {
    return 'Service not found. Please check your connection.'
  }

  if (error?.response?.status === 500) {
    return 'Server error. Please try again later.'
  }

  if (error?.response?.status >= 400 && error?.response?.status < 500) {
    return 'Invalid request. Please check your input.'
  }

  if (error?.response?.status >= 500) {
    return 'Server error. Please try again later.'
  }

  // Network and connection errors
  if (error?.code === 'NETWORK_ERROR' || error?.code === 'ERR_NETWORK') {
    return 'Network error. Please check your internet connection.'
  }

  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }

  // Fallback message for unknown errors
  return 'An unexpected error occurred. Please try again.'
}

export const formatText = (text: string) => {
  // Check if the text is in camelCase or similar format
  const formattedText = text.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Capitalize the first letter of each word
  return (
    formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase()
  )
}

export const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'bg-gray-100 text-gray-700'
    case 'In Progress':
      return 'bg-blue-100 text-blue-700'
    case 'Skipped':
      return 'bg-yellow-100 text-yellow-700'
    case 'Completed':
      return 'bg-green-100 text-green-700'
    case 'Inactive':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const getStatusDotColor = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'bg-gray-700'
    case 'In Progress':
      return 'bg-blue-700'
    case 'Skipped':
      return 'bg-yellow-700'
    case 'Completed':
      return 'bg-green-700'
    default:
      return 'bg-gray-700'
  }
}
