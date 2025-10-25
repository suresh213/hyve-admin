import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Copy, Edit, ExternalLink } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export interface ViewField {
  id: string
  label: string
  type?:
    | 'text'
    | 'email'
    | 'tel'
    | 'url'
    | 'badge'
    | 'date'
    | 'datetime'
    | 'number'
    | 'boolean'
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  badgeColorMap?: Record<string, string>
  copyable?: boolean
  linkable?: boolean
  format?: (value: any) => string
}

export interface ViewSection {
  title?: string
  fields: ViewField[]
}

interface GenericViewDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  data: Record<string, any>
  sections: ViewSection[]
  onEdit?: () => void
  showEditButton?: boolean
  editButtonText?: string
  actions?: React.ReactNode
}

export default function GenericViewDialog({
  open,
  onClose,
  title,
  description,
  data,
  sections,
  onEdit,
  showEditButton = false,
  editButtonText = 'Edit',
  actions,
}: GenericViewDialogProps) {
  const { toast } = useToast()

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast({
        title: 'Copied',
        description: `${label} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  const formatValue = (field: ViewField, value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A'
    }

    if (field.format) {
      return field.format(value)
    }

    switch (field.type) {
      case 'date':
        return new Date(value).toLocaleDateString()
      case 'datetime':
        return new Date(value).toLocaleString()
      case 'boolean':
        return value ? 'Yes' : 'No'
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value
      case 'email':
      case 'tel':
      case 'url':
      case 'text':
      default:
        return String(value)
    }
  }

  const getBadgeColor = (field: ViewField, value: any): string => {
    if (field.badgeColorMap && value) {
      return field.badgeColorMap[String(value)] || ''
    }
    return ''
  }

  const renderFieldValue = (field: ViewField, value: any) => {
    const formattedValue = formatValue(field, value)

    if (formattedValue === 'N/A') {
      return <span className='text-gray-400'>N/A</span>
    }

    switch (field.type) {
      case 'badge':
        const badgeColor = getBadgeColor(field, value)
        return (
          <Badge
            variant={field.badgeVariant || 'default'}
            className={badgeColor}
          >
            {formattedValue}
          </Badge>
        )

      case 'email':
        return (
          <div className='flex items-center gap-2'>
            <a
              href={`mailto:${value}`}
              className='text-primary hover:underline'
            >
              {formattedValue}
            </a>
            {field.copyable && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => copyToClipboard(value, field.label)}
                className='h-6 w-6 p-0'
              >
                <Copy className='h-3 w-3' />
              </Button>
            )}
          </div>
        )

      case 'tel':
        return (
          <div className='flex items-center gap-2'>
            <a href={`tel:${value}`} className='text-primary hover:underline'>
              {formattedValue}
            </a>
            {field.copyable && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => copyToClipboard(value, field.label)}
                className='h-6 w-6 p-0'
              >
                <Copy className='h-3 w-3' />
              </Button>
            )}
          </div>
        )

      case 'url':
        return (
          <div className='flex items-center gap-2'>
            <a
              href={value}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 text-primary hover:underline'
            >
              {formattedValue}
              <ExternalLink className='h-3 w-3' />
            </a>
            {field.copyable && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => copyToClipboard(value, field.label)}
                className='h-6 w-6 p-0'
              >
                <Copy className='h-3 w-3' />
              </Button>
            )}
          </div>
        )

      default:
        return (
          <div className='flex items-center gap-2'>
            <span>{formattedValue}</span>
            {field.copyable && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => copyToClipboard(value, field.label)}
                className='h-6 w-6 p-0'
              >
                <Copy className='h-3 w-3' />
              </Button>
            )}
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-h-[80vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className='space-y-6'>
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <>
                  <h3 className='mb-3 text-sm font-medium text-gray-900'>
                    {section.title}
                  </h3>
                  {sectionIndex > 0 && <Separator className='mb-4' />}
                </>
              )}

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {section.fields.map((field) => (
                  <div key={field.id} className='space-y-1'>
                    <dt className='text-sm font-medium text-gray-500'>
                      {field.label}
                    </dt>
                    <dd className='text-sm text-gray-900'>
                      {renderFieldValue(field, data[field.id])}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className='gap-2'>
          {actions}
          {showEditButton && onEdit && (
            <Button onClick={onEdit}>
              <Edit className='mr-2 h-4 w-4' />
              {editButtonText}
            </Button>
          )}
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
