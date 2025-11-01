import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import {
  Eye,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import AdminWithdrawalsApiService, {
  Withdrawal,
  WithdrawalSearchParams,
  WithdrawalsResponse,
} from '@/service/adminWithdrawalsApi'

const WithdrawalsPage: React.FC = () => {
  const navigate = useNavigate()
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<WithdrawalSearchParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Fetch withdrawals
  const fetchWithdrawals = async () => {
    try {
      setLoading(true)
      const response: WithdrawalsResponse =
        await AdminWithdrawalsApiService.getWithdrawals(filters)
      setWithdrawals(response.withdrawals || [])
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      })
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
      setWithdrawals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWithdrawals()
  }, [filters])

  // Handle filter changes
  const handleFilterChange = (
    key: keyof WithdrawalSearchParams,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleView = (id: string) => {
    navigate(`/withdrawals/${id}`)
  }

  const getStatusBadgeVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'COMPLETED':
        return 'default'
      case 'APPROVED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'REJECTED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className='mr-1 h-3 w-3' />
      case 'APPROVED':
        return <CheckCircle className='mr-1 h-3 w-3' />
      case 'PENDING':
        return <Clock className='mr-1 h-3 w-3' />
      case 'REJECTED':
        return <XCircle className='mr-1 h-3 w-3' />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Define columns for TanStack Table
  const columns: ColumnDef<Withdrawal>[] = [
    {
      accessorKey: 'id',
      header: 'Request ID',
      cell: ({ row }) => (
        <div className='font-mono text-xs'>{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className='font-semibold'>
          {formatCurrency(row.getValue('amount'))}
        </div>
      ),
    },
    {
      accessorKey: 'walletId',
      header: 'Wallet ID',
      cell: ({ row }) => (
        <div className='font-mono text-xs'>{row.getValue('walletId')}</div>
      ),
    },
    {
      accessorKey: 'bankAccountId',
      header: 'Bank Account ID',
      cell: ({ row }) => (
        <div className='font-mono text-xs'>{row.getValue('bankAccountId')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge
            variant={getStatusBadgeVariant(status)}
            className='flex w-fit items-center'
          >
            {getStatusIcon(status)}
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <div className='text-sm'>{formatDate(row.getValue('createdAt'))}</div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => (
        <div className='text-sm'>{formatDate(row.getValue('updatedAt'))}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => handleView(row.original.id)}
        >
          <Eye className='mr-2 h-4 w-4' />
          View
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: withdrawals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: pagination.totalPages,
  })

  // Calculate stats
  const stats = {
    total: pagination.total,
    pending: withdrawals.filter((w) => w.status === 'PENDING').length,
    approved: withdrawals.filter((w) => w.status === 'APPROVED').length,
    completed: withdrawals.filter((w) => w.status === 'COMPLETED').length,
    rejected: withdrawals.filter((w) => w.status === 'REJECTED').length,
  }

  return (
    <div className='flex-1 space-y-4 p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>
          Withdrawal Requests
        </h2>
        <div className='flex items-center space-x-2'>
          <Button onClick={() => fetchWithdrawals()} variant='outline'>
            <RefreshCcw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Requests
            </CardTitle>
            <Wallet className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pending</CardTitle>
            <Clock className='h-4 w-4 text-yellow-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Approved</CardTitle>
            <CheckCircle className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Completed</CardTitle>
            <CheckCircle className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Rejected</CardTitle>
            <XCircle className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <div className='w-[200px]'>
              <label className='mb-2 block text-sm font-medium'>Status</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'status',
                    value === 'all' ? undefined : value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='All Statuses' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value='PENDING'>Pending</SelectItem>
                  <SelectItem value='APPROVED'>Approved</SelectItem>
                  <SelectItem value='COMPLETED'>Completed</SelectItem>
                  <SelectItem value='REJECTED'>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='w-[200px]'>
              <label className='mb-2 block text-sm font-medium'>
                Items per page
              </label>
              <Select
                value={filters.limit?.toString() || '10'}
                onValueChange={(value) =>
                  handleFilterChange('limit', parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='5'>5</SelectItem>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex h-64 items-center justify-center'>
              <div className='text-center'>
                <div className='mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary'></div>
                <p className='text-muted-foreground'>Loading withdrawals...</p>
              </div>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className='flex h-64 items-center justify-center'>
              <p className='text-muted-foreground'>
                No withdrawal requests found
              </p>
            </div>
          ) : (
            <>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
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
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className='mt-4 flex items-center justify-between'>
                <div className='text-sm text-muted-foreground'>
                  Showing {withdrawals.length} of {pagination.total} results
                </div>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <div className='flex items-center space-x-1'>
                    {Array.from({ length: pagination.totalPages }, (_, i) => {
                      const page = i + 1
                      // Show first, last, current, and adjacent pages
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              page === pagination.page ? 'default' : 'outline'
                            }
                            size='sm'
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        )
                      } else if (
                        page === pagination.page - 2 ||
                        page === pagination.page + 2
                      ) {
                        return <span key={page}>...</span>
                      }
                      return null
                    })}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WithdrawalsPage
