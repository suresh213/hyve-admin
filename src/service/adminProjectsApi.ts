import api from './api'

export interface AdminProjectSearchParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  title?: string
  status?: string
  clientId?: string
  freelancerId?: string
  teamId?: string
  minAmount?: number
  maxAmount?: number
  startDate?: string
  endDate?: string
}

export interface AdminProjectUpdateData {
  title?: string
  description?: string
  status?: string
  totalAmount?: number
  startDate?: string
  endDate?: string
  skills?: string[]
  requirements?: string
  deliverables?: string
  adminNote?: string
}

export class AdminProjectsApiService {
  // Get all projects with pagination and filters
  static async getProjects(params?: AdminProjectSearchParams): Promise<any> {
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
    if (params?.title) {
      searchParams.append('title', params.title)
    }

    if (params?.status) {
      searchParams.append('status', params.status)
    }

    if (params?.clientId) {
      searchParams.append('clientId', params.clientId)
    }

    if (params?.freelancerId) {
      searchParams.append('freelancerId', params.freelancerId)
    }

    if (params?.teamId) {
      searchParams.append('teamId', params.teamId)
    }

    if (params?.minAmount !== undefined) {
      searchParams.append('minAmount', params.minAmount.toString())
    }

    if (params?.maxAmount !== undefined) {
      searchParams.append('maxAmount', params.maxAmount.toString())
    }

    if (params?.startDate) {
      searchParams.append('startDate', params.startDate)
    }

    if (params?.endDate) {
      searchParams.append('endDate', params.endDate)
    }

    const response = await api.get(`/admin/projects?${searchParams.toString()}`)
    return response.data.data
  }

  // Get a specific project by ID
  static async getProject(id: string): Promise<any> {
    const response = await api.get(`/admin/projects/${id}`)
    return response.data.data
  }

  // Update project
  static async updateProject(
    id: string,
    updates: AdminProjectUpdateData
  ): Promise<any> {
    const response = await api.patch(`/admin/projects/${id}`, updates)
    return response.data.data
  }

  // Update project status
  static async updateProjectStatus(
    id: string,
    updates: AdminProjectUpdateData
  ): Promise<any> {
    const response = await api.patch(`/admin/projects/${id}/status`, updates)
    return response.data.data
  }

  // Delete a project
  static async deleteProject(id: string): Promise<any> {
    const response = await api.delete(`/admin/projects/${id}`)
    return response.data.data
  }

  // Get project statistics
  static async getProjectStats(): Promise<{
    totalProjects: number
    activeProjects: number
    completedProjects: number
    cancelledProjects: number
    newProjectsThisMonth: number
    averageProjectValue: number
    totalProjectValue: number
    statusDistribution: Record<string, number>
    monthlyProjectTrends: Array<{ month: string; count: number; value: number }>
  }> {
    // Get all projects and calculate stats
    const response = await this.getProjects({ page: 1, limit: 1000 })
    const projects = response.data.data || []

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const statusCounts: Record<string, number> = {}
    let totalValue = 0
    let projectCountWithValue = 0

    projects.forEach((project: any) => {
      statusCounts[project.status] = (statusCounts[project.status] || 0) + 1

      if (project.totalAmount && project.totalAmount > 0) {
        totalValue += project.totalAmount
        projectCountWithValue++
      }
    })

    return {
      totalProjects: projects.length,
      activeProjects: statusCounts['IN_PROGRESS'] || 0,
      completedProjects: statusCounts['COMPLETED'] || 0,
      cancelledProjects: statusCounts['CANCELLED'] || 0,
      newProjectsThisMonth: projects.filter(
        (p: any) => new Date(p.createdAt) >= startOfMonth
      ).length,
      averageProjectValue:
        projectCountWithValue > 0 ? totalValue / projectCountWithValue : 0,
      totalProjectValue: totalValue,
      statusDistribution: statusCounts,
      monthlyProjectTrends: this.calculateMonthlyTrends(projects),
    }
  }

  // Helper method to calculate monthly trends
  private static calculateMonthlyTrends(
    projects: any[]
  ): Array<{ month: string; count: number; value: number }> {
    const monthlyData: Record<string, { count: number; value: number }> = {}

    projects.forEach((project: any) => {
      const date = new Date(project.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, value: 0 }
      }

      monthlyData[monthKey].count++
      if (project.totalAmount) {
        monthlyData[monthKey].value += project.totalAmount
      }
    })

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        count: data.count,
        value: data.value,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12) // Last 12 months
  }

  // Get projects by status
  static async getProjectsByStatus(status: string): Promise<any> {
    return this.getProjects({ status })
  }

  // Get projects by client
  static async getProjectsByClient(clientId: string): Promise<any> {
    return this.getProjects({ clientId })
  }

  // Get projects by freelancer
  static async getProjectsByFreelancer(freelancerId: string): Promise<any> {
    return this.getProjects({ freelancerId })
  }

  // Get projects by team
  static async getProjectsByTeam(teamId: string): Promise<any> {
    return this.getProjects({ teamId })
  }

  // Get projects by amount range
  static async getProjectsByAmount(
    minAmount?: number,
    maxAmount?: number
  ): Promise<any> {
    return this.getProjects({ minAmount, maxAmount })
  }

  // Get projects by date range
  static async getProjectsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<any> {
    return this.getProjects({ startDate, endDate })
  }

  // Get active projects
  static async getActiveProjects(): Promise<any> {
    return this.getProjectsByStatus('IN_PROGRESS')
  }

  // Get completed projects
  static async getCompletedProjects(): Promise<any> {
    return this.getProjectsByStatus('COMPLETED')
  }

  // Get high-value projects
  static async getHighValueProjects(minAmount: number = 10000): Promise<any> {
    return this.getProjectsByAmount(minAmount)
  }

  // Get projects needing attention (stuck in certain statuses)
  static async getProjectsNeedingAttention(): Promise<any> {
    const response = await this.getProjects({ page: 1, limit: 1000 })
    const projects = response.data.data || []

    // Projects that might need admin attention
    const problematicStatuses = [
      'QUOTATION_PENDING',
      'CONTRACT_PENDING',
      'CONTRACT_REJECTED',
    ]

    return {
      ...response,
      data: projects.filter((project: any) =>
        problematicStatuses.includes(project.status)
      ),
    }
  }

  // Get project performance metrics
  static async getProjectPerformanceMetrics(): Promise<{
    averageProjectDuration: number
    onTimeCompletionRate: number
    budgetAdherenceRate: number
    clientSatisfactionScore: number
    freelancerSatisfactionScore: number
  }> {
    const response = await this.getProjects({ page: 1, limit: 1000 })
    const projects = response.data.data || []

    // Calculate metrics based on completed projects
    const completedProjects = projects.filter(
      (p: any) => p.status === 'COMPLETED'
    )

    if (completedProjects.length === 0) {
      return {
        averageProjectDuration: 0,
        onTimeCompletionRate: 0,
        budgetAdherenceRate: 0,
        clientSatisfactionScore: 0,
        freelancerSatisfactionScore: 0,
      }
    }

    // Calculate average project duration
    const totalDuration = completedProjects.reduce(
      (sum: number, project: any) => {
        if (project.startDate && project.endDate) {
          const duration =
            new Date(project.endDate).getTime() -
            new Date(project.startDate).getTime()
          return sum + duration
        }
        return sum
      },
      0
    )

    const averageDuration =
      totalDuration / completedProjects.length / (1000 * 60 * 60 * 24) // in days

    // For now, return placeholder values for other metrics
    // These would need actual data from feedback systems
    return {
      averageProjectDuration: Math.round(averageDuration),
      onTimeCompletionRate: 85, // Placeholder
      budgetAdherenceRate: 78, // Placeholder
      clientSatisfactionScore: 4.2, // Placeholder
      freelancerSatisfactionScore: 4.1, // Placeholder
    }
  }
}

export default AdminProjectsApiService
