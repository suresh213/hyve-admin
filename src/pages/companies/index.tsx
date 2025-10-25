import React, { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Building2,
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

import AdminCompaniesApiService, {
  AdminCompanySearchParams,
} from '@/service/adminCompaniesApi'
import { useNavigate } from 'react-router-dom'

interface Company {
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
  companyProfile?: {
    name: string
    logo?: string
    isRegistered: boolean
    contactPersonName: string
    contactPersonEmail?: string
    industryType?: string
    companySize?: string
    skillsRequired: string[]
    budgetRange?: string
    gstin?: string
    verificationStatus: string
    twitterUrl?: string
    facebookUrl?: string
    instagramUrl?: string
    linkedinUrl?: string
  } | null
}

interface CompaniesResponse {
  data: Company[]
  totalCount: number
  currentPage: number
  totalPages: number
}

const CompaniesPage: React.FC = () => {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<AdminCompanySearchParams>({
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

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const response: CompaniesResponse =
        await AdminCompaniesApiService.getCompanies(filters)
      setCompanies(Array.isArray(response.data) ? response.data : [])
      setPagination({
        currentPage: response.currentPage,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
      })
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [filters])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters((prev) => ({ ...prev, name: value || undefined, page: 1 }))
  }

  // Handle filter changes
  const handleFilterChange = (
    key: keyof AdminCompanySearchParams,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  // Handle company actions
  const handleView = (id: string) => {
    navigate(`/companies/${id}`)
  }

  const handleEdit = (id: string) => {
    // For now, navigate to view. Edit functionality can be added later
    navigate(`/companies/${id}`)
  }

  const handleVerificationUpdate = async (
    id: string,
    status: 'VERIFIED' | 'REJECTED'
  ) => {
    try {
      await AdminCompaniesApiService.updateCompanyVerification(id, {
        verificationStatus: status,
        remarks: `Status updated to ${status} by admin`,
      })
      fetchCompanies()
    } catch (error) {
      console.error('Error updating company verification:', error)
    }
  }

  const getVerificationBadgeVariant = (status: string | undefined) => {
    switch (status) {
      case 'VERIFIED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'REJECTED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Companies</h2>
        <div className='flex items-center space-x-2'>
          <Button onClick={() => fetchCompanies()}>Refresh</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Companies
            </CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pagination.totalCount}</div>
            <p className='text-xs text-muted-foreground'>
              Registered companies
            </p>
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
                (Array.isArray(companies) ? companies : []).filter(
                  (c) => c.companyProfile?.verificationStatus === 'VERIFIED'
                ).length
              }
            </div>
            <p className='text-xs text-muted-foreground'>Verified companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pending</CardTitle>
            <XCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {
                (Array.isArray(companies) ? companies : []).filter(
                  (c) => c.companyProfile?.verificationStatus === 'PENDING'
                ).length
              }
            </div>
            <p className='text-xs text-muted-foreground'>
              Pending verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Registered</CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {
                (Array.isArray(companies) ? companies : []).filter(
                  (c) => c.companyProfile?.isRegistered
                ).length
              }
            </div>
            <p className='text-xs text-muted-foreground'>Legally registered</p>
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
                placeholder='Search by company name or email...'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className='w-full'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Companies ({pagination.totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center'>
                    Loading companies...
                  </TableCell>
                </TableRow>
              ) : (Array.isArray(companies) ? companies : []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center'>
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                (Array.isArray(companies) ? companies : []).map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-2'>
                        {company.companyProfile?.logo && (
                          <img
                            src={company.companyProfile.logo}
                            alt={company.companyProfile.name}
                            className='h-8 w-8 rounded object-cover'
                          />
                        )}
                        <span>{company.companyProfile?.name || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.companyProfile?.contactPersonName || 'N/A'}
                    </TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {company.companyProfile?.industryType || 'Not set'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>
                        {company.companyProfile?.companySize || 'Not set'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getVerificationBadgeVariant(
                          company.companyProfile?.verificationStatus
                        )}
                      >
                        {company.companyProfile?.verificationStatus ||
                          'Unknown'}
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
                          <DropdownMenuItem
                            onClick={() => handleView(company.id)}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(company.id)}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {company.companyProfile?.verificationStatus !==
                            'VERIFIED' && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleVerificationUpdate(company.id, 'VERIFIED')
                              }
                            >
                              <CheckCircle className='mr-2 h-4 w-4' />
                              Verify
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleVerificationUpdate(company.id, 'REJECTED')
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
                Showing {(Array.isArray(companies) ? companies : []).length} of{' '}
                {pagination.totalCount} companies
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

export default CompaniesPage
