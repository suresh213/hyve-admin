import React, { useState, useEffect, useCallback } from 'react'
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  CheckCircle,
  DollarSign,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import AdminFreelancersApiService, {
  AdminFreelancerSearchParams,
} from '@/service/adminFreelancersApi'
import { useNavigate } from 'react-router-dom'

interface Freelancer {
  id: string
  email: string
  fullName: string
  role: string
  emailVerified: boolean
  mobileVerified: boolean
  createdAt: string
  updatedAt: string
  profile: {
    avatar?: string
    bio?: string
    country?: string
    city?: string
    state?: string
  }
  freelancerProfile?: {
    experienceLevel?: string
    skills?: string[]
    hourlyRate?: number
    portfolioUrl?: string
    linkedinUrl?: string
    githubUrl?: string
  } | null
}

interface FreelancersResponse {
  data: Freelancer[]
  totalCount: number
  currentPage: number
  totalPages: number
}

const FreelancersPage: React.FC = () => {
  const navigate = useNavigate()
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<AdminFreelancerSearchParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalCount: 0,
    totalPages: 0,
  })

  // Fetch freelancers
  const fetchFreelancers = useCallback(async () => {
    try {
      setLoading(true)
      const response: FreelancersResponse =
        await AdminFreelancersApiService.getFreelancers(filters)
      setFreelancers(Array.isArray(response.data) ? response.data : [])
      setPagination({
        currentPage: response.currentPage,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
      })
    } catch (error) {
      console.error('Error fetching freelancers:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchFreelancers()
  }, [fetchFreelancers])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters((prev) => ({ ...prev, name: value || undefined, page: 1 }))
  }

  // Handle filter changes
  const handleFilterChange = (
    key: keyof AdminFreelancerSearchParams,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  // Handle freelancer actions
  const handleView = (id: string) => {
    navigate(`/freelancers/${id}`)
  }

  const handleEdit = (id: string) => {
    // For now, just navigate to view. Edit functionality can be added later
    navigate(`/freelancers/${id}`)
  }


  const formatHourlyRate = (rate?: number) => {
    return rate ? `$${rate}/hr` : 'Not set'
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Freelancers</h2>
        <div className='flex items-center space-x-2'>
          <Button onClick={() => fetchFreelancers()}>Refresh</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Freelancers
            </CardTitle>
            <UserCheck className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pagination.totalCount}</div>
            <p className='text-xs text-muted-foreground'>
              Registered freelancers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>With Skills</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {
                (Array.isArray(freelancers) ? freelancers : []).filter(
                  (f) =>
                    f.freelancerProfile?.skills &&
                    f.freelancerProfile.skills.length > 0
                ).length
              }
            </div>
            <p className='text-xs text-muted-foreground'>
              Freelancers with skills
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>With Rates</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {
                (Array.isArray(freelancers) ? freelancers : []).filter(
                  (f) => f.freelancerProfile?.hourlyRate
                ).length
              }
            </div>
            <p className='text-xs text-muted-foreground'>
              Freelancers with rates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              With Portfolio
            </CardTitle>
            <UserCheck className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {
                (Array.isArray(freelancers) ? freelancers : []).filter(
                  (f) => f.freelancerProfile?.portfolioUrl
                ).length
              }
            </div>
            <p className='text-xs text-muted-foreground'>
              Freelancers with portfolio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <div className='min-w-[200px] flex-1'>
              <Input
                placeholder='Search by name or email...'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className='w-full'
              />
            </div>
            <Select
              value={filters.experienceLevel || 'ALL'}
              onValueChange={(value) =>
                handleFilterChange(
                  'experienceLevel',
                  value === 'ALL' ? undefined : value
                )
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Experience Level' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Levels</SelectItem>
                <SelectItem value='BEGINNER'>Beginner</SelectItem>
                <SelectItem value='INTERMEDIATE'>Intermediate</SelectItem>
                <SelectItem value='EXPERT'>Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Freelancers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Freelancers ({pagination.totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Portfolio</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center'>
                    Loading freelancers...
                  </TableCell>
                </TableRow>
              ) : (Array.isArray(freelancers) ? freelancers : []).length ===
                0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center'>
                    No freelancers found
                  </TableCell>
                </TableRow>
              ) : (
                (Array.isArray(freelancers) ? freelancers : []).map(
                  (freelancer) => (
                    <TableRow key={freelancer.id}>
                      <TableCell className='font-medium'>
                        {freelancer.fullName}
                      </TableCell>
                      <TableCell>{freelancer.email}</TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {freelancer.freelancerProfile?.experienceLevel ||
                            'Not set'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {(freelancer.freelancerProfile?.skills || [])
                            .slice(0, 3)
                            .map((skill, index) => (
                              <Badge
                                key={index}
                                variant='secondary'
                                className='text-xs'
                              >
                                {skill}
                              </Badge>
                            ))}
                          {(freelancer.freelancerProfile?.skills || []).length >
                            3 && (
                            <Badge variant='secondary' className='text-xs'>
                              +
                              {(freelancer.freelancerProfile?.skills || [])
                                .length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatHourlyRate(
                          freelancer.freelancerProfile?.hourlyRate
                        )}
                      </TableCell>
                      <TableCell>
                        {freelancer.freelancerProfile?.portfolioUrl ? (
                          <Badge variant='default'>Yes</Badge>
                        ) : (
                          <Badge variant='secondary'>No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleView(freelancer.id)}
                            >
                              <Eye className='mr-2 h-4 w-4' />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(freelancer.id)}
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='flex items-center justify-between px-2 py-4'>
              <div className='flex-1 text-sm text-muted-foreground'>
                Showing {(Array.isArray(freelancers) ? freelancers : []).length}{' '}
                of {pagination.totalCount} freelancers
              </div>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                >
                  Previous
                </Button>
                <span className='text-sm'>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default FreelancersPage
