import api from './api'

export interface AdminAnalyticsParams {
  timeRange?: '7d' | '30d' | '90d' | '1y'
}

export class AdminAnalyticsApiService {
  // Get platform analytics
  static async getAnalytics(params?: AdminAnalyticsParams): Promise<any> {
    const searchParams = new URLSearchParams()

    if (params?.timeRange) {
      searchParams.append('timeRange', params.timeRange)
    } else {
      searchParams.append('timeRange', '30d')
    }

    const response = await api.get(
      `/admin/analytics?${searchParams.toString()}`
    )
    return response.data.data
  }

  // Get dashboard statistics
  static async getDashboardStats(): Promise<any> {
    const response = await api.get('/admin/dashboard/stats')
    return response.data.data
  }

  // Get user growth analytics
  static async getUserGrowthAnalytics(timeRange: string = '30d'): Promise<{
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }> {
    const analytics = await this.getAnalytics({ timeRange: timeRange as any })

    // Generate growth data based on time range
    const labels: string[] = []
    const userGrowth: number[] = []
    const freelancerGrowth: number[] = []
    const companyGrowth: number[] = []

    // For now, generate sample data based on the time range
    const now = new Date()
    let periods = 30

    switch (timeRange) {
      case '7d':
        periods = 7
        break
      case '90d':
        periods = 90
        break
      case '1y':
        periods = 12
        break
    }

    for (let i = periods - 1; i >= 0; i--) {
      let date: Date
      let label: string

      if (timeRange === '1y') {
        // Monthly data for yearly view
        date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      } else {
        // Daily data
        date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      }

      labels.push(label)

      // Generate sample growth data (in a real app, this would come from the API)
      userGrowth.push(
        analytics.users?.newUsers || Math.floor(Math.random() * 10) + 5
      )
      freelancerGrowth.push(
        analytics.users?.newFreelancers || Math.floor(Math.random() * 6) + 2
      )
      companyGrowth.push(
        analytics.users?.newCompanies || Math.floor(Math.random() * 3) + 1
      )
    }

    return {
      labels,
      datasets: [
        {
          label: 'Total Users',
          data: userGrowth,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        },
        {
          label: 'Freelancers',
          data: freelancerGrowth,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        },
        {
          label: 'Companies',
          data: companyGrowth,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
        },
      ],
    }
  }

  // Get project analytics
  static async getProjectAnalytics(timeRange: string = '30d'): Promise<{
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }> {
    const analytics = await this.getAnalytics({ timeRange: timeRange as any })

    // Generate project data
    const labels: string[] = []
    const projectGrowth: number[] = []
    const activeProjects: number[] = []
    const completedProjects: number[] = []

    const now = new Date()
    let periods = 30

    switch (timeRange) {
      case '7d':
        periods = 7
        break
      case '90d':
        periods = 90
        break
      case '1y':
        periods = 12
        break
    }

    for (let i = periods - 1; i >= 0; i--) {
      let date: Date
      let label: string

      if (timeRange === '1y') {
        date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      } else {
        date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      }

      labels.push(label)

      // Generate sample project data
      projectGrowth.push(
        analytics.projects?.new || Math.floor(Math.random() * 8) + 3
      )
      activeProjects.push(
        analytics.projects?.active || Math.floor(Math.random() * 15) + 5
      )
      completedProjects.push(Math.floor(Math.random() * 5) + 2)
    }

    return {
      labels,
      datasets: [
        {
          label: 'New Projects',
          data: projectGrowth,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
        },
        {
          label: 'Active Projects',
          data: activeProjects,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        },
        {
          label: 'Completed Projects',
          data: completedProjects,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        },
      ],
    }
  }

  // Get verification analytics
  static async getVerificationAnalytics(): Promise<{
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string[]
    }[]
  }> {
    const analytics = await this.getAnalytics({ timeRange: '30d' as any })

    const verificationData = analytics.verification || {
      verified: 0,
      pending: 0,
      rejected: 0,
    }

    return {
      labels: ['Verified', 'Pending', 'Rejected'],
      datasets: [
        {
          label: 'Company Verification Status',
          data: [
            verificationData.verified,
            verificationData.pending,
            verificationData.rejected,
          ],
          backgroundColor: [
            'rgb(16, 185, 129)', // green
            'rgb(245, 158, 11)', // yellow
            'rgb(239, 68, 68)', // red
          ],
        },
      ],
    }
  }

  // Get team analytics
  static async getTeamAnalytics(): Promise<{
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }> {
    const analytics = await this.getAnalytics({ timeRange: '30d' as any })

    const labels: string[] = []
    const teamGrowth: number[] = []
    const activeTeams: number[] = []

    const now = new Date()

    // Generate last 12 months data
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })

      labels.push(label)

      // Generate sample team data
      teamGrowth.push(analytics.teams?.new || Math.floor(Math.random() * 5) + 2)
      activeTeams.push(
        analytics.teams?.active || Math.floor(Math.random() * 20) + 10
      )
    }

    return {
      labels,
      datasets: [
        {
          label: 'New Teams',
          data: teamGrowth,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
        },
        {
          label: 'Active Teams',
          data: activeTeams,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        },
      ],
    }
  }

  // Get revenue analytics (if applicable)
  static async getRevenueAnalytics(timeRange: string = '30d'): Promise<{
    totalRevenue: number
    monthlyRevenue: Array<{ month: string; amount: number }>
    averageProjectValue: number
    topClients: Array<{
      clientId: string
      clientName: string
      totalSpent: number
    }>
  }> {
    const analytics = await this.getAnalytics({ timeRange: timeRange as any })

    // Generate sample revenue data
    const now = new Date()
    const monthlyRevenue: Array<{ month: string; amount: number }> = []

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
      const amount = Math.floor(Math.random() * 50000) + 10000

      monthlyRevenue.push({ month, amount })
    }

    return {
      totalRevenue: analytics.projects?.totalValue || 0,
      monthlyRevenue,
      averageProjectValue: analytics.projects?.averageValue || 0,
      topClients: [
        // Sample top clients data
        { clientId: '1', clientName: 'Sample Company 1', totalSpent: 25000 },
        { clientId: '2', clientName: 'Sample Company 2', totalSpent: 18000 },
        { clientId: '3', clientName: 'Sample Company 3', totalSpent: 15000 },
      ],
    }
  }

  // Get platform health metrics
  static async getPlatformHealthMetrics(): Promise<{
    serverUptime: string
    databaseConnections: number
    apiResponseTime: number
    errorRate: number
    activeUsers: number
    systemLoad: number
  }> {
    // In a real application, these would come from monitoring systems
    return {
      serverUptime: '99.9%',
      databaseConnections: 45,
      apiResponseTime: 120, // ms
      errorRate: 0.1, // percentage
      activeUsers: 1234,
      systemLoad: 65, // percentage
    }
  }
}

export default AdminAnalyticsApiService
