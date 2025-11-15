import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  CreditCard,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  User,
  TrendingUp,
  FileText,
  Briefcase,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import AdminWithdrawalsApiService, {
  WithdrawalDetailResponse,
} from '@/service/adminWithdrawalsApi'
import AdminWithdrawalService from '@/service/adminWithdrawalService'
import { load as loadCashfree } from '@cashfreepayments/cashfree-js'

const WithdrawalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [withdrawal, setWithdrawal] = useState<WithdrawalDetailResponse | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<
    'APPROVED' | 'REJECTED' | 'COMPLETED' | null
  >(null)
  const [remarks, setRemarks] = useState('')
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null)

  const startCashfreePayment = async (sessionId: string) => {
    try {
      const appId = import.meta.env.VITE_CASHFREE_APP_ID as string | undefined
      const mode = appId && appId.startsWith('TEST') ? 'sandbox' : 'production'
      const cashfree = await loadCashfree({
        mode: mode as 'sandbox' | 'production',
      })
      await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: '_modal',
      })
    } catch (err) {
      console.error('Cashfree checkout error:', err)
    }
  }

  useEffect(() => {
    if (id) {
      fetchWithdrawal()
    }
  }, [id])

  const fetchWithdrawal = async () => {
    try {
      setLoading(true)
      const data = await AdminWithdrawalsApiService.getWithdrawal(id!)
      setWithdrawal(data)
    } catch (error) {
      console.error('Error fetching withdrawal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !id) return

    try {
      setUpdating(true)
      await AdminWithdrawalsApiService.updateWithdrawalStatus(
        id,
        selectedStatus,
        remarks
      )
      // If the admin approved the withdrawal, trigger the backend POST
      // endpoint to perform the withdrawal action (e.g., initiate payment).
      if (selectedStatus === 'APPROVED') {
        try {
          const result = await AdminWithdrawalService.postWithdrawal(id)
          if (result?.sessionId) {
            setPaymentSessionId(result.sessionId)
            // Launch Cashfree checkout modal with the session
            startCashfreePayment(result.sessionId)
          }
        } catch (postErr) {
          // Keep existing flow but log error so the admin can retry or investigate
          console.error('Error triggering withdrawal POST:', postErr)
        }
      }
      setShowStatusDialog(false)
      setRemarks('')
      setSelectedStatus(null)
      fetchWithdrawal()
    } catch (error) {
      console.error('Error updating withdrawal status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const openStatusDialog = (status: 'APPROVED' | 'REJECTED' | 'COMPLETED') => {
    setSelectedStatus(status)
    setShowStatusDialog(true)
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
        return <CheckCircle className='h-5 w-5 text-green-600' />
      case 'APPROVED':
        return <CheckCircle className='h-5 w-5 text-green-600' />
      case 'PENDING':
        return <Clock className='h-5 w-5 text-yellow-600' />
      case 'REJECTED':
        return <XCircle className='h-5 w-5 text-red-600' />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'MILESTONE_CREDIT':
        return <Badge variant='default'>Credit</Badge>
      case 'WITHDRAWAL':
        return <Badge variant='secondary'>Withdrawal</Badge>
      default:
        return <Badge variant='outline'>{type}</Badge>
    }
  }

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <Badge variant='default' className='bg-green-600'>
            Success
          </Badge>
        )
      case 'PENDING':
        return <Badge variant='secondary'>Pending</Badge>
      case 'FAILED':
        return <Badge variant='destructive'>Failed</Badge>
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary'></div>
          <p className='text-muted-foreground'>Loading withdrawal details...</p>
        </div>
      </div>
    )
  }

  if (!withdrawal) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg font-semibold'>Withdrawal not found</p>
          <Button className='mt-4' onClick={() => navigate('/withdrawals')}>
            Back to Withdrawals
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/withdrawals')}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Withdrawal Details
            </h2>
            <p className='text-sm text-muted-foreground'>
              Request ID: {withdrawal.id}
            </p>
          </div>
        </div>
        {withdrawal.status === 'PENDING' && (
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              onClick={() => openStatusDialog('REJECTED')}
            >
              <XCircle className='mr-2 h-4 w-4' />
              Reject
            </Button>
            <Button onClick={() => openStatusDialog('APPROVED')}>
              <CheckCircle className='mr-2 h-4 w-4' />
              Approve
            </Button>
          </div>
        )}
        {withdrawal.status === 'APPROVED' && (
          <Button onClick={() => openStatusDialog('COMPLETED')}>
            <CheckCircle className='mr-2 h-4 w-4' />
            Mark as Completed
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className='grid gap-6'>
        {/* Top Row - Status and Amount */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>Status Information</span>
                {getStatusIcon(withdrawal.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Current Status
                </p>
                <Badge
                  variant={getStatusBadgeVariant(withdrawal.status)}
                  className='mt-1'
                >
                  {withdrawal.status}
                </Badge>
              </div>
              {withdrawal.remarks && (
                <>
                  <Separator />
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Remarks
                    </p>
                    <p className='mt-1 text-sm'>{withdrawal.remarks}</p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Created At
                </p>
                <div className='mt-1 flex items-center text-sm'>
                  <Calendar className='mr-2 h-4 w-4' />
                  {formatDate(withdrawal.createdAt)}
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Last Updated
                </p>
                <div className='mt-1 flex items-center text-sm'>
                  <Calendar className='mr-2 h-4 w-4' />
                  {formatDate(withdrawal.updatedAt)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <DollarSign className='mr-2 h-5 w-5' />
                Amount Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Withdrawal Amount
                </p>
                <p className='mt-1 text-3xl font-bold'>
                  {formatCurrency(
                    withdrawal.amount,
                    withdrawal.wallet.currency
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Wallet and Vendor Information */}
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Wallet Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Wallet className='mr-2 h-5 w-5' />
                Wallet Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Wallet ID
                </p>
                <p className='mt-1 font-mono text-xs'>{withdrawal.walletId}</p>
              </div>
              <Separator />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Available Balance
                </p>
                <p className='mt-1 text-xl font-semibold text-green-600'>
                  {formatCurrency(
                    withdrawal.wallet.availableAmount,
                    withdrawal.wallet.currency
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Currency
                </p>
                <Badge className='mt-1'>{withdrawal.wallet.currency}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <User className='mr-2 h-5 w-5' />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Vendor ID
                </p>
                <p className='mt-1 font-mono text-sm'>{withdrawal.vendorId}</p>
              </div>
              <Separator />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  User ID
                </p>
                <p className='mt-1 font-mono text-xs'>
                  {withdrawal.wallet.userId}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <CreditCard className='mr-2 h-5 w-5' />
                Bank Account
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Bank Account ID
                </p>
                {withdrawal.bankAccountId ? (
                  <p className='mt-1 font-mono text-sm'>
                    {withdrawal.bankAccountId}
                  </p>
                ) : (
                  <p className='mt-1 text-sm italic text-muted-foreground'>
                    Not provided
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <TrendingUp className='mr-2 h-5 w-5' />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawal.wallet.transactions &&
            withdrawal.wallet.transactions.length > 0 ? (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawal.wallet.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {getTransactionTypeBadge(transaction.type)}
                        </TableCell>
                        <TableCell>
                          {getTransactionStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className='font-semibold'>
                          {formatCurrency(
                            transaction.amount,
                            withdrawal.wallet.currency
                          )}
                        </TableCell>
                        <TableCell className='max-w-md'>
                          <p className='truncate text-sm'>
                            {transaction.description}
                          </p>
                        </TableCell>
                        <TableCell className='text-sm'>
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className='py-8 text-center text-sm text-muted-foreground'>
                No transactions found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Related Milestones and Projects */}
        {withdrawal.wallet.transactions.some((t) => t.milestone) && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Briefcase className='mr-2 h-5 w-5' />
                Related Milestones & Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {withdrawal.wallet.transactions
                  .filter((t) => t.milestone)
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className='space-y-3 rounded-lg border p-4'
                    >
                      <div className='flex items-start justify-between'>
                        <div className='space-y-1'>
                          <h4 className='flex items-center font-semibold'>
                            <FileText className='mr-2 h-4 w-4' />
                            {transaction.milestone?.title}
                          </h4>
                          <p className='text-sm text-muted-foreground'>
                            {transaction.milestone?.description}
                          </p>
                        </div>
                        <Badge>
                          {transaction.milestone?.percentage}% Complete
                        </Badge>
                      </div>
                      <Separator />
                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <p className='text-muted-foreground'>
                            Milestone Amount
                          </p>
                          <p className='font-semibold'>
                            {formatCurrency(
                              transaction.milestone?.amount || 0,
                              withdrawal.wallet.currency
                            )}
                          </p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Status</p>
                          <Badge variant='default'>
                            {transaction.milestone?.status}
                          </Badge>
                        </div>
                      </div>
                      {transaction.milestone?.project && (
                        <>
                          <Separator />
                          <div className='space-y-2'>
                            <h5 className='text-sm font-medium'>
                              Project Details
                            </h5>
                            <div className='grid grid-cols-2 gap-4 text-sm'>
                              <div>
                                <p className='text-muted-foreground'>
                                  Project Title
                                </p>
                                <p className='font-medium'>
                                  {transaction.milestone.project.title}
                                </p>
                              </div>
                              <div>
                                <p className='text-muted-foreground'>
                                  Project Status
                                </p>
                                <Badge>
                                  {transaction.milestone.project.status}
                                </Badge>
                              </div>
                            </div>
                            {transaction.milestone.project.description && (
                              <div>
                                <p className='text-muted-foreground'>
                                  Description
                                </p>
                                <div
                                  className='mt-1 text-sm'
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      transaction.milestone.project.description,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Withdrawal Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the status to{' '}
              <span className='font-semibold'>{selectedStatus}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div>
              <label className='text-sm font-medium'>Remarks (Optional)</label>
              <Textarea
                placeholder='Add any remarks or notes...'
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
              />
            </div>
            {paymentSessionId && (
              <div className='rounded-md border p-3 text-sm text-muted-foreground'>
                Payment session ready. If the payment modal did not open, you
                can retry below.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowStatusDialog(false)
                setRemarks('')
                setSelectedStatus(null)
              }}
              disabled={updating}
            >
              Cancel
            </Button>
            {paymentSessionId ? (
              <Button
                type='button'
                onClick={() => startCashfreePayment(paymentSessionId)}
                disabled={updating}
              >
                Open Payment
              </Button>
            ) : null}
            <Button onClick={handleStatusUpdate} disabled={updating}>
              {updating ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WithdrawalDetailPage
