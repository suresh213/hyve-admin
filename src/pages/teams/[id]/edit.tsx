import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X, Users, User, Target, Award } from 'lucide-react'

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

import AdminTeamsApiService, {
  AdminTeamUpdateData,
} from '@/service/adminTeamsApi'

interface TeamProfile {
  id: string
  name: string
  description?: string
  skills: string[]
  ownerId: string
  owner: {
    id: string
    fullName: string
    email: string
  }
  members: Array<{
    id: string
    fullName: string
    email: string
    role: string
  }>
  isVerified: boolean
  isActive: boolean
  isPublic: boolean
  maxMembers?: number
  projectPreferences?: string
  experienceLevel?: string
  availability?: string
  createdAt: string
  updatedAt: string
}

const TeamEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [team, setTeam] = useState<TeamProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    skills: [] as string[],
    isVerified: false,
    isActive: true,
    isPublic: false,
    maxMembers: '',
    projectPreferences: '',
    experienceLevel: '',
    availability: '',
  })

  useEffect(() => {
    if (id) {
      fetchTeam()
    }
  }, [id])

  const fetchTeam = async () => {
    try {
      setLoading(true)
      const response = await AdminTeamsApiService.getTeam(id!)
      setTeam(response)
      // Populate form data
      setFormData({
        name: response.name || '',
        description: response.description || '',
        skills: response.skills || [],
        isVerified: response.isVerified || false,
        isActive: response.isActive !== undefined ? response.isActive : true,
        isPublic: response.isPublic || false,
        maxMembers: response.maxMembers?.toString() || '',
        projectPreferences: response.projectPreferences || '',
        experienceLevel: response.experienceLevel || '',
        availability: response.availability || '',
      })
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!id) return

    try {
      setSaving(true)
      const updateData: AdminTeamUpdateData = {
        name: formData.name,
        description: formData.description || undefined,
        skills: formData.skills,
        isVerified: formData.isVerified,
        isActive: formData.isActive,
        isPublic: formData.isPublic,
        maxMembers: formData.maxMembers
          ? Number(formData.maxMembers)
          : undefined,
        projectPreferences: formData.projectPreferences || undefined,
        experienceLevel: formData.experienceLevel || undefined,
        availability: formData.availability || undefined,
      }

      await AdminTeamsApiService.updateTeam(id, updateData)
      navigate(`/teams/${id}`)
    } catch (error) {
      console.error('Error updating team:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(`/teams/${id}`)
  }

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    setFormData((prev) => ({ ...prev, skills }))
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
            onClick={() => navigate('/teams')}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Teams
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Edit Team</h1>
            <p className='text-muted-foreground'>
              {team?.name} (Owner: {team?.owner?.fullName})
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
              <Users className='mr-2 h-5 w-5' />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Team Name</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
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
              <Label htmlFor='skills'>Skills (comma-separated)</Label>
              <Input
                id='skills'
                value={formData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder='React, Node.js, TypeScript'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='maxMembers'>Max Members</Label>
              <Input
                id='maxMembers'
                type='number'
                value={formData.maxMembers}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxMembers: e.target.value,
                  }))
                }
                placeholder='10'
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Target className='mr-2 h-5 w-5' />
              Preferences & Settings
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='experienceLevel'>Experience Level</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, experienceLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select experience level' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='beginner'>Beginner</SelectItem>
                  <SelectItem value='intermediate'>Intermediate</SelectItem>
                  <SelectItem value='experienced'>Experienced</SelectItem>
                  <SelectItem value='expert'>Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='availability'>Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, availability: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select availability' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='full-time'>Full Time</SelectItem>
                  <SelectItem value='part-time'>Part Time</SelectItem>
                  <SelectItem value='freelance'>Freelance</SelectItem>
                  <SelectItem value='project-based'>Project Based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='projectPreferences'>Project Preferences</Label>
              <Textarea
                id='projectPreferences'
                value={formData.projectPreferences}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectPreferences: e.target.value,
                  }))
                }
                rows={3}
                placeholder='Describe the types of projects this team prefers...'
              />
            </div>
          </CardContent>
        </Card>

        {/* Status & Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Award className='mr-2 h-5 w-5' />
              Status & Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isVerified'
                checked={formData.isVerified}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVerified: e.target.checked,
                  }))
                }
                className='rounded border-gray-300'
              />
              <Label htmlFor='isVerified'>Verified Team</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isActive'
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className='rounded border-gray-300'
              />
              <Label htmlFor='isActive'>Active Team</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isPublic'
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
                className='rounded border-gray-300'
              />
              <Label htmlFor='isPublic'>Public Team</Label>
            </div>

            <Separator />

            <div>
              <Label className='mb-2 block text-sm font-medium text-muted-foreground'>
                Current Status
              </Label>
              <div className='flex gap-2'>
                <Badge variant={formData.isVerified ? 'default' : 'secondary'}>
                  {formData.isVerified ? 'Verified' : 'Unverified'}
                </Badge>
                <Badge variant={formData.isActive ? 'default' : 'destructive'}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant={formData.isPublic ? 'default' : 'outline'}>
                  {formData.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <User className='mr-2 h-5 w-5' />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {team?.members && team.members.length > 0 ? (
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-muted-foreground'>
                  Current Members ({team.members.length})
                </Label>
                <div className='space-y-2'>
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className='flex items-center justify-between rounded border p-2'
                    >
                      <div>
                        <p className='text-sm font-medium'>{member.fullName}</p>
                        <p className='text-xs text-muted-foreground'>
                          {member.email}
                        </p>
                      </div>
                      <Badge variant='outline'>{member.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                No members in this team yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TeamEditPage

