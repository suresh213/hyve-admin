import api from './api'

export interface WithdrawalSearchParams {
  page?: number
  limit?: number
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Withdrawal {
  id: string
  walletId: string
  amount: number
  bankAccountId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

export interface WithdrawalsResponse {
  withdrawals: Withdrawal[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Transaction {
  id: string
  type: string
  status: string
  amount: number
  description: string
  referenceId: string | null
  settlementReference: string | null
  milestoneId: string | null
  walletId: string
  createdAt: string
  updatedAt: string
  milestone: {
    id: string
    projectId: string
    title: string
    description: string
    timeline: string
    amount: number
    percentage: number
    order: number
    status: string
    status_freelancer: string
    status_client: string
    completionNote: string
    createdAt: string
    updatedAt: string
    escrowTransactionId: string
    paidToEscrowAt: string
    markedCompletedAt: string
    creditedToWalletAt: string
    project: {
      id: string
      taskId: string
      applicationId: string
      clientId: string
      freelancerId: string | null
      teamId: string | null
      title: string
      totalAmount: number | null
      description: string
      status: string
      startDate: string
      endDate: string | null
      createdAt: string
      updatedAt: string
    }
  } | null
}

export interface Wallet {
  id: string
  userId: string
  availableAmount: number
  currency: string
  createdAt: string
  updatedAt: string
  transactions: Transaction[]
}

export interface WithdrawalDetailResponse {
  id: string
  walletId: string
  amount: number
  bankAccountId: string | null
  vendorId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  remarks: string | null
  createdAt: string
  updatedAt: string
  wallet: Wallet
}

export class AdminWithdrawalsApiService {
  // Get all withdrawal requests with pagination and filters
  static async getWithdrawals(
    params?: WithdrawalSearchParams
  ): Promise<WithdrawalsResponse> {
    const searchParams = new URLSearchParams()

    // Handle pagination parameters
    if (params?.page !== undefined) {
      searchParams.append('page', params.page.toString())
    } else {
      searchParams.append('page', '1')
    }

    if (params?.limit !== undefined) {
      searchParams.append('limit', params.limit.toString())
    } else {
      searchParams.append('limit', '10')
    }

    // Handle sorting parameters
    if (params?.sortBy) {
      searchParams.append('sortBy', params.sortBy)
    }

    if (params?.sortOrder) {
      searchParams.append('sortOrder', params.sortOrder)
    }

    // Handle filter parameters
    if (params?.status) {
      searchParams.append('status', params.status)
    }

    const response = await api.get(`/withdrawals?${searchParams.toString()}`)
    return response.data.data
  }

  // Get a specific withdrawal request by ID
  static async getWithdrawal(id: string): Promise<WithdrawalDetailResponse> {
    const response = await api.get(`/withdrawals/${id}`)
    return response.data.data
  }

  // Update withdrawal status (for admin settlement actions)
  static async updateWithdrawalStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'COMPLETED',
    remarks?: string
  ): Promise<any> {
    const response = await api.patch(`/withdrawals/${id}`, {
      status,
      remarks,
    })
    return response.data.data
  }
}

export default AdminWithdrawalsApiService
