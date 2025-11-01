import api from './api'

/**
 * Service for performing admin withdrawal related actions that don't
 * fit the list/detail/update methods in `adminWithdrawalsApi.ts`.
 *
 * This follows the project's pattern: use the shared `api` axios
 * instance and return `response.data.data`.
 */
export class AdminWithdrawalService {
  /**
   * Call backend POST /api/withdrawal/:withdrawalId
   * @param withdrawalId - the id of the withdrawal to act on
   */
  static async postWithdrawal(withdrawalId: string): Promise<any> {
    const response = await api.patch(`/withdrawal/${withdrawalId}`)
    return response.data.data
  }
}

export default AdminWithdrawalService
