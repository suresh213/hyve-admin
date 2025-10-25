import React, { useCallback, useEffect, useState } from 'react'
import {
  CheckCircle,
  Crown,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  User,
  Users,
  XCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import AdminTeamsApiService, {
  AdminTeamSearchParams,
} from '@/service/adminTeamsApi'

interface Team {
  id: string
  name: string
  description: string
  logo?: string
  isVerified?: boolean
  isActive?: boolean
  isPublic?: boolean
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    fullName: string
    email: string
  }
  _count: {
    members: number
    showcases: number
  }
  skills: string[]
}

interface TeamsResponse {
  data: Team[]
  totalCount: number
  currentPage: number
  totalPages: number
}

const TeamsPage: React.FC = () => {
  const navigate = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<AdminTeamSearchParams>({
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

  // Fetch teams
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true)
      const response: TeamsResponse =
        await AdminTeamsApiService.getTeams(filters)
      setTeams(Array.isArray(response.data) ? response.data : [])
      setPagination({
        currentPage: response.currentPage,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
      })
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters((prev) => ({ ...prev, name: value || undefined, page: 1 }))
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof AdminTeamSearchParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  // Handle team actions
  const handleView = (id: string) => {
    navigate(`/teams/${id}`)
  }

  const handleEdit = (id: string) => {
    // For now, just navigate to view. Edit functionality can be added later
    navigate(`/teams/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await AdminTeamsApiService.deleteTeam(id)
        fetchTeams()
      } catch (error) {
        console.error('Error deleting team:', error)
      }
    }
  }

  const handleVerificationUpdate = async (
    id: string,
    status: 'VERIFIED' | 'REJECTED'
  ) => {
    try {
      await AdminTeamsApiService.updateTeamStatus(id, {
        isVerified: status === 'VERIFIED',
      })
      fetchTeams()
    } catch (error) {
      console.error('Error updating team verification:', error)
    }
  }

  const getVerificationBadgeVariant = (isVerified: boolean | undefined) => {
    if (isVerified === true) return 'default'
    if (isVerified === false) return 'destructive'
    return 'secondary' // For undefined/null, show as pending
  }

  const getVisibilityBadgeVariant = (isPublic: boolean | undefined) => {
    if (isPublic === true) return 'default'
    if (isPublic === false) return 'secondary'
    return 'outline' // For undefined/null
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Teams</h2>
        <div className='flex items-center space-x-2'>
          <Button onClick={() => fetchTeams()}>Refresh</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Teams</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pagination.totalCount}</div>
            <p className='text-xs text-muted-foreground'>Registered teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Verified</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {
                (Array.isArray(teams) ? teams : []).filter(
                  (t) => t.isVerified === true
                ).length
              }
            </div>
            <p className='text-xs text-muted-foreground'>Verified teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active</CardTitle>
            <Crown className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {
                (Array.isArray(teams) ? teams : []).filter(
                  (t) => t.isActive === true
                ).length
              }
            </div>
            <p className='text-xs text-muted-foreground'>Active teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Public</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {
                (Array.isArray(teams) ? teams : []).filter(
                  (t) => t.isPublic === true
                ).length
              }
            </div>
            <p className='text-xs text-muted-foreground'>Public teams</p>
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
                placeholder='Search by name or owner...'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className='w-full'
              />
            </div>
            <Select
              value={
                filters.isVerified === true
                  ? 'VERIFIED'
                  : filters.isVerified === false
                    ? 'REJECTED'
                    : 'ALL'
              }
              onValueChange={(value) =>
                handleFilterChange(
                  'isVerified',
                  value === 'VERIFIED'
                    ? true
                    : value === 'REJECTED'
                      ? false
                      : undefined
                )
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Verification Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Status</SelectItem>
                <SelectItem value='VERIFIED'>Verified</SelectItem>
                <SelectItem value='REJECTED'>Not Verified</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={
                filters.isActive === true
                  ? 'ACTIVE'
                  : filters.isActive === false
                    ? 'INACTIVE'
                    : 'ALL'
              }
              onValueChange={(value) =>
                handleFilterChange(
                  'isActive',
                  value === 'ACTIVE'
                    ? true
                    : value === 'INACTIVE'
                      ? false
                      : undefined
                )
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Activity Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Status</SelectItem>
                <SelectItem value='ACTIVE'>Active</SelectItem>
                <SelectItem value='INACTIVE'>Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={
                filters.isPublic === true
                  ? 'PUBLIC'
                  : filters.isPublic === false
                    ? 'PRIVATE'
                    : 'ALL'
              }
              onValueChange={(value) =>
                handleFilterChange(
                  'isPublic',
                  value === 'PUBLIC'
                    ? true
                    : value === 'PRIVATE'
                      ? false
                      : undefined
                )
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Visibility' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Visibility</SelectItem>
                <SelectItem value='PUBLIC'>Public</SelectItem>
                <SelectItem value='PRIVATE'>Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teams ({pagination.totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Showcases</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className='py-8 text-center'>
                    Loading teams...
                  </TableCell>
                </TableRow>
              ) : teams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='py-8 text-center'>
                    No teams found
                  </TableCell>
                </TableRow>
              ) : (
                (Array.isArray(teams) ? teams : []).map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-2'>
                        {team.logo && (
                          <img
                            src={team.logo}
                            alt={team.name}
                            className='h-8 w-8 rounded-full object-cover'
                          />
                        )}
                        <div>
                          <div className='font-medium'>{team.name}</div>
                          <div className='line-clamp-1 text-sm text-muted-foreground'>
                            {team.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <User className='h-4 w-4 text-muted-foreground' />
                        <div>
                          <div className='text-sm font-medium'>
                            {team.owner.fullName}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {team.owner.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {team._count.members} members
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-wrap gap-1'>
                        {team.skills.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='text-xs'
                          >
                            {skill}
                          </Badge>
                        ))}
                        {team.skills.length > 3 && (
                          <Badge variant='secondary' className='text-xs'>
                            +{team.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {team._count.showcases} showcases
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getVerificationBadgeVariant(team.isVerified)}
                      >
                        {team.isVerified === true
                          ? 'VERIFIED'
                          : team.isVerified === false
                            ? 'NOT VERIFIED'
                            : 'PENDING'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getVisibilityBadgeVariant(team.isPublic)}>
                        {team.isPublic === true
                          ? 'PUBLIC'
                          : team.isPublic === false
                            ? 'PRIVATE'
                            : 'UNKNOWN'}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleView(team.id)}>
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(team.id)}>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {team.isVerified !== true && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleVerificationUpdate(team.id, 'VERIFIED')
                              }
                            >
                              <CheckCircle className='mr-2 h-4 w-4' />
                              Verify
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleVerificationUpdate(team.id, 'REJECTED')
                            }
                            className='text-red-600'
                          >
                            <XCircle className='mr-2 h-4 w-4' />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='flex items-center justify-between px-2 py-4'>
              <div className='flex-1 text-sm text-muted-foreground'>
                Showing {teams.length} of {pagination.totalCount} teams
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

export default TeamsPage
