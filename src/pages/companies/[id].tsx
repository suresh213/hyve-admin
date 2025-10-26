import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
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
import { Skeleton } from '@/components/ui/skeleton'

import AdminCompaniesApiService, {
  AdminCompanyUpdateData,
} from '@/service/adminCompaniesApi'

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

const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchCompany()
    }
  }, [id])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      const companyData = await AdminCompaniesApiService.getCompany(id!)
      setCompany(companyData)
    } catch (error) {
      console.error('Error fetching company:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await AdminCompaniesApiService.deleteCompany(id!)
      setDeleteDialogOpen(false)
      navigate('/companies')
    } catch (error) {
      console.error('Error deleting company:', error)
    }
  }

  const handleVerificationUpdate = async (status: 'VERIFIED' | 'REJECTED') => {
    try {
      const updateData: AdminCompanyUpdateData = {
        verificationStatus: status,
      }
      await AdminCompaniesApiService.updateCompany(id!, updateData)
      await fetchCompany()
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

  if (!company) {
    return (
      <div className='flex-1 space-y-4 p-6'>
        <div className='text-center'>Company not found</div>
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
            onClick={() => navigate('/companies')}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Companies
          </Button>
          <div className='flex items-center space-x-2'>
            {company.companyProfile?.logo && (
              <img
                src={company.companyProfile.logo}
                alt={company.companyProfile.name}
                className='h-10 w-10 rounded-lg object-cover'
              />
            )}
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>
                {company.companyProfile?.name || 'Company Details'}
              </h1>
              <p className='text-muted-foreground'>{company.email}</p>
            </div>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
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

      {/* Status and Actions */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Badge
                variant={getVerificationBadgeVariant(
                  company.companyProfile?.verificationStatus
                )}
              >
                {company.companyProfile?.verificationStatus || 'Unknown'}
              </Badge>
              <span className='text-sm text-muted-foreground'>
                {company.companyProfile?.isRegistered
                  ? 'Legally Registered'
                  : 'Not Registered'}
              </span>
            </div>
            {company.companyProfile?.verificationStatus !== 'VERIFIED' && (
              <div className='flex items-center space-x-2'>
                <Button
                  size='sm'
                  onClick={() => handleVerificationUpdate('VERIFIED')}
                >
                  <CheckCircle className='mr-2 h-4 w-4' />
                  Verify
                </Button>
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleVerificationUpdate('REJECTED')}
                >
                  <XCircle className='mr-2 h-4 w-4' />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Details */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Building2 className='mr-2 h-5 w-5' />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Company Name
              </label>
              <p className='text-sm'>
                {company.companyProfile?.name || 'Not provided'}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Contact Person
              </label>
              <p className='text-sm'>
                {company.companyProfile?.contactPersonName || 'Not provided'}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Contact Email
              </label>
              <p className='text-sm'>
                {company.companyProfile?.contactPersonEmail || 'Not provided'}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Industry Type
              </label>
              <p className='text-sm'>
                {company.companyProfile?.industryType || 'Not provided'}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Company Size
              </label>
              <p className='text-sm'>
                {company.companyProfile?.companySize || 'Not provided'}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                GSTIN
              </label>
              <p className='text-sm'>
                {company.companyProfile?.gstin || 'Not provided'}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Budget Range
              </label>
              <p className='text-sm'>
                {company.companyProfile?.budgetRange || 'Not provided'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Location</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>{company.email}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <MapPin className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>
                {company.profile?.city && company.profile?.country
                  ? `${company.profile.city}, ${company.profile.country}`
                  : 'Location not provided'}
              </span>
            </div>
            {company.profile?.website && (
              <div className='flex items-center space-x-2'>
                <Globe className='h-4 w-4 text-muted-foreground' />
                <a
                  href={company.profile.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-blue-600 hover:underline'
                >
                  {company.profile.website}
                </a>
              </div>
            )}
            <Separator />
            <div>
              <label className='mb-2 block text-sm font-medium text-muted-foreground'>
                Social Links
              </label>
              <div className='space-y-1'>
                {company.companyProfile?.linkedinUrl && (
                  <a
                    href={company.companyProfile.linkedinUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block text-sm text-blue-600 hover:underline'
                  >
                    LinkedIn
                  </a>
                )}
                {company.companyProfile?.twitterUrl && (
                  <a
                    href={company.companyProfile.twitterUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block text-sm text-blue-600 hover:underline'
                  >
                    Twitter
                  </a>
                )}
                {company.companyProfile?.facebookUrl && (
                  <a
                    href={company.companyProfile.facebookUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block text-sm text-blue-600 hover:underline'
                  >
                    Facebook
                  </a>
                )}
                {company.companyProfile?.instagramUrl && (
                  <a
                    href={company.companyProfile.instagramUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block text-sm text-blue-600 hover:underline'
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Required */}
      {company.companyProfile?.skillsRequired &&
        company.companyProfile.skillsRequired.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {company.companyProfile.skillsRequired.map((skill, index) => (
                  <Badge key={index} variant='secondary'>
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Account Created
              </label>
              <p className='text-sm'>
                {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Last Updated
              </label>
              <p className='text-sm'>
                {new Date(company.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Email Verified
              </label>
              <p className='text-sm'>{company.emailVerified ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Mobile Verified
              </label>
              <p className='text-sm'>{company.mobileVerified ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className='font-semibold'>
                {company?.companyProfile?.name || company?.fullName || 'this company'}
              </span>
              ? This action cannot be undone.
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

export default CompanyDetailsPage
