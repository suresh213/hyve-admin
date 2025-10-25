import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export interface FormField {
  id: string
  label: string
  type:
    | 'text'
    | 'email'
    | 'tel'
    | 'password'
    | 'textarea'
    | 'select'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'switch'
    | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: (value: string) => string | null
  disabled?: boolean
  defaultValue?: any
  onChange?: (value: any) => void
}

interface GenericAddEditDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Record<string, any>) => Promise<void>
  title: string
  description?: string
  fields: FormField[]
  initialData?: Record<string, any>
  isEdit?: boolean
  submitButtonText?: string
  loading?: boolean
}

export default function GenericAddEditDialog({
  open,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  initialData = {},
  isEdit = false,
  submitButtonText,
  loading = false,
}: GenericAddEditDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      const initialFormData: Record<string, any> = {}
      fields.forEach((field) => {
        initialFormData[field.id] = initialData[field.id] || ''
      })
      setFormData(initialFormData)
      setErrors({})
    }
  }, [open, initialData, fields])

  const validateField = (field: FormField, value: string): string | null => {
    // Required validation
    if (field.required && !value.trim()) {
      return `${field.label} is required`
    }

    // Custom validation
    if (field.validation && value) {
      return field.validation(value)
    }

    // Built-in validations
    if (value) {
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            return 'Please enter a valid email address'
          }
          break
        case 'tel':
          const phoneRegex = /^\+?[\d\s-()]+$/
          if (!phoneRegex.test(value) || value.length < 10) {
            return 'Please enter a valid phone number'
          }
          break
        case 'number':
          if (isNaN(Number(value))) {
            return 'Please enter a valid number'
          }
          break
      }
    }

    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach((field) => {
      const error = validateField(field, formData[field.id] || '')
      if (error) {
        newErrors[field.id] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      toast({
        title: 'Success',
        description: `${isEdit ? 'Updated' : 'Created'} successfully`,
      })
      onClose()
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.message || `Failed to ${isEdit ? 'update' : 'create'}`,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ''
    const error = errors[field.id]

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className='space-y-2'>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className='ml-1 text-red-500'>*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              disabled={field.disabled || isSubmitting}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className='text-sm text-red-500'>{error}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className='space-y-2'>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className='ml-1 text-red-500'>*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleInputChange(field.id, val)}
              disabled={field.disabled || isSubmitting}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className='text-sm text-red-500'>{error}</p>}
          </div>
        )

      case 'switch':
        return (
          <div key={field.id} className='flex items-center space-x-2'>
            <Switch
              id={field.id}
              checked={value}
              onCheckedChange={(checked) =>
                handleInputChange(field.id, checked.toString())
              }
              disabled={field.disabled || isSubmitting}
            />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id={field.id}
              checked={value === 'true'}
              onChange={(e) =>
                handleInputChange(field.id, e.target.checked.toString())
              }
              disabled={field.disabled || isSubmitting}
            />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        )

      default:
        return (
          <div key={field.id} className='space-y-2'>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className='ml-1 text-red-500'>*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              disabled={field.disabled || isSubmitting}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className='text-sm text-red-500'>{error}</p>}
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {fields.map(renderField)}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting || loading}>
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {submitButtonText || (isEdit ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
