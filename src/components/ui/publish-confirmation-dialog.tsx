import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LinkedAccount } from '@/types/linkedin'
import { LinkedinIcon, Loader2, Send } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PublishConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (selectedAccountId?: string) => void
  post: any
  linkedAccounts: LinkedAccount[]
  publishing: boolean
}

const PublishConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  post,
  linkedAccounts,
  publishing,
}: PublishConfirmationDialogProps) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')

  // Auto-select first account if only one is available
  useEffect(() => {
    if (linkedAccounts && linkedAccounts.length === 1) {
      setSelectedAccountId(linkedAccounts[0].id)
    } else if (
      linkedAccounts &&
      linkedAccounts.length > 0 &&
      !selectedAccountId
    ) {
      setSelectedAccountId('')
    }
  }, [linkedAccounts])

  const selectedAccount = linkedAccounts?.find(
    (acc) => acc.id === selectedAccountId
  )

  const handleConfirm = () => {
    onConfirm(selectedAccountId)
  }

  const getContentPreview = (content: string) => {
    if (!content) return 'No content'
    return content.length > 150 ? content.substring(0, 150) + '...' : content
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='dark:bg-gray-900 sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100'>
            <LinkedinIcon className='h-5 w-5 text-[#0A66C2]' />
            Confirm Publish
          </DialogTitle>
          <DialogDescription className='text-gray-600 dark:text-gray-300'>
            Your post will be published immediately to LinkedIn
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Account Selection */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Select LinkedIn Account
            </label>
            <Select
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
            >
              <SelectTrigger className='h-15 w-full dark:border-gray-700 dark:bg-gray-800'>
                <SelectValue placeholder='Choose an account to publish to'>
                  {selectedAccount && (
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={
                            selectedAccount.picture ||
                            selectedAccount.profileData
                              ?.profile_picture_url_large
                          }
                          alt={selectedAccount.name}
                        />
                        <AvatarFallback className='text-xs'>
                          {selectedAccount.name?.charAt(0) || 'L'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col items-start'>
                        <span className='font-medium'>
                          {selectedAccount.name}
                        </span>
                        {selectedAccount.profileData?.headline && (
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {selectedAccount.profileData.headline.length > 60
                              ? selectedAccount.profileData.headline.substring(
                                  0,
                                  60
                                ) + '...'
                              : selectedAccount.profileData.headline}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className='dark:border-gray-700 dark:bg-gray-800'>
                {linkedAccounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={
                            account.picture ||
                            account.profileData?.profile_picture_url_large
                          }
                          alt={account.name}
                        />
                        <AvatarFallback className='text-xs'>
                          {account.name?.charAt(0) || 'L'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{account.name}</span>
                        {account.profileData?.headline && (
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {account.profileData.headline.length > 40
                              ? account.profileData.headline.substring(0, 40) +
                                '...'
                              : account.profileData.headline}
                          </span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Overview */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Content Overview
            </label>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800'>
              {post?.title && (
                <div className='mb-2'>
                  <p className='mt-1 text-sm font-medium text-gray-900 dark:text-gray-100'>
                    {post.title}
                  </p>
                </div>
              )}
              <div>
                <p className='mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300'>
                  {getContentPreview(
                    post?.content || post?.optimizedPost || ''
                  )}
                </p>
              </div>
              {post?.attachments && post.attachments.length > 0 && (
                <div className='mt-2'>
                  <Badge variant='outline' className='text-xs'>
                    Media
                  </Badge>
                  <p className='mt-1 text-xs text-gray-600 dark:text-gray-400'>
                    {post.attachments.length} attachment(s) included
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Publishing Info */}
          <div className='rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20'>
            <p className='text-sm text-blue-800 dark:text-blue-300'>
              <strong>Note:</strong> Once published, your post will appear on
              your LinkedIn feed immediately. You can view it in your LinkedIn
              activity.
            </p>
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={publishing}
            className='dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={publishing || !selectedAccountId}
            className='bg-primary text-primary-foreground hover:bg-primary/90'
          >
            {publishing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Publishing...
              </>
            ) : (
              <>
                <Send className='mr-2 h-4 w-4' />
                Publish to LinkedIn
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PublishConfirmationDialog
