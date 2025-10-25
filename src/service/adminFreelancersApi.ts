import api from './api'

export interface AdminFreelancerSearchParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  name?: string
  email?: string
  skills?: string
  experienceLevel?: string
  minBudget?: number
  maxBudget?: number
  country?: string
  city?: string
  state?: string
  isVerified?: boolean
}

export interface AdminFreelancerUpdateData {
  status?: boolean
  isVerified?: boolean
}

export class AdminFreelancersApiService {
  // Get all freelancers with pagination and filters
  static async getFreelancers(
    params?: AdminFreelancerSearchParams
  ): Promise<any> {
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

    if (params?.skills) {
      searchParams.append('skills', params.skills)
    }

    if (params?.experienceLevel) {
      searchParams.append('experienceLevel', params.experienceLevel)
    }

    if (params?.minBudget !== undefined) {
      searchParams.append('minBudget', params.minBudget.toString())
    }

    if (params?.maxBudget !== undefined) {
      searchParams.append('maxBudget', params.maxBudget.toString())
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

    if (params?.isVerified !== undefined) {
      searchParams.append('isVerified', params.isVerified.toString())
    }

    const response = await api.get(
      `/admin/freelancers?${searchParams.toString()}`
    )
    return response.data.data
  }

  // Get a specific freelancer by ID
  static async getFreelancer(id: string): Promise<any> {
    const response = await api.get(`/admin/freelancers/${id}`)
    return response.data.data
  }

  // Update freelancer status
  static async updateFreelancerStatus(
    id: string,
    updates: AdminFreelancerUpdateData
  ): Promise<any> {
    const response = await api.patch(`/admin/freelancers/${id}/status`, updates)
    return response.data.data
  }

  // Delete a freelancer
  static async deleteFreelancer(id: string): Promise<any> {
    const response = await api.delete(`/admin/freelancers/${id}`)
    return response.data.data
  }

  // Get freelancer statistics
  static async getFreelancerStats(): Promise<{
    totalFreelancers: number
    activeFreelancers: number
    verifiedFreelancers: number
    newFreelancersThisMonth: number
    topSkills: Array<{ skill: string; count: number }>
    experienceLevelDistribution: Record<string, number>
  }> {
    // Get all freelancers and calculate stats
    const response = await this.getFreelancers({ page: 1, limit: 1000 })
    const freelancers = response.data.data || []

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return {
      totalFreelancers: freelancers.length,
      activeFreelancers: freelancers.filter((f: any) => f.status !== false)
        .length,
      verifiedFreelancers: freelancers.filter((f: any) => f.isVerified === true)
        .length,
      newFreelancersThisMonth: freelancers.filter(
        (f: any) => new Date(f.createdAt) >= startOfMonth
      ).length,
      topSkills: this.calculateTopSkills(freelancers),
      experienceLevelDistribution:
        this.calculateExperienceDistribution(freelancers),
    }
  }

  // Helper method to calculate top skills
  private static calculateTopSkills(
    freelancers: any[]
  ): Array<{ skill: string; count: number }> {
    const skillCounts: Record<string, number> = {}

    freelancers.forEach((freelancer: any) => {
      if (freelancer.freelancerProfile?.skills) {
        freelancer.freelancerProfile.skills.forEach((skill: string) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1
        })
      }
    })

    return Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // Helper method to calculate experience level distribution
  private static calculateExperienceDistribution(
    freelancers: any[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {}

    freelancers.forEach((freelancer: any) => {
      const level =
        freelancer.freelancerProfile?.experienceLevel || 'Not Specified'
      distribution[level] = (distribution[level] || 0) + 1
    })

    return distribution
  }

  // Get freelancers by skill
  static async getFreelancersBySkill(skill: string): Promise<any> {
    return this.getFreelancers({ skills: skill })
  }

  // Get freelancers by experience level
  static async getFreelancersByExperience(
    experienceLevel: string
  ): Promise<any> {
    return this.getFreelancers({ experienceLevel })
  }

  // Get freelancers by location
  static async getFreelancersByLocation(
    country?: string,
    city?: string,
    state?: string
  ): Promise<any> {
    return this.getFreelancers({ country, city, state })
  }

  // Get freelancers by budget range
  static async getFreelancersByBudget(
    minBudget?: number,
    maxBudget?: number
  ): Promise<any> {
    return this.getFreelancers({ minBudget, maxBudget })
  }
}

export default AdminFreelancersApiService
