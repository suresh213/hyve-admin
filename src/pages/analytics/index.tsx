import React, { useState, useEffect } from 'react'
import {
  Users,
  Building2,
  UserCheck,
  FolderOpen,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import AdminAnalyticsApiService from '@/service/adminAnalyticsApi'

interface AnalyticsData {
  users: {
    total: number
    freelancers: number
    companies: number
    newUsers: number
    newFreelancers: number
    newCompanies: number
  }
  teams: {
    total: number
    active: number
    new: number
  }
  projects: {
    total: number
    active: number
    new: number
  }
  verification: {
    verified: number
    pending: number
    rejected: number
  }
  timeRange: string
}

interface DashboardStats {
  overview: {
    totalUsers: number
    totalFreelancers: number
    totalCompanies: number
    totalTeams: number
    totalProjects: number
    recentUsers: number
    recentProjects: number
    recentTeams: number
  }
  projectStatus: Record<string, number>
  topSkills: Array<{ skills: string[]; _count: { skills: number } }>
  topIndustries: Array<{
    industryType: string
    _count: { industryType: number }
  }>
}

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [analyticsResponse, dashboardResponse] = await Promise.all([
        AdminAnalyticsApiService.getAnalytics({ timeRange: timeRange as any }),
        AdminAnalyticsApiService.getDashboardStats(),
      ])

      setAnalytics(analyticsResponse.data)
      setDashboardStats(dashboardResponse.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
  }

  if (loading) {
    return (
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>Loading analytics...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>
          Analytics Dashboard
        </h2>
        <div className='flex items-center space-x-2'>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select time range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7d'>Last 7 days</SelectItem>
              <SelectItem value='30d'>Last 30 days</SelectItem>
              <SelectItem value='90d'>Last 90 days</SelectItem>
              <SelectItem value='1y'>Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analytics?.users.total || 0}
            </div>
            <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
              {analytics?.users.newUsers && analytics.users.newUsers > 0 ? (
                <TrendingUp className='h-3 w-3 text-green-500' />
              ) : (
                <TrendingDown className='h-3 w-3 text-red-500' />
              )}
              <span>
                {analytics?.users.newUsers || 0} new this{' '}
                {timeRange.replace('d', ' days').replace('1y', 'year')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Freelancers</CardTitle>
            <UserCheck className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analytics?.users.freelancers || 0}
            </div>
            <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
              <span>
                {analytics?.users.newFreelancers || 0} new freelancers
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Companies</CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analytics?.users.companies || 0}
            </div>
            <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
              <span>{analytics?.verification.verified || 0} verified</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Projects</CardTitle>
            <FolderOpen className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analytics?.projects.total || 0}
            </div>
            <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
              <span>{analytics?.projects.active || 0} active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* User Growth */}
        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <UserCheck className='h-4 w-4 text-green-500' />
                  <span className='text-sm font-medium'>Freelancers</span>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold'>
                    {analytics?.users.freelancers || 0}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {analytics?.users.newFreelancers || 0} new
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Building2 className='h-4 w-4 text-blue-500' />
                  <span className='text-sm font-medium'>Companies</span>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold'>
                    {analytics?.users.companies || 0}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {analytics?.users.newCompanies || 0} new
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Users className='h-4 w-4 text-purple-500' />
                  <span className='text-sm font-medium'>Total Users</span>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold'>
                    {analytics?.users.total || 0}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {analytics?.users.newUsers || 0} new
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle>Company Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <CheckCircle className='h-4 w-4 text-green-500' />
                  <span className='text-sm'>Verified</span>
                </div>
                <Badge variant='default'>
                  {analytics?.verification.verified || 0}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Clock className='h-4 w-4 text-yellow-500' />
                  <span className='text-sm'>Pending</span>
                </div>
                <Badge variant='secondary'>
                  {analytics?.verification.pending || 0}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <AlertCircle className='h-4 w-4 text-red-500' />
                  <span className='text-sm'>Rejected</span>
                </div>
                <Badge variant='destructive'>
                  {analytics?.verification.rejected || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teams Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Total Teams</span>
                <span className='text-2xl font-bold'>
                  {analytics?.teams.total || 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>
                  Active Teams
                </span>
                <span className='text-lg font-semibold'>
                  {analytics?.teams.active || 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>New Teams</span>
                <span className='text-lg font-semibold'>
                  {analytics?.teams.new || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {dashboardStats?.projectStatus &&
                Object.entries(dashboardStats.projectStatus).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className='flex items-center justify-between'
                    >
                      <span className='text-sm capitalize'>
                        {status.replace(/_/g, ' ')}
                      </span>
                      <Badge variant='outline'>{count}</Badge>
                    </div>
                  )
                )}
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {dashboardStats?.topSkills
                ?.slice(0, 5)
                .map((skillGroup, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <span className='text-sm'>
                      {skillGroup.skills.join(', ')}
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      {skillGroup._count.skills}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Industries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {dashboardStats?.topIndustries
                ?.slice(0, 5)
                .map((industryGroup, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <span className='text-sm'>
                      {industryGroup.industryType}
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      {industryGroup._count.industryType}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3'>
                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                <span className='text-sm'>
                  {dashboardStats?.overview.recentUsers || 0} new users
                  registered
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                <span className='text-sm'>
                  {dashboardStats?.overview.recentProjects || 0} new projects
                  created
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span className='text-sm'>
                  {dashboardStats?.overview.recentTeams || 0} new teams formed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Active Users</span>
                <span className='text-sm font-medium'>
                  {dashboardStats?.overview.totalUsers || 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Projects in Progress</span>
                <span className='text-sm font-medium'>
                  {dashboardStats?.projectStatus?.IN_PROGRESS || 0}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Teams Active</span>
                <span className='text-sm font-medium'>
                  {analytics?.teams.active || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsPage
