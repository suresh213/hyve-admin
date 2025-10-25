import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, FileText, Image, Video, PenTool, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PostCreationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function PostCreationPopup({
  isOpen,
  onClose,
}: PostCreationPopupProps) {
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    onClose()
    navigate(path)
  }

  const handleInspirationClick = () => {
    navigate('/dashboard') // Navigate to dashboard instead
  }

  const handleCarouselClick = () => {
    navigate('/dashboard') // Navigate to dashboard instead
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-80 p-0' align='end' side='bottom'>
        <div className='p-4'>
          <div className='mb-4'>
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              Create New Post
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Choose how you want to create your post
            </p>
          </div>

          <div className='space-y-3'>
            {/* Create from Scratch Option */}
            <div
              onClick={() => handleNavigation('/content-generation')}
              className='group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20'
            >
              <div className='flex items-center space-x-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-800/50'>
                  <Plus className='h-4 w-4 text-primary' />
                </div>
                <div className='flex-1'>
                  <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                    Create from Scratch
                  </h4>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    Use AI to help generate content
                  </p>
                </div>
              </div>
            </div>

            {/* Create from Inspirations Option */}
            <div
              onClick={handleInspirationClick}
              className='group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-purple-300 hover:bg-purple-50 dark:border-gray-700 dark:hover:border-purple-600 dark:hover:bg-purple-900/20'
            >
              <div className='flex items-center space-x-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200 dark:bg-purple-900/30 dark:group-hover:bg-purple-800/50'>
                  <PenTool className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                </div>
                <div className='flex-1'>
                  <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                    Create from Inspirations
                  </h4>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    Browse high-performing posts
                  </p>
                </div>
              </div>
            </div>

            {/* Create from Carousel Option */}
            <div
              onClick={handleCarouselClick}
              className='group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-green-300 hover:bg-green-50 dark:border-gray-700 dark:hover:border-green-600 dark:hover:bg-green-900/20'
            >
              <div className='flex items-center space-x-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-800/50'>
                  <Image className='h-4 w-4 text-green-600 dark:text-green-400' />
                </div>
                <div className='flex-1'>
                  <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                    Create from Carousel
                  </h4>
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    Convert content to carousel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
