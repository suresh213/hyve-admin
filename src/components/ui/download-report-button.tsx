import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  downloadReportFile,
  generateReport,
  ReportType,
  SummaryCardsParams,
} from '@/service/dashboardApi'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { useToast } from './use-toast'

interface DownloadReportButtonProps {
  filters: SummaryCardsParams
  reportType?: ReportType
  className?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
}

export function DownloadReportButton({
  filters,
  reportType = 'PICKUP_SUMMARY',
  className,
  variant = 'outline',
}: DownloadReportButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      const blob = await generateReport(filters, reportType)

      // Generate a filename with current date
      const date = new Date().toISOString().split('T')[0]
      const filename = `report-${reportType.toLowerCase()}-${date}.xlsx`

      downloadReportFile(blob, filename)

      toast({
        title: 'Report downloaded successfully',
        description: `The ${reportType.replace('_', ' ').toLowerCase()} report has been downloaded.`,
      })
    } catch (error) {
      console.error('Error downloading report:', error)
      toast({
        title: 'Failed to download report',
        description:
          'There was an error generating your report. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size='sm'
            className={className}
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className='mr-2 h-4 w-4' />
            {isLoading ? 'Downloading...' : 'Download Report'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download a report based on your current filters</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
