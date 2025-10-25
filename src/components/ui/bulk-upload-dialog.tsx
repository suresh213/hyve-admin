import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { useToast } from '@/components/ui/use-toast'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  File,
  Info,
  Loader2,
  Upload,
} from 'lucide-react'
import React, { useRef, useState } from 'react'
import { CommonApiService } from '@/service/commonApi'

interface BulkUploadDialogProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<any>
  title: string
  description?: string
  acceptedFileTypes?: string
  sampleFileUrl?: string
  sampleFileType?: 'BULK_RIDER_ADD' | 'BULK_CENTER_ADD' | 'BULK_TRIP_ADD'
  entityName: string
  maxFileSize?: number // in MB
}

export default function BulkUploadDialog({
  open,
  onClose,
  onUpload,
  title,
  description,
  acceptedFileTypes = '.xlsx,.xls',
  sampleFileUrl,
  sampleFileType,
  entityName,
  maxFileSize = 10,
}: BulkUploadDialogProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [dragOver, setDragOver] = useState(false)
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)

  const resetDialog = () => {
    setSelectedFile(null)
    setUploadResult(null)
    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    resetDialog()
    onClose()
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024)
    if (fileSizeInMB > maxFileSize) {
      return `File size must be less than ${maxFileSize}MB`
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const allowedTypes = acceptedFileTypes.split(',').map((type) => type.trim())
    if (!allowedTypes.includes(fileExtension)) {
      return `File type not supported. Please upload ${acceptedFileTypes} files only`
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const error = validateFile(file)
    if (error) {
      toast({
        title: 'Invalid File',
        description: error,
        variant: 'destructive',
      })
      return
    }

    setSelectedFile(file)
    setUploadResult(null)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const getJobStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PROGRESS':
        return <Clock className='h-4 w-4 text-blue-500' />
      case 'SUCCESS':
      case 'COMPLETED':
        return <CheckCircle className='h-4 w-4 text-green-500' />
      case 'FAILED':
      case 'ERROR':
        return <AlertCircle className='h-4 w-4 text-red-500' />
      default:
        return <Info className='h-4 w-4 text-gray-500' />
    }
  }

  const getJobStatusMessage = (status: string, phase?: string) => {
    switch (status?.toUpperCase()) {
      case 'PROGRESS':
        return `Upload in progress${phase ? ` - ${phase}` : ''}. Please check back in 5 minutes.`
      case 'SUCCESS':
      case 'COMPLETED':
        return 'Upload completed successfully!'
      case 'FAILED':
      case 'ERROR':
        return 'Upload failed. Please check your file and try again.'
      default:
        return `Status: ${status}. Please check back in a few minutes.`
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const result = await onUpload(selectedFile)

      // Handle job-based response
      if (result?.data) {
        const jobData = result.data
        setUploadResult({
          success: true,
          isJob: true,
          jobId: jobData.id,
          jobType: jobData.jobType,
          jobStatus: jobData.jobStatus,
          phase: jobData.phase,
          fileName: jobData.data,
          corrId: jobData.corrId,
        })

        // Show appropriate toast based on job status
        if (jobData.jobStatus === 'PROGRESS') {
          toast({
            title: 'Upload Started',
            description:
              'Your file is being processed. Check back in 5 minutes.',
          })
        } else if (
          jobData.jobStatus === 'SUCCESS' ||
          jobData.jobStatus === 'COMPLETED'
        ) {
          toast({
            title: 'Upload Completed',
            description: `${entityName} data has been processed successfully.`,
          })
        }
      } else {
        // Handle direct response (fallback)
        setUploadResult({
          success: true,
          isJob: false,
          processed: result.processed || 0,
        })

        toast({
          title: 'Upload Successful',
          description: `${entityName} data has been uploaded successfully`,
        })
      }
    } catch (error: any) {
      setUploadResult({
        success: false,
        error: error.message || 'Upload failed',
      })

      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadSampleFile = async () => {
    try {
      if (sampleFileType) {
        setDownloadingTemplate(true)
        toast({
          title: 'Downloading sample file',
          description: 'Please wait while we prepare your download...',
        })

        const blob = await CommonApiService.downloadSampleFile(sampleFileType)

        // Use XLSX extension for better compatibility
        let filename = `${entityName.toLowerCase()}_sample.xlsx`

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)

        toast({
          title: 'Download started',
          description: 'Your sample file download has started.',
        })
      } else if (sampleFileUrl) {
        setDownloadingTemplate(true)
        const link = document.createElement('a')
        link.href = sampleFileUrl
        // Use XLSX extension for better compatibility
        link.download = `${entityName.toLowerCase()}_sample.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error downloading sample file:', error)
      toast({
        title: 'Download failed',
        description:
          'Failed to download the sample file. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setDownloadingTemplate(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className='space-y-4'>
          {(sampleFileUrl || sampleFileType) && (
            <Alert>
              <AlertDescription className='flex items-center justify-between'>
                <span>Download sample file format for reference</span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => downloadSampleFile()}
                  className='ml-2'
                  disabled={downloadingTemplate}
                >
                  {downloadingTemplate ? (
                    <>
                      <Loader2 className='mr-1 h-4 w-4 animate-spin' />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className='mr-1 h-4 w-4' />
                      Sample
                    </>
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* File Upload Area */}
          <div
            className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary hover:bg-primary/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <div className='space-y-2'>
              <p className='text-sm font-medium'>
                Drop your file here or click to browse
              </p>
              <p className='text-xs text-gray-500'>
                Supported formats: {acceptedFileTypes} (max {maxFileSize}MB)
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type='file'
              accept={acceptedFileTypes}
              onChange={handleFileInputChange}
              className='hidden'
            />
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
              <div className='flex items-center space-x-3'>
                <File className='h-8 w-8 text-primary' />
                <div>
                  <p className='text-sm font-medium'>{selectedFile.name}</p>
                  <p className='text-xs text-gray-500'>
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelectedFile(null)}
                disabled={uploading}
              >
                Remove
              </Button>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <Alert
              variant={
                uploadResult.success === false ? 'destructive' : 'default'
              }
            >
              {uploadResult.success === false ? (
                <AlertCircle className='h-4 w-4' />
              ) : uploadResult.isJob ? (
                getJobStatusIcon(uploadResult.jobStatus)
              ) : (
                <CheckCircle className='h-4 w-4' />
              )}
              <AlertDescription>
                {uploadResult.success === false ? (
                  uploadResult.error
                ) : uploadResult.isJob ? (
                  <div className='space-y-2'>
                    <p className='font-medium'>
                      {getJobStatusMessage(
                        uploadResult.jobStatus,
                        uploadResult.phase
                      )}
                    </p>
                    <div className='space-y-1 text-xs'>
                      <div>
                        <strong>Job ID:</strong> {uploadResult.jobId}
                      </div>
                      <div>
                        <strong>Status:</strong> {uploadResult.jobStatus}
                      </div>
                      {uploadResult.phase && (
                        <div>
                          <strong>Phase:</strong> {uploadResult.phase}
                        </div>
                      )}
                      <div>
                        <strong>File:</strong> {uploadResult.fileName}
                      </div>
                    </div>
                    {uploadResult.jobStatus === 'PROGRESS' && (
                      <div className='mt-3 rounded bg-blue-50 p-2 text-sm text-blue-700'>
                        <Info className='mr-1 inline h-4 w-4' />
                        Please check back in 5 minutes to see the results.
                      </div>
                    )}
                  </div>
                ) : (
                  `Successfully processed ${uploadResult.processed || 0} records`
                )}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className='mt-2'>
                    <p className='font-medium'>Errors:</p>
                    <ul className='list-inside list-disc text-xs'>
                      {uploadResult.errors
                        .slice(0, 3)
                        .map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                      {uploadResult.errors.length > 3 && (
                        <li>... and {uploadResult.errors.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={uploading}>
            {uploadResult ? 'Close' : 'Cancel'}
          </Button>
          {!uploadResult && (
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Upload
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
