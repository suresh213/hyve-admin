import React, { useEffect, useState } from 'react'
import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle,
  DollarSign,
  FolderOpen,
  TrendingUp,
  Users,
  UserCheck,
  RefreshCw,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import AdminAnalyticsApiService from '@/service/adminAnalyticsApi'

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
  topSkills: Array<{ skill: string; count: number }>
  topIndustries: Array<{ industry: string; count: number }>
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await AdminAnalyticsApiService.getDashboardStats()
      setStats(response)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Set default stats for development
      setStats({
        overview: {
          totalUsers: 0,
          totalFreelancers: 0,
          totalCompanies: 0,
          totalTeams: 0,
          totalProjects: 0,
          recentUsers: 0,
          recentProjects: 0,
          recentTeams: 0,
        },
        projectStatus: {},
        topSkills: [],
        topIndustries: [],
        recentActivity: [],
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
  }: {
    title: string
    value: string | number
    icon: React.ElementType
    description: string
    trend?: string
  }) => (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>
          {description}
          {trend && <span className='ml-1 text-green-600'>{trend}</span>}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className='flex-1 space-y-4 p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
        <Button onClick={fetchDashboardStats} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className='h-4 w-24' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='mb-2 h-8 w-16' />
                  <Skeleton className='h-3 w-32' />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title='Total Users'
              value={stats?.overview.totalUsers || 0}
              icon={Users}
              description='Registered users'
            />
            <StatCard
              title='Freelancers'
              value={stats?.overview.totalFreelancers || 0}
              icon={UserCheck}
              description='Active freelancers'
            />
            <StatCard
              title='Companies'
              value={stats?.overview.totalCompanies || 0}
              icon={Building2}
              description='Registered companies'
            />
            <StatCard
              title='Projects'
              value={stats?.overview.totalProjects || 0}
              icon={FolderOpen}
              description='Total projects'
            />
          </>
        )}
      </div>

      {/* Recent Activity & Teams/Projects */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {loading ? (
          <>
            <Card>
              <CardHeader>
                <Skeleton className='h-5 w-32' />
              </CardHeader>
              <CardContent>
                <Skeleton className='mb-2 h-6 w-20' />
                <Skeleton className='h-4 w-28' />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className='h-5 w-32' />
              </CardHeader>
              <CardContent>
                <Skeleton className='mb-2 h-6 w-20' />
                <Skeleton className='h-4 w-28' />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className='h-5 w-32' />
              </CardHeader>
              <CardContent>
                <Skeleton className='mb-2 h-6 w-20' />
                <Skeleton className='h-4 w-28' />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <StatCard
              title='Teams'
              value={stats?.overview.totalTeams || 0}
              icon={Users}
              description='Active teams'
            />
            <StatCard
              title='New Users (7d)'
              value={stats?.overview.recentUsers || 0}
              icon={TrendingUp}
              description='Joined this week'
              trend='+12%'
            />
            <StatCard
              title='New Projects (7d)'
              value={stats?.overview.recentProjects || 0}
              icon={Activity}
              description='Created this week'
              trend='+8%'
            />
          </>
        )}
      </div>

      {/* Project Status Distribution & Top Skills */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-2'>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className='flex justify-between'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-4 w-8' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-2'>
                {stats?.projectStatus &&
                Object.entries(stats.projectStatus).length > 0 ? (
                  Object.entries(stats.projectStatus).map(([status, count]) => (
                    <div
                      key={status}
                      className='flex items-center justify-between'
                    >
                      <span className='text-sm capitalize'>
                        {status.replace(/_/g, ' ').toLowerCase()}
                      </span>
                      <span className='font-medium'>{count}</span>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    No project data available
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-2'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex justify-between'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-4 w-8' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-2'>
                {stats?.topSkills && stats.topSkills.length > 0 ? (
                  stats.topSkills.slice(0, 5).map((skill, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between'
                    >
                      <span className='text-sm'>{skill.skill}</span>
                      <span className='font-medium'>{skill.count}</span>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    No skill data available
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Industries & Recent Activity */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Top Industries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-2'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex justify-between'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-4 w-8' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-2'>
                {stats?.topIndustries && stats.topIndustries.length > 0 ? (
                  stats.topIndustries.slice(0, 5).map((industry, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between'
                    >
                      <span className='text-sm capitalize'>
                        {industry.industry.replace(/_/g, ' ').toLowerCase()}
                      </span>
                      <span className='font-medium'>{industry.count}</span>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    No industry data available
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-3'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex items-start space-x-2'>
                    <Skeleton className='mt-2 h-2 w-2 rounded-full' />
                    <div className='flex-1'>
                      <Skeleton className='mb-1 h-4 w-full' />
                      <Skeleton className='h-3 w-20' />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-3'>
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className='flex items-start space-x-2'>
                      <div className='mt-2 h-2 w-2 rounded-full bg-blue-500' />
                      <div className='flex-1'>
                        <p className='text-sm'>{activity.description}</p>
                        <p className='text-xs text-muted-foreground'>
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='space-y-3'>
                    <div className='flex items-start space-x-2'>
                      <div className='mt-2 h-2 w-2 rounded-full bg-green-500' />
                      <div className='flex-1'>
                        <p className='text-sm'>Welcome to HYVE Admin Panel</p>
                        <p className='text-xs text-muted-foreground'>
                          Just now
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <div className='mt-2 h-2 w-2 rounded-full bg-blue-500' />
                      <div className='flex-1'>
                        <p className='text-sm'>Dashboard analytics loaded</p>
                        <p className='text-xs text-muted-foreground'>
                          Just now
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <div className='mt-2 h-2 w-2 rounded-full bg-purple-500' />
                      <div className='flex-1'>
                        <p className='text-sm'>All modules are ready</p>
                        <p className='text-xs text-muted-foreground'>
                          Just now
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Button variant='outline' className='h-20 flex-col gap-2'>
              <UserCheck className='h-6 w-6' />
              <span>Manage Freelancers</span>
            </Button>
            <Button variant='outline' className='h-20 flex-col gap-2'>
              <Building2 className='h-6 w-6' />
              <span>Manage Companies</span>
            </Button>
            <Button variant='outline' className='h-20 flex-col gap-2'>
              <Users className='h-6 w-6' />
              <span>Manage Teams</span>
            </Button>
            <Button variant='outline' className='h-20 flex-col gap-2'>
              <BarChart3 className='h-6 w-6' />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
