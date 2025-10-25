import api from './api'

export interface AdminTeamSearchParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  name?: string
  skills?: string
  ownerId?: string
  isVerified?: boolean
  isPublic?: boolean
  isActive?: boolean
  country?: string
  city?: string
}

export interface AdminTeamUpdateData {
  isVerified?: boolean
  isActive?: boolean
}

export class AdminTeamsApiService {
  // Get all teams with pagination and filters
  static async getTeams(params?: AdminTeamSearchParams): Promise<any> {
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

    if (params?.skills) {
      searchParams.append('skills', params.skills)
    }

    if (params?.ownerId) {
      searchParams.append('ownerId', params.ownerId)
    }

    if (params?.isVerified !== undefined) {
      searchParams.append('isVerified', params.isVerified.toString())
    }

    if (params?.isPublic !== undefined) {
      searchParams.append('isPublic', params.isPublic.toString())
    }

    if (params?.isActive !== undefined) {
      searchParams.append('isActive', params.isActive.toString())
    }

    if (params?.country) {
      searchParams.append('country', params.country)
    }

    if (params?.city) {
      searchParams.append('city', params.city)
    }

    const response = await api.get(`/admin/teams?${searchParams.toString()}`)
    return response.data.data
  }

  // Get a specific team by ID
  static async getTeam(id: string): Promise<any> {
    const response = await api.get(`/admin/teams/${id}`)
    return response.data.data
  }

  // Update team
  static async updateTeam(
    id: string,
    updates: AdminTeamUpdateData
  ): Promise<any> {
    const response = await api.patch(`/admin/teams/${id}`, updates)
    return response.data.data
  }

  // Update team status
  static async updateTeamStatus(
    id: string,
    updates: AdminTeamUpdateData
  ): Promise<any> {
    const response = await api.patch(`/admin/teams/${id}/verification`, updates)
    return response.data.data
  }

  // Delete a team
  static async deleteTeam(id: string): Promise<any> {
    const response = await api.delete(`/admin/teams/${id}`)
    return response.data.data
  }

  // Get team statistics
  static async getTeamStats(): Promise<{
    totalTeams: number
    activeTeams: number
    verifiedTeams: number
    publicTeams: number
    newTeamsThisMonth: number
    topSkills: Array<{ skill: string; count: number }>
    averageTeamSize: number
    teamsWithShowcases: number
  }> {
    // Get all teams and calculate stats
    const response = await this.getTeams({ page: 1, limit: 1000 })
    const teams = response.data.data || []

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return {
      totalTeams: teams.length,
      activeTeams: teams.filter((t: any) => t.isActive).length,
      verifiedTeams: teams.filter((t: any) => t.isVerified).length,
      publicTeams: teams.filter((t: any) => t.isPublic).length,
      newTeamsThisMonth: teams.filter(
        (t: any) => new Date(t.createdAt) >= startOfMonth
      ).length,
      topSkills: this.calculateTopSkills(teams),
      averageTeamSize: this.calculateAverageTeamSize(teams),
      teamsWithShowcases: teams.filter((t: any) => t._count?.showcases > 0)
        .length,
    }
  }

  // Helper method to calculate top skills
  private static calculateTopSkills(
    teams: any[]
  ): Array<{ skill: string; count: number }> {
    const skillCounts: Record<string, number> = {}

    teams.forEach((team: any) => {
      if (team.skills) {
        team.skills.forEach((skill: string) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1
        })
      }
    })

    return Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // Helper method to calculate average team size
  private static calculateAverageTeamSize(teams: any[]): number {
    if (teams.length === 0) return 0

    const totalMembers = teams.reduce((sum: number, team: any) => {
      return sum + (team._count?.members || 0)
    }, 0)

    return Math.round(totalMembers / teams.length)
  }

  // Get teams by owner
  static async getTeamsByOwner(ownerId: string): Promise<any> {
    return this.getTeams({ ownerId })
  }

  // Get teams by verification status
  static async getTeamsByVerificationStatus(isVerified: boolean): Promise<any> {
    return this.getTeams({ isVerified })
  }

  // Get teams by activity status
  static async getTeamsByActivityStatus(isActive: boolean): Promise<any> {
    return this.getTeams({ isActive })
  }

  // Get teams by visibility
  static async getTeamsByVisibility(isPublic: boolean): Promise<any> {
    return this.getTeams({ isPublic })
  }

  // Get teams by skill
  static async getTeamsBySkill(skill: string): Promise<any> {
    return this.getTeams({ skills: skill })
  }

  // Get teams by location (through owner profile)
  static async getTeamsByLocation(
    country?: string,
    city?: string
  ): Promise<any> {
    return this.getTeams({ country, city })
  }

  // Get large teams (with many members)
  static async getLargeTeams(minMembers: number = 10): Promise<any> {
    // This would require a more complex query, for now return all teams
    // and filter client-side based on member count
    const response = await this.getTeams({ page: 1, limit: 1000 })
    const teams = response.data.data || []
    return {
      ...response,
      data: teams.filter(
        (team: any) => (team._count?.members || 0) >= minMembers
      ),
    }
  }

  // Get teams with showcases
  static async getTeamsWithShowcases(): Promise<any> {
    const response = await this.getTeams({ page: 1, limit: 1000 })
    const teams = response.data.data || []
    return {
      ...response,
      data: teams.filter((team: any) => (team._count?.showcases || 0) > 0),
    }
  }

  // Get recent teams
  static async getRecentTeams(days: number = 30): Promise<any> {
    const response = await this.getTeams({ page: 1, limit: 1000 })
    const teams = response.data.data || []
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    return {
      ...response,
      data: teams.filter((team: any) => new Date(team.createdAt) >= cutoffDate),
    }
  }
}

export default AdminTeamsApiService
