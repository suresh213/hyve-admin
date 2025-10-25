import api from './api'

export interface AdminCompanySearchParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  name?: string
  email?: string
  industryType?: string
  companySize?: string
  verificationStatus?: string
  isRegistered?: boolean
  country?: string
  city?: string
  state?: string
}

export interface AdminCompanyUpdateData {
  fullName?: string
  email?: string
  profile?: {
    avatar?: string
    bio?: string
    country?: string
    city?: string
    state?: string
    website?: string
  }
  companyProfile?: {
    name?: string
    logo?: string
    isRegistered?: boolean
    contactPersonName?: string
    contactPersonEmail?: string
    industryType?: string
    companySize?: string
    skillsRequired?: string[]
    budgetRange?: string
    gstin?: string
    linkedinUrl?: string
    twitterUrl?: string
    facebookUrl?: string
    instagramUrl?: string
  }
}

export interface AdminCompanyVerificationData {
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  remarks?: string
}

export class AdminCompaniesApiService {
  // Get all companies with pagination and filters
  static async getCompanies(params?: AdminCompanySearchParams): Promise<any> {
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
    if (params?.name) {
      searchParams.append('name', params.name)
    }

    if (params?.email) {
      searchParams.append('email', params.email)
    }

    if (params?.industryType) {
      searchParams.append('industryType', params.industryType)
    }

    if (params?.companySize) {
      searchParams.append('companySize', params.companySize)
    }

    if (params?.verificationStatus) {
      searchParams.append('verificationStatus', params.verificationStatus)
    }

    if (params?.isRegistered !== undefined) {
      searchParams.append('isRegistered', params.isRegistered.toString())
    }

    if (params?.country) {
      searchParams.append('country', params.country)
    }

    if (params?.city) {
      searchParams.append('city', params.city)
    }

    if (params?.state) {
      searchParams.append('state', params.state)
    }

    const response = await api.get(
      `/admin/companies?${searchParams.toString()}`
    )
    return response.data.data
  }

  // Get a specific company by ID
  static async getCompany(id: string): Promise<any> {
    const response = await api.get(`/admin/companies/${id}`)
    return response.data.data
  }

  // Update company
  static async updateCompany(
    id: string,
    updates: AdminCompanyUpdateData
  ): Promise<any> {
    const response = await api.patch(`/admin/companies/${id}`, updates)
    return response.data.data
  }

  // Update company verification status
  static async updateCompanyVerification(
    id: string,
    data: AdminCompanyVerificationData
  ): Promise<any> {
    const response = await api.patch(
      `/admin/companies/${id}/verification`,
      data
    )
    return response.data.data
  }

  // Delete a company
  static async deleteCompany(id: string): Promise<any> {
    const response = await api.delete(`/admin/companies/${id}`)
    return response.data.data
  }

  // Get company statistics
  static async getCompanyStats(): Promise<{
    totalCompanies: number
    registeredCompanies: number
    verifiedCompanies: number
    pendingVerification: number
    rejectedVerification: number
    newCompaniesThisMonth: number
    topIndustries: Array<{ industry: string; count: number }>
    companySizeDistribution: Record<string, number>
  }> {
    // Get all companies and calculate stats
    const response = await this.getCompanies({ page: 1, limit: 1000 })
    const companies = response.data.data || []

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return {
      totalCompanies: companies.length,
      registeredCompanies: companies.filter(
        (c: any) => c.companyProfile?.isRegistered
      ).length,
      verifiedCompanies: companies.filter(
        (c: any) => c.companyProfile?.verificationStatus === 'VERIFIED'
      ).length,
      pendingVerification: companies.filter(
        (c: any) => c.companyProfile?.verificationStatus === 'PENDING'
      ).length,
      rejectedVerification: companies.filter(
        (c: any) => c.companyProfile?.verificationStatus === 'REJECTED'
      ).length,
      newCompaniesThisMonth: companies.filter(
        (c: any) => new Date(c.createdAt) >= startOfMonth
      ).length,
      topIndustries: this.calculateTopIndustries(companies),
      companySizeDistribution: this.calculateCompanySizeDistribution(companies),
    }
  }

  // Helper method to calculate top industries
  private static calculateTopIndustries(
    companies: any[]
  ): Array<{ industry: string; count: number }> {
    const industryCounts: Record<string, number> = {}

    companies.forEach((company: any) => {
      if (company.companyProfile?.industryType) {
        industryCounts[company.companyProfile.industryType] =
          (industryCounts[company.companyProfile.industryType] || 0) + 1
      }
    })

    return Object.entries(industryCounts)
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // Helper method to calculate company size distribution
  private static calculateCompanySizeDistribution(
    companies: any[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {}

    companies.forEach((company: any) => {
      const size = company.companyProfile?.companySize || 'Not Specified'
      distribution[size] = (distribution[size] || 0) + 1
    })

    return distribution
  }

  // Get companies by industry
  static async getCompaniesByIndustry(industryType: string): Promise<any> {
    return this.getCompanies({ industryType })
  }

  // Get companies by verification status
  static async getCompaniesByVerificationStatus(
    verificationStatus: string
  ): Promise<any> {
    return this.getCompanies({ verificationStatus })
  }

  // Get companies by size
  static async getCompaniesBySize(companySize: string): Promise<any> {
    return this.getCompanies({ companySize })
  }

  // Get companies by registration status
  static async getCompaniesByRegistrationStatus(
    isRegistered: boolean
  ): Promise<any> {
    return this.getCompanies({ isRegistered })
  }

  // Get companies by location
  static async getCompaniesByLocation(
    country?: string,
    city?: string,
    state?: string
  ): Promise<any> {
    return this.getCompanies({ country, city, state })
  }

  // Bulk verify companies
  static async bulkVerifyCompanies(
    companyIds: string[],
    verificationStatus: 'VERIFIED' | 'REJECTED',
    remarks?: string
  ): Promise<any> {
    const promises = companyIds.map((id) =>
      this.updateCompanyVerification(id, { verificationStatus, remarks })
    )
    return Promise.all(promises)
  }

  // Get pending verifications
  static async getPendingVerifications(): Promise<any> {
    return this.getCompanies({
      verificationStatus: 'PENDING',
      page: 1,
      limit: 50,
    })
  }
}

export default AdminCompaniesApiService
