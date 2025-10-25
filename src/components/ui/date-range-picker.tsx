'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface CalendarDateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
}

export function CalendarDateRangePicker({
  className,
  date,
  onDateChange,
}: CalendarDateRangePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    {
      from: subDays(new Date(), 30), // 30 days ago
      to: new Date(), // Today
    }
  )

  // Use external date if provided, otherwise use internal state
  const currentDate = date || internalDate
  const handleDateChange = onDateChange || setInternalDate

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'h-9 w-[240px] justify-start rounded-lg border border-gray-200 bg-white px-3 text-left font-medium shadow-sm transition-shadow duration-200 hover:shadow-md',
              !currentDate?.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4 text-gray-500' />
            {currentDate?.from ? (
              currentDate.to ? (
                <>
                  {format(currentDate.from, 'MMM dd, yyyy')} -{' '}
                  {format(currentDate.to, 'MMM dd, yyyy')}
                </>
              ) : (
                format(currentDate.from, 'MMM dd, yyyy')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto rounded-lg border border-gray-200 bg-white p-0 shadow-lg'
          align='end'
        >
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={currentDate?.from}
            selected={currentDate}
            onSelect={handleDateChange}
            numberOfMonths={2}
            className='rounded-lg'
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
