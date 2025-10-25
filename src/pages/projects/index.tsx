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
  Clock,
  DollarSign,
  Users,
  User,
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

import AdminProjectsApiService, {
  AdminProjectSearchParams,
} from '@/service/adminProjectsApi'
import { useNavigate } from 'react-router-dom'

interface Project {
  id: string
  title: string
  description: string
  status: string
  totalAmount?: number
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
  client: {
    id: string
    fullName: string
    email: string
    companyProfile?: {
      name: string
      logo?: string
    }
  }
  freelancer?: {
    id: string
    fullName: string
    email: string
    profile?: {
      avatar?: string
    }
    freelancerProfile?: {
      experienceLevel?: string
    }
  }
  team?: {
    id: string
    name: string
    logo?: string
  }
  task: {
    id: string
    title: string
    skills: string[]
  }
  application: {
    id: string
    applicationType: string
    proposedBudget?: number
  }
  _count: {
    discussions: number
    milestones: number
  }
}

interface ProjectsResponse {
  data: Project[]
  totalCount: number
  currentPage: number
  totalPages: number
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<AdminProjectSearchParams>({
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

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response: ProjectsResponse =
        await AdminProjectsApiService.getProjects(filters)
      setProjects(Array.isArray(response.data) ? response.data : [])
      setPagination({
        currentPage: response.currentPage,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
      })
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [filters])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters((prev) => ({ ...prev, title: value || undefined, page: 1 }))
  }

  // Handle filter changes
  const handleFilterChange = (
    key: keyof AdminProjectSearchParams,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  // Handle project actions
  const handleView = (id: string) => {
    navigate(`/projects/${id}`)
  }

  const handleEdit = (id: string) => {
    // For now, just navigate to view. Edit functionality can be added later
    navigate(`/projects/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await AdminProjectsApiService.deleteProject(id)
        fetchProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await AdminProjectsApiService.updateProjectStatus(id, { status })
      fetchProjects()
    } catch (error) {
      console.error('Error updating project status:', error)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default'
      case 'IN_PROGRESS':
        return 'secondary'
      case 'CANCELLED':
        return 'destructive'
      case 'CONTRACT_SIGNED':
        return 'default'
      case 'CONTRACT_PENDING':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600'
      case 'IN_PROGRESS':
        return 'text-blue-600'
      case 'CANCELLED':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatAmount = (amount?: number) => {
    return amount ? `$${amount.toLocaleString()}` : 'Not set'
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
        <div className='flex items-center space-x-2'>
          <Button onClick={() => fetchProjects()}>Refresh</Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
