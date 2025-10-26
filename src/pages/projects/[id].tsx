import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  User,
  Calendar,
  MessageSquare,
  FolderOpen,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import AdminProjectsApiService from '@/service/adminProjectsApi'

interface ProjectProfile {
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
    mobileNumber?: string
    companyProfile?: {
      name: string
      logo?: string
      isRegistered: boolean
      contactPersonName: string
      industryType?: string
      companySize?: string
      gstin?: string
      verificationStatus: string
    }
    profile?: {
      avatar?: string
      bio?: string
      location?: string
      country?: string
      city?: string
      state?: string
    }
  }
  freelancer?: {
    id: string
    fullName: string
    email: string
    mobileNumber?: string
    profile?: {
      avatar?: string
      bio?: string
      location?: string
      country?: string
      city?: string
      state?: string
    }
    freelancerProfile?: {
      skills: string[]
      experienceLevel?: string
      minimumBudget?: number
      maximumBudget?: number
      certifications: string[]
    }
  }
  team?: {
    id: string
    name: string
    logo?: string
    banner?: string
    description?: string
    skills: string[]
    owner: {
      id: string
      fullName: string
      email: string
    }
    members: Array<{
      user: {
        id: string
        fullName: string
        email: string
      }
      role: string
    }>
  }
  task: {
    id: string
    title: string
    description: string
    skills: string[]
    budgetMin?: number
    budgetMax?: number
    deadline?: string
    createdBy: {
      id: string
      fullName: string
      email: string
    }
  }
  application: {
    id: string
    applicationType: string
    status: string
    proposedBudget?: number
    message?: string
    createdAt: string
    applicant?: {
      id: string
      fullName: string
      email: string
    }
    team?: {
      id: string
      name: string
    }
  }
  quotation?: {
    id: string
    totalAmount: number
    status: string
    pdfUrl?: string
    createdAt: string
  }
  contract?: {
    id: string
    status: string
    pdfUrl?: string
    totalAmount?: number
    freelancerSignedUrl?: string
    clientSignedUrl?: string
    createdAt: string
  }
  milestones: Array<{
    id: string
    title: string
    description: string
    timeline: string
    amount: number
    percentage: number
    order: number
    status: string
  }>
  discussions: Array<{
    id: string
    message: string
    createdAt: string
    sender: {
      id: string
      fullName: string
      email: string
      profile?: {
        avatar?: string
      }
    }
  }>
}

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await AdminProjectsApiService.deleteProject(id!)
      setDeleteDialogOpen(false)
      navigate('/projects')
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleStatusUpdate = async (status: string) => {
    try {
      await AdminProjectsApiService.updateProjectStatus(id!, { status })
      fetchProject()
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

  if (loading) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>
            Loading project details...
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>Project not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' onClick={() => navigate('/projects')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Projects
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {project.title}
            </h2>
            <p className='text-muted-foreground'>{project.task.title}</p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          {project.status !== 'COMPLETED' && (
            <Button
              variant='outline'
              onClick={() => handleStatusUpdate('COMPLETED')}
            >
              <CheckCircle className='mr-2 h-4 w-4' />
              Mark Completed
            </Button>
          )}
          {project.status !== 'CANCELLED' && (
            <Button
              variant='outline'
              onClick={() => handleStatusUpdate('CANCELLED')}
            >
              <XCircle className='mr-2 h-4 w-4' />
              Cancel Project
            </Button>
          )}
          <Button
            variant='outline'
            onClick={() => navigate(`/projects/${id}/edit`)}
          >
            <Edit className='mr-2 h-4 w-4' />
            Edit
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {project.status.replace(/_/g, ' ')}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Amount</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {project.totalAmount
                ? `$${project.totalAmount.toLocaleString()}`
                : 'Not set'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {project.milestones.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Discussions</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {project.discussions.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <h4 className='mb-2 font-medium'>Description</h4>
              <p className='text-sm text-muted-foreground'>
                {project.description}
              </p>
            </div>

            <Separator />

            <div className='grid gap-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Start Date</span>
                <span className='text-sm'>
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : 'Not set'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>End Date</span>
                <span className='text-sm'>
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : 'Not set'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Created</span>
                <span className='text-sm'>
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div>
              <h4 className='mb-2 font-medium'>Required Skills</h4>
              <div className='flex flex-wrap gap-1'>
                {project.task.skills.map((skill) => (
                  <Badge key={skill} variant='secondary' className='text-xs'>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mb-4 flex items-center space-x-3'>
              {project.client.companyProfile?.logo ? (
                <img
                  src={project.client.companyProfile.logo}
                  alt={project.client.companyProfile.name}
                  className='h-12 w-12 rounded'
                />
              ) : (
                <div className='flex h-12 w-12 items-center justify-center rounded bg-gray-200'>
                  <User className='h-6 w-6' />
                </div>
              )}
              <div>
                <h4 className='font-medium'>{project.client.fullName}</h4>
                <p className='text-sm text-muted-foreground'>
                  {project.client.email}
                </p>
                {project.client.companyProfile?.name && (
                  <p className='text-sm text-muted-foreground'>
                    {project.client.companyProfile.name}
                  </p>
                )}
              </div>
            </div>

            {project.client.companyProfile && (
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Badge
                    variant={
                      project.client.companyProfile.verificationStatus ===
                      'VERIFIED'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {project.client.companyProfile.verificationStatus}
                  </Badge>
                  {project.client.companyProfile.isRegistered && (
                    <Badge variant='secondary'>Registered</Badge>
                  )}
                </div>
                {project.client.companyProfile.industryType && (
                  <p className='text-sm text-muted-foreground'>
                    Industry: {project.client.companyProfile.industryType}
                  </p>
                )}
                {project.client.companyProfile.companySize && (
                  <p className='text-sm text-muted-foreground'>
                    Size: {project.client.companyProfile.companySize}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Freelancer/Team Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            {project.team
              ? 'Assigned Team'
              : project.freelancer
                ? 'Assigned Freelancer'
                : 'Not Assigned'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.team ? (
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                {project.team.logo ? (
                  <img
                    src={project.team.logo}
                    alt={project.team.name}
                    className='h-12 w-12 rounded'
                  />
                ) : (
                  <div className='flex h-12 w-12 items-center justify-center rounded bg-gray-200'>
                    <Users className='h-6 w-6' />
                  </div>
                )}
                <div>
                  <h4 className='font-medium'>{project.team.name}</h4>
                  <p className='text-sm text-muted-foreground'>Team</p>
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <h5 className='mb-2 text-sm font-medium'>Team Skills</h5>
                  <div className='flex flex-wrap gap-1'>
                    {project.team.skills.map((skill) => (
                      <Badge key={skill} variant='outline' className='text-xs'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className='mb-2 text-sm font-medium'>Team Owner</h5>
                  <p className='text-sm'>{project.team.owner.fullName}</p>
                  <p className='text-sm text-muted-foreground'>
                    {project.team.owner.email}
                  </p>
                </div>
              </div>
            </div>
          ) : project.freelancer ? (
            <div className='space-y-4'>
              <div className='flex items-center space-x-3'>
                {project.freelancer.profile?.avatar ? (
                  <img
                    src={project.freelancer.profile.avatar}
                    alt={project.freelancer.fullName}
                    className='h-12 w-12 rounded-full'
                  />
                ) : (
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
                    {project.freelancer.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className='font-medium'>{project.freelancer.fullName}</h4>
                  <p className='text-sm text-muted-foreground'>
                    {project.freelancer.email}
                  </p>
                  {project.freelancer.freelancerProfile?.experienceLevel && (
                    <Badge variant='outline' className='mt-1 text-xs'>
                      {project.freelancer.freelancerProfile.experienceLevel}
                    </Badge>
                  )}
                </div>
              </div>

              {project.freelancer.freelancerProfile?.skills && (
                <div>
                  <h5 className='mb-2 text-sm font-medium'>Skills</h5>
                  <div className='flex flex-wrap gap-1'>
                    {project.freelancer.freelancerProfile.skills.map(
                      (skill) => (
                        <Badge
                          key={skill}
                          variant='outline'
                          className='text-xs'
                        >
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className='text-muted-foreground'>
              No freelancer or team assigned to this project.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Application Details */}
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <h5 className='mb-2 text-sm font-medium'>Application Type</h5>
              <Badge
                variant={
                  project.application.applicationType === 'TEAM'
                    ? 'default'
                    : 'secondary'
                }
              >
                {project.application.applicationType}
              </Badge>
            </div>
            <div>
              <h5 className='mb-2 text-sm font-medium'>Status</h5>
              <Badge variant='outline'>{project.application.status}</Badge>
            </div>
            {project.application.proposedBudget && (
              <div>
                <h5 className='mb-2 text-sm font-medium'>Proposed Budget</h5>
                <p className='text-sm'>
                  ${project.application.proposedBudget.toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <h5 className='mb-2 text-sm font-medium'>Applied On</h5>
              <p className='text-sm'>
                {new Date(project.application.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {project.application.message && (
            <div className='mt-4'>
              <h5 className='mb-2 text-sm font-medium'>Application Message</h5>
              <p className='text-sm text-muted-foreground'>
                {project.application.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      {project.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <FolderOpen className='h-5 w-5' />
              <span>Milestones ({project.milestones.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {project.milestones.map((milestone, index) => (
                <div key={milestone.id} className='rounded-lg border p-4'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Badge variant='outline'>#{index + 1}</Badge>
                        <h4 className='font-medium'>{milestone.title}</h4>
                        <Badge
                          variant={
                            milestone.status === 'COMPLETED'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        {milestone.description}
                      </p>
                      <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                        <div className='flex items-center space-x-1'>
                          <Calendar className='h-3 w-3' />
                          <span>
                            {new Date(milestone.timeline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <DollarSign className='h-3 w-3' />
                          <span>${milestone.amount.toLocaleString()}</span>
                        </div>
                        <span>({milestone.percentage}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discussions */}
      {project.discussions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <MessageSquare className='h-5 w-5' />
              <span>Discussions ({project.discussions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {project.discussions.map((discussion) => (
                <div key={discussion.id} className='rounded-lg border p-4'>
                  <div className='flex items-start space-x-3'>
                    <div className='flex-shrink-0'>
                      {discussion.sender.profile?.avatar ? (
                        <img
                          src={discussion.sender.profile.avatar}
                          alt={discussion.sender.fullName}
                          className='h-8 w-8 rounded-full'
                        />
                      ) : (
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs'>
                          {discussion.sender.fullName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='mb-1 flex items-center space-x-2'>
                        <span className='text-sm font-medium'>
                          {discussion.sender.fullName}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {new Date(discussion.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className='text-sm'>{discussion.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className='font-semibold'>
                {project?.title || 'this project'}
              </span>
              ? This action cannot be undone and will remove all project data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectDetailsPage
