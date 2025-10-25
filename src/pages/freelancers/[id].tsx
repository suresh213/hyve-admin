import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Trash2,
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import AdminFreelancersApiService from '@/service/adminFreelancersApi'

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
  freelancerProfile: {
    skills: string[]
    experienceLevel?: string
    minimumBudget?: number
    maximumBudget?: number
    certifications: string[]
    willingToJoinTeams: boolean
    preferredRoles: string[]
    preferredRolesInTeams: string[]
    aadharNumber?: string
    teamPreferences?: any
  }
  showcases: Array<{
    id: string
    title: string
    description: string
    thumbnail: string
    type: string
    links: string[]
    createdAt: string
  }>
  educations: Array<{
    id: string
    institute: string
    degree: string
    degreeSpecialization?: string
    startYear: string
    graduationYear: string
    type: string
  }>
  workExperiences: Array<{
    id: string
    company: string
    role: string
    description?: string
    startDate: string
    endDate?: string
    location?: string
    skills: string[]
    isCurrent: boolean
  }>
}

const FreelancerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null)
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      console.error('Error fetching freelancer:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this freelancer?')) {
      try {
        await AdminFreelancersApiService.deleteFreelancer(id!)
        navigate('/freelancers')
      } catch (error) {
        console.error('Error deleting freelancer:', error)
      }
    }
  }

  const handleStatusUpdate = async (updates: any) => {
    try {
      await AdminFreelancersApiService.updateFreelancerStatus(id!, updates)
      fetchFreelancer()
    } catch (error) {
      console.error('Error updating freelancer status:', error)
    }
  }

  if (loading) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>
            Loading freelancer details...
          </div>
        </div>
      </div>
    )
  }

  if (!freelancer) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>Freelancer not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' onClick={() => navigate('/freelancers')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Freelancers
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {freelancer.fullName}
            </h2>
            <p className='text-muted-foreground'>{freelancer.email}</p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            onClick={() =>
              handleStatusUpdate({ emailVerified: !freelancer.emailVerified })
            }
          >
            {freelancer.emailVerified ? (
              <>
                <XCircle className='mr-2 h-4 w-4' />
                Mark Unverified
              </>
            ) : (
              <>
                <CheckCircle className='mr-2 h-4 w-4' />
                Mark Verified
              </>
            )}
          </Button>
          <Button
            variant='outline'
            onClick={() => navigate(`/freelancers/${id}/edit`)}
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
            <div className='flex items-center space-x-2'>
              <Badge variant={freelancer.emailVerified ? 'default' : 'outline'}>
                {freelancer.emailVerified ? 'Verified' : 'Unverified'}
              </Badge>
              {freelancer.mobileVerified && (
                <Badge variant='secondary'>Mobile Verified</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Experience Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                freelancer.freelancerProfile.experienceLevel === 'Expert'
                  ? 'default'
                  : freelancer.freelancerProfile.experienceLevel ===
                      'Intermediate'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {freelancer.freelancerProfile.experienceLevel || 'Not set'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Budget Range</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {freelancer.freelancerProfile.minimumBudget &&
              freelancer.freelancerProfile.maximumBudget
                ? `$${freelancer.freelancerProfile.minimumBudget} - $${freelancer.freelancerProfile.maximumBudget}`
                : 'Not set'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Member Since</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {new Date(freelancer.createdAt).getFullYear()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-2'>
              {freelancer.profile?.avatar ? (
                <img
                  src={freelancer.profile.avatar}
                  alt={freelancer.fullName}
                  className='h-16 w-16 rounded-full'
                />
              ) : (
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gray-200'>
                  {freelancer.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className='text-lg font-semibold'>{freelancer.fullName}</h3>
                <p className='text-muted-foreground'>{freelancer.email}</p>
                {freelancer.profile?.bio && (
                  <p className='mt-1 text-sm'>{freelancer.profile.bio}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className='space-y-2'>
              <div className='flex items-center space-x-2 text-sm'>
                <MapPin className='h-4 w-4' />
                <span>
                  {freelancer.profile?.city && freelancer.profile?.country
                    ? `${freelancer.profile.city}, ${freelancer.profile.country}`
                    : freelancer.profile?.country || 'Location not set'}
                </span>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <Calendar className='h-4 w-4' />
                <span>
                  Joined {new Date(freelancer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Social Links */}
            {(freelancer.profile?.website ||
              freelancer.profile?.linkedinUrl ||
              freelancer.profile?.githubUrl ||
              freelancer.profile?.twitterUrl) && (
              <>
                <Separator />
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium'>Social Links</h4>
                  <div className='flex flex-wrap gap-2'>
                    {freelancer.profile.website && (
                      <Badge variant='outline'>
                        <a
                          href={freelancer.profile.website}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Website
                        </a>
                      </Badge>
                    )}
                    {freelancer.profile.linkedinUrl && (
                      <Badge variant='outline'>
                        <a
                          href={freelancer.profile.linkedinUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          LinkedIn
                        </a>
                      </Badge>
                    )}
                    {freelancer.profile.githubUrl && (
                      <Badge variant='outline'>
                        <a
                          href={freelancer.profile.githubUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          GitHub
                        </a>
                      </Badge>
                    )}
                    {freelancer.profile.twitterUrl && (
                      <Badge variant='outline'>
                        <a
                          href={freelancer.profile.twitterUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Twitter
                        </a>
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Skills and Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Preferences</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Skills */}
            <div>
              <h4 className='mb-2 text-sm font-medium'>Skills</h4>
              <div className='flex flex-wrap gap-2'>
                {freelancer.freelancerProfile.skills.map((skill) => (
                  <Badge key={skill} variant='secondary'>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Experience Level */}
            <div>
              <h4 className='mb-2 text-sm font-medium'>Experience Level</h4>
              <Badge
                variant={
                  freelancer.freelancerProfile.experienceLevel === 'Expert'
                    ? 'default'
                    : freelancer.freelancerProfile.experienceLevel ===
                        'Intermediate'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {freelancer.freelancerProfile.experienceLevel ||
                  'Not specified'}
              </Badge>
            </div>

            {/* Budget Range */}
            <div>
              <h4 className='mb-2 text-sm font-medium'>Budget Range</h4>
              <div className='text-sm'>
                {freelancer.freelancerProfile.minimumBudget &&
                freelancer.freelancerProfile.maximumBudget ? (
                  <span>
                    ${freelancer.freelancerProfile.minimumBudget} - $
                    {freelancer.freelancerProfile.maximumBudget}
                  </span>
                ) : (
                  <span className='text-muted-foreground'>Not specified</span>
                )}
              </div>
            </div>

            {/* Team Preferences */}
            <div>
              <h4 className='mb-2 text-sm font-medium'>Team Collaboration</h4>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Badge
                    variant={
                      freelancer.freelancerProfile.willingToJoinTeams
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {freelancer.freelancerProfile.willingToJoinTeams
                      ? 'Open to teams'
                      : 'Individual only'}
                  </Badge>
                </div>
                {freelancer.freelancerProfile.preferredRoles.length > 0 && (
                  <div>
                    <p className='mb-1 text-xs text-muted-foreground'>
                      Preferred Roles
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {freelancer.freelancerProfile.preferredRoles.map(
                        (role) => (
                          <Badge
                            key={role}
                            variant='outline'
                            className='text-xs'
                          >
                            {role}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            {freelancer.freelancerProfile.certifications.length > 0 && (
              <div>
                <h4 className='mb-2 text-sm font-medium'>Certifications</h4>
                <div className='flex flex-wrap gap-2'>
                  {freelancer.freelancerProfile.certifications.map((cert) => (
                    <Badge
                      key={cert}
                      variant='outline'
                      className='flex items-center space-x-1'
                    >
                      <Award className='h-3 w-3' />
                      <span>{cert}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Work Experience */}
      {freelancer.workExperiences.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Briefcase className='h-5 w-5' />
              <span>Work Experience</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {freelancer.workExperiences.map((experience) => (
                <div key={experience.id} className='rounded-lg border p-4'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <h4 className='font-medium'>{experience.role}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {experience.company}
                      </p>
                      <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                        <Calendar className='h-3 w-3' />
                        <span>
                          {new Date(experience.startDate).toLocaleDateString()}{' '}
                          -{' '}
                          {experience.isCurrent
                            ? 'Present'
                            : experience.endDate
                              ? new Date(
                                  experience.endDate
                                ).toLocaleDateString()
                              : 'End date not specified'}
                        </span>
                        {experience.location && (
                          <>
                            <span>•</span>
                            <MapPin className='h-3 w-3' />
                            <span>{experience.location}</span>
                          </>
                        )}
                      </div>
                      {experience.description && (
                        <p className='mt-2 text-sm'>{experience.description}</p>
                      )}
                    </div>
                    {experience.isCurrent && (
                      <Badge variant='secondary' className='text-xs'>
                        Current
                      </Badge>
                    )}
                  </div>
                  {experience.skills.length > 0 && (
                    <div className='mt-2'>
                      <div className='flex flex-wrap gap-1'>
                        {experience.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant='outline'
                            className='text-xs'
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {freelancer.educations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {freelancer.educations.map((education) => (
                <div key={education.id} className='rounded-lg border p-4'>
                  <div className='space-y-1'>
                    <h4 className='font-medium'>{education.degree}</h4>
                    {education.degreeSpecialization && (
                      <p className='text-sm text-muted-foreground'>
                        {education.degreeSpecialization}
                      </p>
                    )}
                    <p className='text-sm font-medium'>{education.institute}</p>
                    <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                      <Calendar className='h-3 w-3' />
                      <span>
                        {education.startYear} - {education.graduationYear}
                      </span>
                      <span>•</span>
                      <Badge variant='outline' className='text-xs'>
                        {education.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Showcases */}
      {freelancer.showcases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Showcases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {freelancer.showcases.map((showcase) => (
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
    </div>
  )
}

export default FreelancerDetailsPage
