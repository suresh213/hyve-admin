import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  X,
  FolderOpen,
  User,
  Users,
  DollarSign,
  Calendar,
  Clock,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

import AdminProjectsApiService, {
  AdminProjectUpdateData,
} from '@/service/adminProjectsApi'

interface ProjectProfile {
  id: string
  title: string
  description?: string
  status: string
  totalAmount: number
  startDate?: string
  endDate?: string
  clientId: string
  freelancerId?: string
  teamId?: string
  skills: string[]
  requirements?: string
  deliverables?: string
  adminNote?: string
  createdAt: string
  updatedAt: string
  client: {
    id: string
    fullName: string
    email: string
  }
  freelancer?: {
    id: string
    fullName: string
    email: string
  }
  team?: {
    id: string
    name: string
  }
}

const ProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    totalAmount: '',
    startDate: '',
    endDate: '',
    skills: [] as string[],
    requirements: '',
    deliverables: '',
    adminNote: '',
  })

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await AdminProjectsApiService.getProject(id!)
      setProject(response)
      // Populate form data
      setFormData({
        title: response.title || '',
        description: response.description || '',
        status: response.status || '',
        totalAmount: response.totalAmount?.toString() || '',
        startDate: response.startDate
          ? new Date(response.startDate).toISOString().split('T')[0]
          : '',
        endDate: response.endDate
          ? new Date(response.endDate).toISOString().split('T')[0]
          : '',
        skills: response.skills || [],
        requirements: response.requirements || '',
        deliverables: response.deliverables || '',
        adminNote: response.adminNote || '',
      })
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!id) return

    try {
      setSaving(true)
      const updateData: AdminProjectUpdateData = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        totalAmount: formData.totalAmount ? Number(formData.totalAmount) : 0,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        skills: formData.skills,
        requirements: formData.requirements || undefined,
        deliverables: formData.deliverables || undefined,
        adminNote: formData.adminNote || undefined,
      }

      await AdminProjectsApiService.updateProject(id, updateData)
      navigate(`/projects/${id}`)
    } catch (error) {
      console.error('Error updating project:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(`/projects/${id}`)
  }

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    setFormData((prev) => ({ ...prev, skills }))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'IN_PROGRESS':
        return 'secondary'
      case 'COMPLETED':
        return 'default'
      case 'CANCELLED':
        return 'destructive'
      case 'ON_HOLD':
        return 'outline'
      default:
        return 'outline'
    }
  }

  if (loading) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-10 w-10' />
          <Skeleton className='h-8 w-48' />
        </div>
        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Projects
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Edit Project</h1>
            <p className='text-muted-foreground'>
              {project?.title} -{' '}
              <Badge variant={getStatusBadgeVariant(project?.status || '')}>
                {project?.status}
              </Badge>
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' onClick={handleCancel}>
            <X className='mr-2 h-4 w-4' />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className='mr-2 h-4 w-4' />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <FolderOpen className='mr-2 h-5 w-5' />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Project Title</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select project status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ACTIVE'>Active</SelectItem>
                  <SelectItem value='IN_PROGRESS'>In Progress</SelectItem>
                  <SelectItem value='COMPLETED'>Completed</SelectItem>
                  <SelectItem value='CANCELLED'>Cancelled</SelectItem>
                  <SelectItem value='ON_HOLD'>On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='totalAmount'>Total Amount ($)</Label>
              <Input
                id='totalAmount'
                type='number'
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    totalAmount: e.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Dates & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Calendar className='mr-2 h-5 w-5' />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='startDate'>Start Date</Label>
                <Input
                  id='startDate'
                  type='date'
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='endDate'>End Date</Label>
                <Input
                  id='endDate'
                  type='date'
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='skills'>Required Skills (comma-separated)</Label>
              <Input
                id='skills'
                value={formData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder='React, Node.js, TypeScript'
              />
            </div>
          </CardContent>
        </Card>

        {/* Requirements & Deliverables */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements & Deliverables</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='requirements'>Requirements</Label>
              <Textarea
                id='requirements'
                value={formData.requirements}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requirements: e.target.value,
                  }))
                }
                rows={4}
                placeholder='List the project requirements...'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='deliverables'>Deliverables</Label>
              <Textarea
                id='deliverables'
                value={formData.deliverables}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deliverables: e.target.value,
                  }))
                }
                rows={4}
                placeholder='List the expected deliverables...'
              />
            </div>
          </CardContent>
        </Card>

        {/* Admin Notes & Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Notes & Assignment</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='adminNote'>Admin Note</Label>
              <Textarea
                id='adminNote'
                value={formData.adminNote}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    adminNote: e.target.value,
                  }))
                }
                rows={3}
                placeholder='Internal notes for administrators...'
              />
            </div>

            <Separator />

            <div>
              <Label className='mb-2 block text-sm font-medium text-muted-foreground'>
                Current Assignment
              </Label>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <User className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>
                    Client:{' '}
                    <span className='font-medium'>
                      {project?.client?.fullName}
                    </span>
                  </span>
                </div>
                {project?.freelancer && (
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>
                      Freelancer:{' '}
                      <span className='font-medium'>
                        {project.freelancer.fullName}
                      </span>
                    </span>
                  </div>
                )}
                {project?.team && (
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>
                      Team:{' '}
                      <span className='font-medium'>{project.team.name}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className='mb-2 block text-sm font-medium text-muted-foreground'>
                Project Status
              </Label>
              <Badge variant={getStatusBadgeVariant(formData.status)}>
                {formData.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProjectEditPage

