import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
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

const CompanyEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    name: '',
    logo: '',
    isRegistered: false,
    contactPersonName: '',
    contactPersonEmail: '',
    industryType: '',
    companySize: '',
    skillsRequired: [] as string[],
    budgetRange: '',
    gstin: '',
    country: '',
    city: '',
    state: '',
    website: '',
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    instagramUrl: '',
  })

  useEffect(() => {
    if (id) {
      fetchCompany()
    }
  }, [id])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      const response = await AdminCompaniesApiService.getCompany(id!)
      setCompany(response)
      // Populate form data
      setFormData({
        fullName: response.fullName || '',
        email: response.email || '',
        name: response.companyProfile?.name || '',
        logo: response.companyProfile?.logo || '',
        isRegistered: response.companyProfile?.isRegistered || false,
        contactPersonName: response.companyProfile?.contactPersonName || '',
        contactPersonEmail: response.companyProfile?.contactPersonEmail || '',
        industryType: response.companyProfile?.industryType || '',
        companySize: response.companyProfile?.companySize || '',
        skillsRequired: response.companyProfile?.skillsRequired || [],
        budgetRange: response.companyProfile?.budgetRange || '',
        gstin: response.companyProfile?.gstin || '',
        country: response.profile?.country || '',
        city: response.profile?.city || '',
        state: response.profile?.state || '',
        website: response.profile?.website || '',
        linkedinUrl: response.companyProfile?.linkedinUrl || '',
        twitterUrl: response.companyProfile?.twitterUrl || '',
        facebookUrl: response.companyProfile?.facebookUrl || '',
        instagramUrl: response.companyProfile?.instagramUrl || '',
      })
    } catch (error) {
      console.error('Error fetching company:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!id) return

    try {
      setSaving(true)
      const updateData: AdminCompanyUpdateData = {
        fullName: formData.fullName,
        email: formData.email,
        profile: {
          country: formData.country || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          website: formData.website || undefined,
        },
        companyProfile: {
          name: formData.name,
          logo: formData.logo || undefined,
          isRegistered: formData.isRegistered,
          contactPersonName: formData.contactPersonName,
          contactPersonEmail: formData.contactPersonEmail || undefined,
          industryType: formData.industryType || undefined,
          companySize: formData.companySize || undefined,
          skillsRequired: formData.skillsRequired,
          budgetRange: formData.budgetRange || undefined,
          gstin: formData.gstin || undefined,
          linkedinUrl: formData.linkedinUrl || undefined,
          twitterUrl: formData.twitterUrl || undefined,
          facebookUrl: formData.facebookUrl || undefined,
          instagramUrl: formData.instagramUrl || undefined,
        },
      }

      await AdminCompaniesApiService.updateCompany(id, updateData)
      navigate(`/companies/${id}`)
    } catch (error) {
      console.error('Error updating company:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(`/companies/${id}`)
  }

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    setFormData((prev) => ({ ...prev, skillsRequired: skills }))
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
            onClick={() => navigate('/companies')}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Companies
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Edit Company</h1>
            <p className='text-muted-foreground'>
              {company?.companyProfile?.name || company?.fullName} (
              {company?.email})
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
              <Building2 className='mr-2 h-5 w-5' />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='fullName'>Account Name</Label>
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
              <Label htmlFor='name'>Company Name</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='logo'>Logo URL</Label>
              <Input
                id='logo'
                value={formData.logo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, logo: e.target.value }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='contactPersonName'>Contact Person Name</Label>
              <Input
                id='contactPersonName'
                value={formData.contactPersonName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactPersonName: e.target.value,
                  }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='contactPersonEmail'>Contact Person Email</Label>
              <Input
                id='contactPersonEmail'
                type='email'
                value={formData.contactPersonEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactPersonEmail: e.target.value,
                  }))
                }
              />
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isRegistered'
                checked={formData.isRegistered}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isRegistered: e.target.checked,
                  }))
                }
                className='rounded border-gray-300'
              />
              <Label htmlFor='isRegistered'>Legally Registered Company</Label>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='industryType'>Industry Type</Label>
              <Select
                value={formData.industryType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, industryType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select industry type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='technology'>Technology</SelectItem>
                  <SelectItem value='finance'>Finance</SelectItem>
                  <SelectItem value='healthcare'>Healthcare</SelectItem>
                  <SelectItem value='education'>Education</SelectItem>
                  <SelectItem value='retail'>Retail</SelectItem>
                  <SelectItem value='manufacturing'>Manufacturing</SelectItem>
                  <SelectItem value='consulting'>Consulting</SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='companySize'>Company Size</Label>
              <Select
                value={formData.companySize}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, companySize: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select company size' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1-10'>1-10 employees</SelectItem>
                  <SelectItem value='11-50'>11-50 employees</SelectItem>
                  <SelectItem value='51-200'>51-200 employees</SelectItem>
                  <SelectItem value='201-500'>201-500 employees</SelectItem>
                  <SelectItem value='501-1000'>501-1000 employees</SelectItem>
                  <SelectItem value='1000+'>1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='budgetRange'>Budget Range</Label>
              <Input
                id='budgetRange'
                value={formData.budgetRange}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    budgetRange: e.target.value,
                  }))
                }
                placeholder='$10,000 - $50,000'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='gstin'>GSTIN</Label>
              <Input
                id='gstin'
                value={formData.gstin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, gstin: e.target.value }))
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

        {/* Skills & Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements & Links</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='skillsRequired'>
                Skills Required (comma-separated)
              </Label>
              <Input
                id='skillsRequired'
                value={formData.skillsRequired.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder='React, Node.js, Python'
              />
            </div>

            <Separator />

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

            <div className='space-y-2'>
              <Label htmlFor='instagramUrl'>Instagram</Label>
              <Input
                id='instagramUrl'
                value={formData.instagramUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    instagramUrl: e.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CompanyEditPage
