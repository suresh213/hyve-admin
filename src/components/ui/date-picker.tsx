import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  date?: string
  onSelect?: (date: string | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  date,
  onSelect,
  placeholder = 'Pick a date',
  className,
}: DatePickerProps) {
  // Internal state to handle the Date object
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    date ? new Date(date) : undefined
  )

  // Update internal state when prop changes
  useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date))
    } else {
      setSelectedDate(undefined)
    }
  }, [date])

  // Handle date selection
  const handleSelect = useCallback(
    (newDate: Date | undefined) => {
      setSelectedDate(newDate)
      if (newDate) {
        // Convert to YYYY-MM-DD format in local timezone
        const year = newDate.getFullYear()
        const month = String(newDate.getMonth() + 1).padStart(2, '0')
        const day = String(newDate.getDate()).padStart(2, '0')
        const dateString = `${year}-${month}-${day}`
        onSelect?.(dateString)
      } else {
        onSelect?.(undefined)
      }
    },
    [onSelect]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'h-8 w-[180px] justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {selectedDate ? (
            format(selectedDate, 'yyyy-MM-dd')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
