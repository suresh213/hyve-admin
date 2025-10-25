import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface Option {
  value: string
  label: string
  image?: string
  description?: string
}

interface MultiSelectProps {
  options: Option[]
  selected?: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected = [],
  onChange,
  placeholder = 'Select options...',
  className,
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  // Ensure selected is always an array
  const selectedValues = Array.isArray(selected) ? selected : []

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  )

  const handleUnselect = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value))
  }

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      const newValues = selectedValues.filter((v) => v !== value)
      console.log('Removing value:', value, 'New values:', newValues)
      onChange(newValues)
    } else {
      const newValues = [...selectedValues, value]
      console.log('Adding value:', value, 'New values:', newValues)
      onChange(newValues)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              selectedValues.length > 0 ? 'h-full min-h-10 py-2' : 'h-10',
              'overflow-hidden'
            )}
          >
            <div className='flex max-w-full flex-wrap gap-1.5 overflow-hidden'>
              {selectedOptions.length === 0 && placeholder}
              {selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className='inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  title={option.label}
                >
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.label}
                      className='h-3 w-3 rounded-full'
                    />
                  )}
                  <span className='max-w-[120px] truncate'>{option.label}</span>
                  <button
                    type='button'
                    className='ml-1 flex h-4 w-4 items-center justify-center rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(option.value)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleUnselect(option.value)
                    }}
                  >
                    <X className='h-3 w-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200' />
                  </button>
                </div>
              ))}
            </div>
            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-full p-0'
          align='start'
          side='bottom'
          sideOffset={4}
          style={{ zIndex: 9999 }}
        >
          <Command className='w-full'>
            <div className='sticky top-0 bg-white'>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandEmpty>{emptyText}</CommandEmpty>
            </div>
            <CommandGroup className='max-h-[200px] overflow-y-auto'>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className='cursor-pointer'
                >
                  <div className='flex w-full items-center gap-2'>
                    {option.image && (
                      <img
                        src={option.image}
                        alt={option.label}
                        className='h-6 w-6 rounded-full'
                      />
                    )}
                    <div className='flex flex-col'>
                      <span>{option.label}</span>
                      {option.description && (
                        <span className='text-xs text-muted-foreground'>
                          {option.description}
                        </span>
                      )}
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedValues.includes(option.value)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
