import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { Loader2, Edit3 } from 'lucide-react'
import ticketsApiService from '@/service/ticketsApi'

interface TicketUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: any
  onUpdate: (updatedTicket?: any) => void
}

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open', variant: 'destructive' as const },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    variant: 'secondary' as const,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  { value: 'CLOSED', label: 'Closed', variant: 'default' as const },
  {
    value: 'CANCELLED',
    label: 'Cancelled',
    variant: 'secondary' as const,
  },
  {
    value: 'DECLINED',
    label: 'Declined',
    variant: 'secondary' as const,
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  {
    value: 'REOPENED',
    label: 'Reopened',
    variant: 'secondary' as const,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
]

export function TicketUpdateDialog({
  open,
  onOpenChange,
  ticket,
  onUpdate,
}: TicketUpdateDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    status: ticket?.status || 'OPEN',
    statusRemark: ticket?.statusRemark || '',
  })

  // Update form data when ticket changes
  useEffect(() => {
    if (ticket) {
      console.log('Ticket data received in dialog:', ticket)
      console.log('Current form data:', formData)
      setFormData({
        status: ticket.status || 'OPEN',
        statusRemark: ticket.statusRemark || '',
      })
    }
  }, [ticket])

  // Debug when dialog opens
  useEffect(() => {
    if (open && ticket) {
      console.log('Dialog opened with ticket:', ticket)
      console.log('Form data initialized as:', formData)
    }
  }, [open, ticket])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ticket?.id) {
      toast({
        title: 'Error',
        description: 'Ticket ID not found',
        variant: 'destructive',
      })
      return
    }

    console.log('Submitting ticket update with data:', formData)

    try {
      setLoading(true)

      const updateData = {
        opType: 'STATUS' as const,
        status: formData.status,
        statusRemark: formData.statusRemark,
      }

      console.log('Sending update data:', updateData)

      const updatedTicket = await ticketsApiService.updateTicket(
        ticket.id,
        updateData
      )

      console.log('Ticket updated successfully:', updatedTicket)

      toast({
        title: 'Success',
        description: 'Ticket updated successfully',
      })

      onUpdate(updatedTicket)
      onOpenChange(false)
    } catch (error: any) {
      console.error('Ticket update error in dialog:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update ticket',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleRemarkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, statusRemark: e.target.value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Edit3 className='h-5 w-5' />
            Update Ticket
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Current Ticket Info */}
          <Card className='border-muted bg-muted/50'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-foreground'>
                Current Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {/* Category and Type - moved to top */}
              {ticket?.ticketCat && (
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-medium text-foreground'>
                    Category:
                  </span>
                  <Badge
                    variant='outline'
                    className='border-primary/20 bg-primary/5 text-primary'
                  >
                    {ticket.ticketCat}
                  </Badge>
                </div>
              )}
              <div className='flex items-center gap-2'>
                <span className='text-xs text-muted-foreground'>Type:</span>
                <Badge
                  variant='secondary'
                  className='bg-destructive/10 text-destructive'
                >
                  {ticket?.type || 'GENERIC'}
                </Badge>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-muted-foreground'>
                  Current Status:
                </span>
                <Badge
                  variant={
                    ticket?.status === 'OPEN' ? 'destructive' : 'secondary'
                  }
                >
                  {ticket?.status || 'OPEN'}
                </Badge>
              </div>
              {ticket?.ticketDesc && (
                <div>
                  <span className='text-xs text-muted-foreground'>
                    Description:
                  </span>
                  <p className='mt-1 text-sm text-foreground'>
                    {ticket.ticketDesc}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Update Form */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='status'>New Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant={status.variant}
                          className={status.className}
                        >
                          {status.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='statusRemark'>Status Remark</Label>
              <Textarea
                id='statusRemark'
                placeholder='Add a remark about this status change...'
                value={formData.statusRemark}
                onChange={handleRemarkChange}
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Updating...
                </>
              ) : (
                'Update Ticket'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
