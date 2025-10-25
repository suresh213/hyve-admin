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
  companyProfile: {
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
  }
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
    // For now, just navigate to view. Edit functionality can be added later
    navigate(`/companies/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        await AdminCompaniesApiService.deleteCompany(id)
        fetchCompanies()
      } catch (error) {
        console.error('Error deleting company:', error)
      }
    }
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

  const getVerificationBadgeVariant = (status: string) => {
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
    </div>
  )
}

export default CompaniesPage
