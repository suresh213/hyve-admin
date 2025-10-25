import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  X,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Briefcase,
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

import AdminFreelancersApiService, {
  AdminFreelancerUpdateData,
} from '@/service/adminFreelancersApi'

interface FreelancerProfile {
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
    website?: string
    linkedinUrl?: string
    githubUrl?: string
    twitterUrl?: string
    facebookUrl?: string
    instagramUrl?: string
  }
  freelancerProfile?: {
    skills: string[]
    experienceLevel?: string
    minimumBudget?: number
    maximumBudget?: number
    certifications: string[]
    willingToJoinTeams?: boolean
    preferredRolesInTeams?: string[]
    preferredRoles?: string[]
    aadharNumber?: string
    teamPreferences?: string
    currentTeamId?: string
  } | null
}

const FreelancerEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    avatar: '',
    bio: '',
    country: '',
    city: '',
    state: '',
    website: '',
    linkedinUrl: '',
    githubUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    skills: [] as string[],
    experienceLevel: '',
    minimumBudget: '',
    maximumBudget: '',
    certifications: [] as string[],
    willingToJoinTeams: false,
    preferredRolesInTeams: [] as string[],
    preferredRoles: [] as string[],
    aadharNumber: '',
    teamPreferences: '',
  })

  useEffect(() => {
    if (id) {
      fetchFreelancer()
    }
  }, [id])

  const fetchFreelancer = async () => {
    try {
      setLoading(true)
      const response = await AdminFreelancersApiService.getFreelancer(id!)
      setFreelancer(response)
      // Populate form data
      setFormData({
        fullName: response.fullName || '',
        email: response.email || '',
        avatar: response.profile?.avatar || '',
        bio: response.profile?.bio || '',
        country: response.profile?.country || '',
        city: response.profile?.city || '',
        state: response.profile?.state || '',
        website: response.profile?.website || '',
        linkedinUrl: response.profile?.linkedinUrl || '',
        githubUrl: response.profile?.githubUrl || '',
        twitterUrl: response.profile?.twitterUrl || '',
        facebookUrl: response.profile?.facebookUrl || '',
        instagramUrl: response.profile?.instagramUrl || '',
        skills: response.freelancerProfile?.skills || [],
        experienceLevel: response.freelancerProfile?.experienceLevel || '',
        minimumBudget:
          response.freelancerProfile?.minimumBudget?.toString() || '',
        maximumBudget:
          response.freelancerProfile?.maximumBudget?.toString() || '',
        certifications: response.freelancerProfile?.certifications || [],
        willingToJoinTeams:
          response.freelancerProfile?.willingToJoinTeams || false,
        preferredRolesInTeams:
          response.freelancerProfile?.preferredRolesInTeams || [],
        preferredRoles: response.freelancerProfile?.preferredRoles || [],
        aadharNumber: response.freelancerProfile?.aadharNumber || '',
        teamPreferences: response.freelancerProfile?.teamPreferences || '',
      })
    } catch (error) {
      console.error('Error fetching freelancer:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!id) return

    try {
      setSaving(true)
      const updateData: AdminFreelancerUpdateData = {
        fullName: formData.fullName,
        email: formData.email,
        profile: {
          avatar: formData.avatar || undefined,
          bio: formData.bio || undefined,
          country: formData.country || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          website: formData.website || undefined,
          linkedinUrl: formData.linkedinUrl || undefined,
          githubUrl: formData.githubUrl || undefined,
          twitterUrl: formData.twitterUrl || undefined,
          facebookUrl: formData.facebookUrl || undefined,
          instagramUrl: formData.instagramUrl || undefined,
        },
        freelancerProfile: {
          skills: formData.skills,
          experienceLevel: formData.experienceLevel || undefined,
          minimumBudget: formData.minimumBudget
            ? Number(formData.minimumBudget)
            : undefined,
          maximumBudget: formData.maximumBudget
            ? Number(formData.maximumBudget)
            : undefined,
          certifications: formData.certifications,
          willingToJoinTeams: formData.willingToJoinTeams,
          preferredRolesInTeams: formData.preferredRolesInTeams,
          preferredRoles: formData.preferredRoles,
          aadharNumber: formData.aadharNumber || undefined,
          teamPreferences: formData.teamPreferences || undefined,
        },
      }

      await AdminFreelancersApiService.updateFreelancer(id, updateData)
      navigate(`/freelancers/${id}`)
    } catch (error) {
      console.error('Error updating freelancer:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(`/freelancers/${id}`)
  }

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    setFormData((prev) => ({ ...prev, skills }))
  }

  const handleCertificationsChange = (value: string) => {
    const certifications = value
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
    setFormData((prev) => ({ ...prev, certifications }))
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
            onClick={() => navigate('/freelancers')}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Freelancers
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Edit Freelancer
            </h1>
            <p className='text-muted-foreground'>
              {freelancer?.fullName} ({freelancer?.email})
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
              <Briefcase className='mr-2 h-5 w-5' />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='fullName'>Full Name</Label>
                <Input
                  id='fullName'
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='bio'>Bio</Label>
              <Textarea
                id='bio'
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='avatar'>Avatar URL</Label>
              <Input
                id='avatar'
                value={formData.avatar}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, avatar: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <MapPin className='mr-2 h-5 w-5' />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='country'>Country</Label>
                <Input
                  id='country'
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='state'>State</Label>
                <Input
                  id='state'
                  value={formData.state}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, state: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='city'>City</Label>
              <Input
                id='city'
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='website'>Website</Label>
              <Input
                id='website'
                value={formData.website}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='linkedinUrl'>LinkedIn</Label>
              <Input
                id='linkedinUrl'
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    linkedinUrl: e.target.value,
                  }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='githubUrl'>GitHub</Label>
              <Input
                id='githubUrl'
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    githubUrl: e.target.value,
                  }))
                }
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='twitterUrl'>Twitter</Label>
                <Input
                  id='twitterUrl'
                  value={formData.twitterUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      twitterUrl: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='facebookUrl'>Facebook</Label>
                <Input
                  id='facebookUrl'
                  value={formData.facebookUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      facebookUrl: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Freelancer Profile */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Award className='mr-2 h-5 w-5' />
              Freelancer Profile
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
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

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='minimumBudget'>Min Budget ($)</Label>
                <Input
                  id='minimumBudget'
                  type='number'
                  value={formData.minimumBudget}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minimumBudget: e.target.value,
                    }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='maximumBudget'>Max Budget ($)</Label>
                <Input
                  id='maximumBudget'
                  type='number'
                  value={formData.maximumBudget}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maximumBudget: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='certifications'>
                Certifications (comma-separated)
              </Label>
              <Input
                id='certifications'
                value={formData.certifications.join(', ')}
                onChange={(e) => handleCertificationsChange(e.target.value)}
                placeholder='AWS Certified, Google Cloud'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='aadharNumber'>Aadhar Number</Label>
              <Input
                id='aadharNumber'
                value={formData.aadharNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aadharNumber: e.target.value,
                  }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='teamPreferences'>Team Preferences</Label>
              <Textarea
                id='teamPreferences'
                value={formData.teamPreferences}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    teamPreferences: e.target.value,
                  }))
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FreelancerEditPage
