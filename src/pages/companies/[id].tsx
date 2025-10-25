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
  Building2,
  Mail,
  Phone,
  Globe,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import AdminCompaniesApiService from '@/service/adminCompaniesApi'

interface CompanyProfile {
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
    documents?: string[]
  }
}

const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchCompany()
    }
  }, [id])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      const response = await AdminCompaniesApiService.getCompany(id!)
      setCompany(response.data)
    } catch (error) {
      console.error('Error fetching company:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        await AdminCompaniesApiService.deleteCompany(id!)
        navigate('/companies')
      } catch (error) {
        console.error('Error deleting company:', error)
      }
    }
  }

  const handleVerificationUpdate = async (status: 'VERIFIED' | 'REJECTED') => {
    try {
      await AdminCompaniesApiService.updateCompanyVerification(id!, {
        verificationStatus: status,
        remarks: `Status updated to ${status} by admin`,
      })
      fetchCompany()
    } catch (error) {
      console.error('Error updating company verification:', error)
    }
  }

  if (loading) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>
            Loading company details...
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>Company not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' onClick={() => navigate('/companies')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Companies
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {company.companyProfile.name}
            </h2>
            <p className='text-muted-foreground'>{company.email}</p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          {company.companyProfile.verificationStatus !== 'VERIFIED' && (
            <Button
              variant='outline'
              onClick={() => handleVerificationUpdate('VERIFIED')}
            >
              <CheckCircle className='mr-2 h-4 w-4' />
              Approve
            </Button>
          )}
          {company.companyProfile.verificationStatus !== 'REJECTED' && (
            <Button
              variant='outline'
              onClick={() => handleVerificationUpdate('REJECTED')}
            >
              <XCircle className='mr-2 h-4 w-4' />
              Reject
            </Button>
          )}
          <Button
            variant='outline'
            onClick={() => navigate(`/companies/${id}/edit`)}
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
              <Badge
                variant={
                  company.companyProfile.verificationStatus === 'VERIFIED'
                    ? 'default'
                    : 'outline'
                }
              >
                {company.companyProfile.verificationStatus}
              </Badge>
              {company.companyProfile.isRegistered && (
                <Badge variant='secondary'>Registered</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Industry</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant='outline'>
              {company.companyProfile.industryType || 'Not specified'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Company Size</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {company.companyProfile.companySize || 'Not set'}
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
              {new Date(company.createdAt).getFullYear()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-2'>
              {company.companyProfile.logo ? (
                <img
                  src={company.companyProfile.logo}
                  alt={company.companyProfile.name}
                  className='h-16 w-16 rounded'
                />
              ) : (
                <div className='flex h-16 w-16 items-center justify-center rounded bg-gray-200'>
                  <Building2 className='h-8 w-8' />
                </div>
              )}
              <div>
                <h3 className='text-lg font-semibold'>
                  {company.companyProfile.name}
                </h3>
                <p className='text-muted-foreground'>{company.email}</p>
              </div>
            </div>

            <Separator />

            <div className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  {company.companyProfile.contactPersonEmail || 'Not provided'}
                </span>
              </div>

              <div className='flex items-center space-x-2'>
                <MapPin className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  {company.profile?.city && company.profile?.country
                    ? `${company.profile.city}, ${company.profile.country}`
                    : company.profile?.country || 'Location not set'}
                </span>
              </div>

              <div className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  Joined {new Date(company.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Social Links */}
            {(company.companyProfile.website ||
              company.companyProfile.linkedinUrl ||
              company.companyProfile.twitterUrl ||
              company.companyProfile.facebookUrl) && (
              <>
                <Separator />
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium'>Links</h4>
                  <div className='flex flex-wrap gap-2'>
                    {company.companyProfile.website && (
                      <Badge variant='outline'>
                        <a
                          href={company.companyProfile.website}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Globe className='mr-1 h-3 w-3' />
                          Website
                        </a>
                      </Badge>
                    )}
                    {company.companyProfile.linkedinUrl && (
                      <Badge variant='outline'>
                        <a
                          href={company.companyProfile.linkedinUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          LinkedIn
                        </a>
                      </Badge>
                    )}
                    {company.companyProfile.twitterUrl && (
                      <Badge variant='outline'>
                        <a
                          href={company.companyProfile.twitterUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Twitter
                        </a>
                      </Badge>
                    )}
                    {company.companyProfile.facebookUrl && (
                      <Badge variant='outline'>
                        <a
                          href={company.companyProfile.facebookUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Facebook
                        </a>
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4'>
              <div>
                <h4 className='mb-2 text-sm font-medium'>Contact Person</h4>
                <p className='text-sm'>
                  {company.companyProfile.contactPersonName}
                </p>
              </div>

              <div>
                <h4 className='mb-2 text-sm font-medium'>Industry</h4>
                <Badge variant='outline'>
                  {company.companyProfile.industryType || 'Not specified'}
                </Badge>
              </div>

              <div>
                <h4 className='mb-2 text-sm font-medium'>Company Size</h4>
                <p className='text-sm'>
                  {company.companyProfile.companySize || 'Not specified'}
                </p>
              </div>

              <div>
                <h4 className='mb-2 text-sm font-medium'>Budget Range</h4>
                <p className='text-sm'>
                  {company.companyProfile.budgetRange || 'Not specified'}
                </p>
              </div>

              {company.companyProfile.gstin && (
                <div>
                  <h4 className='mb-2 text-sm font-medium'>GSTIN</h4>
                  <p className='font-mono text-sm'>
                    {company.companyProfile.gstin}
                  </p>
                </div>
              )}

              <div>
                <h4 className='mb-2 text-sm font-medium'>Skills Required</h4>
                <div className='flex flex-wrap gap-1'>
                  {company.companyProfile.skillsRequired.map((skill) => (
                    <Badge key={skill} variant='secondary' className='text-xs'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {company.companyProfile.documents &&
                company.companyProfile.documents.length > 0 && (
                  <div>
                    <h4 className='mb-2 text-sm font-medium'>Documents</h4>
                    <div className='space-y-1'>
                      {company.companyProfile.documents.map((doc, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-xs'
                        >
                          <a
                            href={doc}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            Document {index + 1}
                          </a>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CompanyDetailsPage
