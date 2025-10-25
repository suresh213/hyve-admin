import React, { useState, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { Label } from '@/components/ui/label'

interface DataTablePaginationProps {
  pageIndex: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  searchPlaceholder?: string
  pagination?: DataTablePaginationProps
  pageSizeOptions?: number[]
  filters?: {
    key: string
    label: string
    type?: 'select' | 'date'
    options?: { label: string; value: string }[]
    value: string
    onChange: (value: string) => void
  }[]
  actions?: React.ReactNode
  emptyState?: {
    title: string
    description: string
    action?: React.ReactNode
  }
  onSearch?: (value: string) => void
  searchValue?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  searchPlaceholder = 'Search...',
  pagination,
  pageSizeOptions = [10, 20, 30, 40, 50],
  filters,
  actions,
  emptyState,
  onSearch,
  searchValue,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'examCode', desc: false },
    { id: 'status', desc: false },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState(searchValue || '')

  // Update globalFilter when searchValue prop changes
  useEffect(() => {
    if (searchValue !== undefined) {
      setGlobalFilter(searchValue)
    }
  }, [searchValue])
  // Initialize with 0-based pagination
  const [pageIndex, setPageIndex] = useState(() =>
    pagination ? pagination.pageIndex - 1 : 0
  )
  const [pageSize, setPageSize] = useState(
    () => pagination?.pageSize || pageSizeOptions[0]
  )

  // Update internal state when pagination props change
  useEffect(() => {
    if (pagination) {
      setPageIndex(pagination.pageIndex - 1) // Convert 1-based to 0-based for internal use
      setPageSize(pagination.pageSize)
    }
  }, [pagination?.pageIndex, pagination?.pageSize])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: !!pagination,
    pageCount: pagination
      ? Math.ceil(pagination.totalItems / pagination.pageSize)
      : undefined,
    enableSorting: true,
    enableMultiSort: true,
  })

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value)
    if (pagination) {
      pagination.onPageSizeChange(newSize)
    } else {
      setPageSize(newSize)
    }
  }

  const handlePageChange = (page: number) => {
    if (pagination) {
      // Convert from 1-based UI page to 1-based for parent callback
      pagination.onPageChange(page)
    } else {
      // When no pagination prop, convert 1-based UI page to 0-based internal state
      setPageIndex(page - 1)
    }
  }

  // Calculate pagination info
  const totalItems = pagination?.totalItems || data.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (pageIndex - 1) * pageSize + 1
  const endItem = Math.min(pageIndex * pageSize, totalItems)
  const showPagination = totalItems > 0
  const currentPageSizeOptions = pagination?.pageSizeOptions || pageSizeOptions
  // Display 1-based page numbers for UI, but use 0-based internally
  const displayPageNumber = pageIndex + 1

  // We'll show a loading indicator only for the table content, not the entire component

  return (
    <div className='space-y-2'>
      <div className='flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
        <div className='flex flex-1 items-center gap-2'>
          {onSearch && (
            <div className='relative max-w-sm'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value)
                  if (onSearch) {
                    onSearch(e.target.value)
                  }
                }}
                className='max-w-xs pl-8'
              />
            </div>
          )}
          {filters && filters.length > 0 && (
            <div className='flex flex-wrap items-center gap-2'>
              <SlidersHorizontal className='h-4 w-4 text-muted-foreground' />
              {filters.map((filter) =>
                filter.type === 'date' ? (
                  <div key={filter.key} className='flex flex-col gap-1'>
                    <Label className='text-xs'>{filter.label}</Label>
                    <DatePicker
                      date={filter.value}
                      onSelect={(date) => filter.onChange(date || '')}
                      className='h-8 text-xs'
                    />
                  </div>
                ) : (
                  <Select
                    key={filter.key}
                    value={filter.value}
                    onValueChange={filter.onChange}
                  >
                    <SelectTrigger className='h-8 w-[140px] text-xs'>
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='ALL'>All {filter.label}s</SelectItem>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              )}
            </div>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader className='bg-gray-50'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='px-4'>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='px-6'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Show loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {Array.from({ length: columns.length }).map(
                    (_, cellIndex) => (
                      <TableCell key={`loading-cell-${cellIndex}`}>
                        <Skeleton className='h-6 w-full' />
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {emptyState ? (
                    <div className='flex flex-col items-center justify-center py-4'>
                      <h3 className='text-lg font-medium'>
                        {emptyState.title}
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        {emptyState.description}
                      </p>
                      {emptyState.action && (
                        <div className='mt-4'>{emptyState.action}</div>
                      )}
                    </div>
                  ) : (
                    'No results found.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            Showing {startItem} to {endItem} of {totalItems} entries
          </div>
          <div className='flex items-center space-x-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium'>Rows per page</p>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className='h-8 w-[70px]'>
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side='top'>
                  {currentPageSizeOptions.map((size: number) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => handlePageChange(1)} // Go to first page (1-based)
                disabled={displayPageNumber === 1}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => handlePageChange(displayPageNumber - 1)} // Go to previous page (1-based)
                disabled={displayPageNumber === 1}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <div className='flex items-center gap-1'>
                <span className='text-sm font-medium'>
                  Page {displayPageNumber} of {totalPages || 1}
                </span>
              </div>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => handlePageChange(displayPageNumber + 1)} // Go to next page (1-based)
                disabled={displayPageNumber === totalPages || totalPages === 0}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => handlePageChange(totalPages)} // Go to last page (1-based)
                disabled={displayPageNumber === totalPages || totalPages === 0}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
