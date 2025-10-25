import ApiService from './api'

interface PropsResponse {
  clientCodes: string
  'security-issueCats': string
  zones: string
  'center_manager-issueCats': string
  roles: string
}

export const CommonApiService = {
  getConfig: async () => {
    const response = await ApiService.get('/common/props')
    const props = response.data.data as PropsResponse
    return {
      ...props,
      zones: props.zones.split(',').map((zone) => zone.trim()),
      clientCodes: props.clientCodes.split(',').map((code) => code.trim()),
      securityIssueCats: props['security-issueCats']
        .split(',')
        .map((cat) => cat.trim()),
      centerManagerIssueCats: props['center_manager-issueCats']
        .split(',')
        .map((cat) => cat.trim()),
      roles: props.roles.split(',').map((role) => role.trim()),
    }
  },
  getAllStates: async () => {
    const response = await ApiService.get('/common/states')
    return response.data.data
  },

  getAllCitiesOfState: async (stateId: string) => {
    const response = await ApiService.get(`/common/cities/${stateId}`)
    return response.data.data
  },

  getAllCenters: async () => {
    const response = await ApiService.get('/common/centers')
    return response.data.data
  },

  downloadSampleFile: async (type: string, format = 'xlsx') => {
    const response = await ApiService.get(
      `/media/download-formats?type=${type}&format=${format}`,
      {
        responseType: 'blob',
      }
    )
    return response.data.data
  },

  getZones: async () => {
    const response = await ApiService.get('/common/zones')
    return response.data.data
  },
}
