import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  UserPlus,
  MapPin,
  Calendar,
  Globe,
  Mail,
  Award,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import AdminTeamsApiService from '@/service/adminTeamsApi'

interface TeamProfile {
  id: string
  name: string
  headline?: string
  description?: string
  skills: string[]
  website?: string
  banner?: string
  logo?: string
  requiredRoles: string[]
  allowRequests: boolean
  contactEmail?: string
  isPublic: boolean
  isVerified: boolean
  isActive: boolean
  activelyLookingFor: string[]
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    fullName: string
    email: string
    profile?: {
      avatar?: string
      location?: string
      country?: string
      city?: string
    }
  }
  members: Array<{
    id: string
    role: string
    status: string
    joinedAt: string
    user: {
      id: string
      fullName: string
      email: string
      profile?: {
        avatar?: string
        bio?: string
        skills?: string[]
      }
      freelancerProfile?: {
        skills: string[]
        experienceLevel?: string
      }
    }
  }>
  invitations: Array<{
    id: string
    email: string
    message?: string
    status: string
    role: string
    type: string
    createdAt: string
    sentBy: {
      id: string
      fullName: string
      email: string
    }
  }>
  showcases: Array<{
    id: string
    title: string
    description: string
    thumbnail: string
    type: string
    links: string[]
    createdAt: string
  }>
}

const TeamDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [team, setTeam] = useState<TeamProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchTeam()
    }
  }, [id])

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const response = await AdminTeamsApiService.getTeam(id!)
      setTeam(response.data)
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await AdminTeamsApiService.deleteTeam(id!)
        navigate('/teams')
      } catch (error) {
        console.error('Error deleting team:', error)
      }
    }
  }

  const handleStatusUpdate = async (updates: {
    isVerified?: boolean
    isActive?: boolean
  }) => {
    try {
      await AdminTeamsApiService.updateTeamStatus(id!, updates)
      fetchTeam()
    } catch (error) {
      console.error('Error updating team status:', error)
    }
  }

  if (loading) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>Loading team details...</div>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>Team not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' onClick={() => navigate('/teams')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Teams
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{team.name}</h2>
            <p className='text-muted-foreground'>{team.contactEmail}</p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          {!team.isVerified && (
            <Button
              variant='outline'
              onClick={() => handleStatusUpdate({ isVerified: true })}
            >
              <CheckCircle className='mr-2 h-4 w-4' />
              Verify
            </Button>
          )}
          {team.isVerified && (
            <Button
              variant='outline'
              onClick={() => handleStatusUpdate({ isVerified: false })}
            >
              <XCircle className='mr-2 h-4 w-4' />
              Unverify
            </Button>
          )}
          {team.isActive && (
            <Button
              variant='outline'
              onClick={() => handleStatusUpdate({ isActive: false })}
            >
              <XCircle className='mr-2 h-4 w-4' />
              Deactivate
            </Button>
          )}
          {!team.isActive && (
            <Button
              variant='outline'
              onClick={() => handleStatusUpdate({ isActive: true })}
            >
              <CheckCircle className='mr-2 h-4 w-4' />
              Activate
            </Button>
          )}
          <Button
            variant='outline'
            onClick={() => navigate(`/teams/${id}/edit`)}
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

      {/* Profile Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col space-y-1'>
              <Badge variant={team.isVerified ? 'default' : 'outline'}>
                {team.isVerified ? 'Verified' : 'Unverified'}
              </Badge>
              <Badge variant={team.isActive ? 'secondary' : 'destructive'}>
                {team.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {team.isPublic && (
                <Badge variant='outline' className='text-xs'>
                  Public
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Members</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{team.members.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Showcases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{team.showcases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Founded</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {new Date(team.createdAt).getFullYear()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-2'>
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                  className='h-16 w-16 rounded'
                />
              ) : (
                <div className='flex h-16 w-16 items-center justify-center rounded bg-gray-200'>
                  <Users className='h-8 w-8' />
                </div>
              )}
              <div>
                <h3 className='text-lg font-semibold'>{team.name}</h3>
                {team.headline && (
                  <p className='text-muted-foreground'>{team.headline}</p>
                )}
                {team.description && (
                  <p className='mt-1 text-sm'>{team.description}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className='space-y-2'>
              <div className='flex items-center space-x-2 text-sm'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span>{team.contactEmail || 'No contact email'}</span>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span>
                  Created {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>
              {team.website && (
                <div className='flex items-center space-x-2 text-sm'>
                  <Globe className='h-4 w-4 text-muted-foreground' />
                  <a
                    href={team.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    {team.website}
                  </a>
                </div>
              )}
            </div>

            {/* Skills */}
            <div>
              <h4 className='mb-2 text-sm font-medium'>Skills</h4>
              <div className='flex flex-wrap gap-1'>
                {team.skills.map((skill) => (
                  <Badge key={skill} variant='secondary' className='text-xs'>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Looking For */}
            <div>
              <h4 className='mb-2 text-sm font-medium'>Looking For</h4>
              <div className='flex flex-wrap gap-1'>
                {team.activelyLookingFor.map((role) => (
                  <Badge key={role} variant='outline' className='text-xs'>
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Required Roles */}
            <div>
              <h4 className='mb-2 text-sm font-medium'>Required Roles</h4>
              <div className='flex flex-wrap gap-1'>
                {team.requiredRoles.map((role) => (
                  <Badge key={role} variant='outline' className='text-xs'>
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle>Team Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-3'>
              {team.owner.profile?.avatar ? (
                <img
                  src={team.owner.profile.avatar}
                  alt={team.owner.fullName}
                  className='h-12 w-12 rounded-full'
                />
              ) : (
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
                  {team.owner.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className='font-medium'>{team.owner.fullName}</h4>
                <p className='text-sm text-muted-foreground'>
                  {team.owner.email}
                </p>
                {team.owner.profile?.location && (
                  <div className='mt-1 flex items-center space-x-1 text-xs text-muted-foreground'>
                    <MapPin className='h-3 w-3' />
                    <span>{team.owner.profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Users className='h-5 w-5' />
            <span>Team Members ({team.members.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {team.members.map((member) => (
              <div key={member.id} className='rounded-lg border p-4'>
                <div className='mb-3 flex items-center space-x-3'>
                  {member.user.profile?.avatar ? (
                    <img
                      src={member.user.profile.avatar}
                      alt={member.user.fullName}
                      className='h-10 w-10 rounded-full'
                    />
                  ) : (
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                      {member.user.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className='flex-1'>
                    <h4 className='font-medium'>{member.user.fullName}</h4>
                    <p className='text-sm text-muted-foreground'>
                      {member.user.email}
                    </p>
                  </div>
                  <Badge
                    variant={
                      member.role === 'OWNER'
                        ? 'default'
                        : member.role === 'ADMIN'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {member.role}
                  </Badge>
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                    <Calendar className='h-3 w-3' />
                    <span>
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {member.user.profile?.bio && (
                    <p className='text-sm'>{member.user.profile.bio}</p>
                  )}
                  {member.user.freelancerProfile?.skills &&
                    member.user.freelancerProfile.skills.length > 0 && (
                      <div className='flex flex-wrap gap-1'>
                        {member.user.freelancerProfile.skills
                          .slice(0, 3)
                          .map((skill) => (
                            <Badge
                              key={skill}
                              variant='outline'
                              className='text-xs'
                            >
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Showcases */}
      {team.showcases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Team Showcases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {team.showcases.map((showcase) => (
                <div key={showcase.id} className='rounded-lg border p-4'>
                  <div className='space-y-2'>
                    {showcase.thumbnail && (
                      <img
                        src={showcase.thumbnail}
                        alt={showcase.title}
                        className='h-32 w-full rounded object-cover'
                      />
                    )}
                    <div>
                      <h4 className='font-medium'>{showcase.title}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {showcase.description}
                      </p>
                      <Badge variant='outline' className='mt-1 text-xs'>
                        {showcase.type}
                      </Badge>
                    </div>
                    {showcase.links.length > 0 && (
                      <div className='flex flex-wrap gap-1'>
                        {showcase.links.map((link, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='text-xs'
                          >
                            <a
                              href={link}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Link {index + 1}
                            </a>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invitations */}
      {team.invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {team.invitations.map((invitation) => (
                <div key={invitation.id} className='rounded-lg border p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                      <p className='font-medium'>{invitation.email}</p>
                      <p className='text-sm text-muted-foreground'>
                        Invited by {invitation.sentBy.fullName}
                      </p>
                      <Badge variant='outline'>{invitation.role}</Badge>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {new Date(invitation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {invitation.message && (
                    <p className='mt-2 text-sm'>{invitation.message}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TeamDetailsPage
