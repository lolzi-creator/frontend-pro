import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'

const InvoiceDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()
  
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesLoading, setNotesLoading] = useState(false)
  const [reminderEligibility, setReminderEligibility] = useState<{
    canSend: boolean
    reason?: string
    daysUntilEligible?: number
  } | null>(null)

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const response = await apiClient.getInvoice(id)
        console.log('Invoice API response:', response)
        if (response.success) {
          console.log('Invoice data:', response.data)
          const invoiceData = response.data.invoice
          setInvoice(invoiceData)
          setNotes(invoiceData.internalNotes || '')
          
          // Calculate reminder eligibility
          if (invoiceData.dueDate && invoiceData.status !== 'CANCELLED') {
            const dueDate = new Date(invoiceData.dueDate)
            // Set time to start of day for accurate day calculation
            dueDate.setHours(0, 0, 0, 0)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const daysSinceDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
            const totalAmount = invoiceData.total || 0
            const paidAmount = invoiceData.paidAmount || 0
            const isFullyPaid = paidAmount >= totalAmount
            
            if (isFullyPaid) {
              setReminderEligibility({
                canSend: false,
                reason: t.invoice.invoiceFullyPaid || 'Invoice is fully paid'
              })
            } else if (daysSinceDue < 1) {
              // Reminder can be sent 1 day after the due date
              if (daysSinceDue < 0) {
                // Due date hasn't passed yet
                const daysUntilDue = Math.abs(daysSinceDue)
                setReminderEligibility({
                  canSend: false,
                  reason: t.invoice.remindersOnlyAfterDueDate || `Reminders can only be sent after the due date has passed`,
                  daysUntilEligible: daysUntilDue + 1 // Days until due date + 1 day after
                })
              } else {
                // Due date is today, can send tomorrow
                setReminderEligibility({
                  canSend: false,
                  reason: t.invoice.remindersStartingOneDayAfter || `Reminders can be sent starting 1 day after the due date`,
                  daysUntilEligible: 1
                })
              }
            } else {
              setReminderEligibility({
                canSend: true
              })
            }
          } else if (invoiceData.status === 'CANCELLED') {
            setReminderEligibility({
              canSend: false,
              reason: t.invoice.cannotSendReminderCancelled || 'Cannot send reminders for cancelled invoices'
            })
          } else {
            setReminderEligibility({
              canSend: true
            })
          }
        } else {
          showToast({ type: 'error', title: t.invoice.failedToLoad || 'Failed to load invoice' })
          navigate('/invoices')
        }
      } catch (error) {
        console.error('Error fetching invoice:', error)
        showToast({ type: 'error', title: 'Failed to load invoice' })
        navigate('/invoices')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [id, navigate, showToast])

  // Action handlers
  const handleEdit = () => {
    navigate(`/invoices/${id}/edit`)
  }

  const handleSendEmail = async () => {
    if (!id || !invoice) return
    
    try {
      setActionLoading('send-email')
      
      // Calculate next reminder level
      const currentLevel = invoice.reminderLevel || 0
      const nextLevel = Math.min(currentLevel + 1, 3) // Max level is 3
      
      console.log('Current reminder level:', currentLevel, 'Next level:', nextLevel)
      
      // Check if we can send a reminder
      if (currentLevel >= 3) {
        showToast({ type: 'warning', title: t.invoice.maxReminderLevelReached || 'Maximum reminder level reached' })
        return
      }
      
      // Cooldown removed for testing - can send reminders immediately
      
      const response = await apiClient.sendInvoiceReminder(id, nextLevel)
      if (response.success) {
        const isTestMode = response.data?.testMode
        showToast({ 
          type: 'success', 
          title: `${t.invoice.reminder || 'Reminder'} ${nextLevel} ${t.invoice.sentSuccessfully || 'sent successfully'}${isTestMode ? ` (${t.invoice.testMode || 'test mode'})` : ''}`,
          message: isTestMode ? (t.invoice.emailSentForTesting || 'Email sent to mksrhkov@gmail.com for testing') : undefined
        })
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          const invoiceData = updatedInvoice.data.invoice
          setInvoice(invoiceData)
          // Recalculate eligibility after refresh
          if (invoiceData.dueDate && invoiceData.status !== 'CANCELLED') {
            const dueDate = new Date(invoiceData.dueDate)
            // Set time to start of day for accurate day calculation
            dueDate.setHours(0, 0, 0, 0)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const daysSinceDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
            const totalAmount = invoiceData.total || 0
            const paidAmount = invoiceData.paidAmount || 0
            const isFullyPaid = paidAmount >= totalAmount
            
            if (isFullyPaid) {
              setReminderEligibility({
                canSend: false,
                reason: t.invoice.invoiceFullyPaid || 'Invoice is fully paid'
              })
            } else if (daysSinceDue < 1) {
              // Reminder can be sent 1 day after the due date
              if (daysSinceDue < 0) {
                // Due date hasn't passed yet
                const daysUntilDue = Math.abs(daysSinceDue)
                setReminderEligibility({
                  canSend: false,
                  reason: t.invoice.remindersOnlyAfterDueDate || `Reminders can only be sent after the due date has passed`,
                  daysUntilEligible: daysUntilDue + 1 // Days until due date + 1 day after
                })
              } else {
                // Due date is today, can send tomorrow
                setReminderEligibility({
                  canSend: false,
                  reason: t.invoice.remindersStartingOneDayAfter || `Reminders can be sent starting 1 day after the due date`,
                  daysUntilEligible: 1
                })
              }
            } else {
              setReminderEligibility({
                canSend: true
              })
            }
          }
        }
      } else {
        // Handle error response
        const errorMessage = response.error || (t.invoice.failedToSendReminder || 'Failed to send invoice reminder')
        showToast({ 
          type: 'warning', 
          title: t.invoice.cannotSendReminder || 'Cannot Send Reminder',
          message: errorMessage
        })
      }
    } catch (error: any) {
      console.error('Error sending invoice reminder:', error)
      const errorMessage = error?.response?.data?.error || 'Failed to send invoice reminder'
      
      // Check for specific error conditions
      if (errorMessage.includes('30 days') || errorMessage.includes('30 days')) {
        showToast({ 
          type: 'warning', 
          title: t.invoice.reminderNotAvailableYet || 'Reminder Not Available Yet',
          message: errorMessage
        })
      } else if (errorMessage.includes('fully paid')) {
        showToast({ 
          type: 'info', 
          title: t.invoice.invoiceAlreadyPaid || 'Invoice Already Paid',
          message: errorMessage
        })
      } else if (errorMessage.includes('cancelled')) {
        showToast({ 
          type: 'warning', 
          title: t.invoice.cannotSendReminder || 'Cannot Send Reminder',
          message: errorMessage
        })
      } else {
        showToast({ 
          type: 'warning', 
          title: t.invoice.cannotSendReminder || 'Cannot Send Reminder',
          message: errorMessage
        })
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleDownloadPDF = async () => {
    if (!id) return
    
    try {
      setActionLoading('download-pdf')
      
      // Call the backend PDF endpoint
      const pdfBlob = await apiClient.downloadInvoicePDF(id)
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Invoice-${invoice?.number || id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
        showToast({ type: 'success', title: t.invoice.pdfDownloadedSuccess || 'PDF downloaded successfully' })
    } catch (error) {
      console.error('Error downloading PDF:', error)
          showToast({ type: 'error', title: t.invoice.failedToDownloadPDF || 'Failed to download PDF' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewPDF = async () => {
    if (!id) return
    
    try {
      setActionLoading('view-pdf')
      
      // Call the backend PDF endpoint
      const pdfBlob = await apiClient.downloadInvoicePDF(id)
      
      // Create a blob URL and open in new tab
      const url = window.URL.createObjectURL(pdfBlob)
      window.open(url, '_blank')
      
      // Clean up the URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
      
      showToast({ type: 'success', title: t.invoice.pdfOpenedInNewTab || 'PDF opened in new tab' })
    } catch (error) {
      console.error('Error viewing PDF:', error)
        showToast({ type: 'error', title: t.invoice.failedToOpenPDF || 'Failed to open PDF' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDuplicate = async () => {
    if (!invoice) return
    
    try {
      setActionLoading('duplicate')
      const duplicateData = {
        ...invoice,
        number: `${invoice.number}-COPY`,
        status: 'DRAFT',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
      
      const response = await apiClient.createInvoice(duplicateData)
      if (response.success) {
        showToast({ type: 'success', title: t.invoice.invoiceDuplicatedSuccess || 'Invoice duplicated successfully' })
        navigate(`/invoices/${response.data.id}`)
      } else {
        showToast({ type: 'error', title: t.invoice.failedToDuplicateInvoice || 'Failed to duplicate invoice' })
      }
    } catch (error) {
      console.error('Error duplicating invoice:', error)
      showToast({ type: 'error', title: 'Failed to duplicate invoice' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkAsPaid = async () => {
    if (!id) return
    
    try {
      setActionLoading('mark-paid')
      const response = await apiClient.updateInvoiceStatus(id, 'PAID')
      if (response.success) {
        showToast({ type: 'success', title: t.invoice.invoiceMarkedAsPaid || 'Invoice marked as paid' })
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          setInvoice(updatedInvoice.data.invoice)
        }
      } else {
        showToast({ type: 'error', title: t.invoice.failedToMarkAsPaid || 'Failed to mark invoice as paid' })
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
      showToast({ type: 'error', title: 'Failed to mark invoice as paid' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkAsOpen = async () => {
    if (!id) return
    
    try {
      setActionLoading('mark-open')
      const response = await apiClient.updateInvoiceStatus(id, 'OPEN')
      if (response.success) {
        showToast({ type: 'success', title: t.invoice.invoiceMarkedAsOpen || 'Invoice marked as open' })
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          setInvoice(updatedInvoice.data.invoice)
        }
      } else {
        showToast({ type: 'error', title: t.invoice.failedToMarkAsOpen || 'Failed to mark invoice as open' })
      }
    } catch (error) {
      console.error('Error marking invoice as open:', error)
      showToast({ type: 'error', title: 'Failed to mark invoice as open' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkAsCancelled = async () => {
    if (!id) return
    
    try {
      setActionLoading('mark-cancelled')
      const response = await apiClient.updateInvoiceStatus(id, 'CANCELLED')
      if (response.success) {
        showToast({ type: 'success', title: t.invoice.invoiceMarkedAsCancelled || 'Invoice marked as cancelled' })
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          setInvoice(updatedInvoice.data.invoice)
        }
      } else {
        showToast({ type: 'error', title: t.invoice.failedToMarkAsCancelled || 'Failed to mark invoice as cancelled' })
      }
    } catch (error) {
      console.error('Error marking invoice as cancelled:', error)
      showToast({ type: 'error', title: 'Failed to mark invoice as cancelled' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    if (!window.confirm(t.invoice.deleteConfirmationThis || 'Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return
    }
    
    try {
      setActionLoading('delete')
      const response = await apiClient.deleteInvoice(id)
      if (response.success) {
        showToast({ type: 'success', title: t.invoice.invoiceDeletedSuccess || 'Invoice deleted successfully' })
        navigate('/invoices')
      } else {
        showToast({ type: 'error', title: t.invoice.failedToDeleteInvoice || 'Failed to delete invoice' })
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      showToast({ type: 'error', title: 'Failed to delete invoice' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddFile = () => {
    showToast({ type: 'info', title: t.invoice.fileUploadNotImplemented || 'File upload not yet implemented' })
  }

  const handleDownloadFile = (fileId: string) => {
    showToast({ type: 'info', title: t.invoice.fileDownloadNotImplemented || 'File download not yet implemented' })
  }

  const handleSaveNotes = async () => {
    if (!id) return
    
    try {
      setNotesLoading(true)
      const response = await apiClient.updateInvoice(id, { internalNotes: notes })
      
      if (response.success) {
        showToast({ type: 'success', title: t.invoice.notesUpdatedSuccess || 'Notes updated successfully' })
        setIsEditingNotes(false)
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          setInvoice(updatedInvoice.data.invoice)
          setNotes(updatedInvoice.data.invoice.internalNotes || '')
        }
      } else {
        showToast({ type: 'error', title: t.invoice.failedToUpdateNotes || 'Failed to update notes' })
      }
    } catch (error) {
      console.error('Error updating notes:', error)
      showToast({ type: 'error', title: 'Failed to update notes' })
    } finally {
      setNotesLoading(false)
    }
  }

  const handleAddComment = () => {
    setIsEditingNotes(true)
  }

  const handleCancelEditNotes = () => {
    setNotes(invoice?.internalNotes || '')
    setIsEditingNotes(false)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">{t.invoice.loadingInvoice || 'Loading invoice...'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.invoice.invoiceNotFound || 'Invoice not found'}</h2>
          <Button onClick={() => navigate('/invoices')}>{t.invoice.backToInvoices || 'Back to Invoices'}</Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'overdue':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/invoices')}
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.common.back}
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Poppins'}}>
                {invoice.number}
              </h2>
              <p className="text-gray-600">{t.invoice.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {getStatusIcon(invoice.status)}
              <span className="ml-1 capitalize">{invoice.status}</span>
            </span>
            <Button 
              variant="outline" 
              onClick={handleEdit}
              disabled={actionLoading !== null}
            >
              {t.invoice.edit}
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSendEmail}
              disabled={actionLoading !== null || !reminderEligibility?.canSend}
              title={reminderEligibility?.reason || ''}
            >
              {actionLoading === 'send-email' ? t.common.loading : `${t.invoice.reminder} ${(invoice?.reminderLevel || 0) + 1}`}
            </Button>
          </div>
        </div>
        
        {/* Reminder Eligibility Banner */}
        {reminderEligibility && !reminderEligibility.canSend && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">{t.invoice.reminderNotAvailable || 'Reminder Not Available'}</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {reminderEligibility.reason}
                  {reminderEligibility.daysUntilEligible && (
                    <span className="font-semibold"> {t.invoice.reminderAvailableIn || 'You can send a reminder in'} {reminderEligibility.daysUntilEligible} {reminderEligibility.daysUntilEligible === 1 ? (t.invoice.day || 'day') : (t.invoice.days || 'days')}.</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.invoice.from || 'From'}</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{invoice.company?.name || (t.invoice.companyName || 'Company Name')}</p>
                    <p className="whitespace-pre-line">{invoice.company?.address || (t.invoice.companyAddress || 'Company Address')}</p>
                    <p>
                      {t.invoice.vat}: {
                        (() => {
                          const raw = invoice.company?.vatNumber
                          if (!raw) return (t.invoice.na || 'N/A')
                          const digits = (raw.match(/\d/g) || []).join('')
                          if (digits.length < 9) return raw
                          const d = digits.slice(0, 9)
                          return `CHE-${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)} MWST`
                        })()
                      }
                    </p>
                    <p>{t.invoice.phone || 'Phone'}: {invoice.company?.phone || (t.invoice.na || 'N/A')}</p>
                    <p>{t.invoice.email || 'Email'}: {invoice.company?.email || (t.invoice.na || 'N/A')}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.invoice.billTo || 'Bill To'}</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{invoice.customer?.name || (t.invoice.customerName || 'Customer Name')}</p>
                    <p className="whitespace-pre-line">{invoice.customer?.address || (t.invoice.customerAddress || 'Customer Address')}</p>
                    <p>
                      {t.invoice.vat}: {
                        (() => {
                          const raw = invoice.customer?.vatNumber
                          if (!raw) return (t.invoice.na || 'N/A')
                          const digits = (raw.match(/\d/g) || []).join('')
                          if (digits.length < 9) return raw
                          const d = digits.slice(0, 9)
                          return `CHE-${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)} MWST`
                        })()
                      }
                    </p>
                    <p>{t.invoice.phone || 'Phone'}: {invoice.customer?.phone || (t.invoice.na || 'N/A')}</p>
                    <p>{t.invoice.email || 'Email'}: {invoice.customer?.email || (t.invoice.na || 'N/A')}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">{t.invoice.date}</p>
                  <p className="font-medium text-gray-900">{invoice.date ? new Date(invoice.date).toLocaleDateString() : (t.invoice.na || 'N/A')}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t.invoice.dueDate}</p>
                  <p className="font-medium text-gray-900">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t.invoice.totalAmount || 'Total Amount'}</p>
                  <p className="font-medium text-gray-900">CHF {invoice.total ? invoice.total.toFixed(2) : '0.00'}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t.invoice.paidAmount || 'Paid Amount'}</p>
                  <p className="font-medium text-gray-900">CHF {invoice.paidAmount ? invoice.paidAmount.toFixed(2) : '0.00'}</p>
                </div>
                {invoice.qrReference && (
                  <div className="md:col-span-2">
                    <p className="text-gray-500">{t.invoice.paymentReferenceQR || 'Payment Reference (QR)'}</p>
                    <p className="font-medium text-gray-900 break-all tracking-wide">{invoice.qrReference}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">{t.invoice.reminderLevel || 'Reminder Level'}</p>
                  <p className="font-medium text-gray-900">
                    {invoice.reminderLevel ? `${t.invoice.level || 'Level'} ${invoice.reminderLevel}` : (t.invoice.none || 'None')}
                    {invoice.lastReminderAt && (
                      <span className="text-sm text-gray-500 block">
                        {t.invoice.lastSent || 'Last sent'}: {new Date(invoice.lastReminderAt).toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                      {t.invoice.testMode || 'Test Mode'}: {t.invoice.emailsSentForTesting || 'Emails sent to mksrhkov@gmail.com'}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>{t.invoice.lineItems || 'Line Items'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">{t.invoice.description}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">{t.invoice.quantity}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">{t.invoice.unitPrice}</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">{t.invoice.total}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoice.items || invoice.lineItems || []).map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{item.description}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{item.quantity}</span>
                        </td>
                        <td className="py-4 px-4">
                        <span className="text-gray-900">CHF {item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}</span>
                        </td>
                        <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">CHF {item.lineTotal ? item.lineTotal.toFixed(2) : '0.00'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">
                        {t.invoice.subtotal}
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        CHF {invoice.subtotal ? invoice.subtotal.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">
                        {t.invoice.vat} ({invoice.vatRate}%)
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        CHF {invoice.vatAmount ? invoice.vatAmount.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-bold text-lg text-gray-900">
                        {t.invoice.total}
                      </td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-900">
                        CHF {invoice.total ? invoice.total.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Matched Payments */}
          <Card>
            <CardHeader>
              <CardTitle>{t.invoice.matchedPayments || 'Matched Payments'}</CardTitle>
            </CardHeader>
            <CardContent>
              {invoice.payments && invoice.payments.length > 0 ? (
                <div className="space-y-3">
                  {invoice.payments.map((payment: any) => (
                    <div 
                      key={payment.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/payments/${payment.id}`)}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">CHF {(payment.amount || 0).toFixed(2)}</p>
                            {payment.confidence && (
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                payment.confidence === 'HIGH' ? 'bg-green-100 text-green-800' :
                                payment.confidence === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {payment.confidence}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                            <span>{payment.valueDate ? new Date(payment.valueDate).toLocaleDateString() : 'N/A'}</span>
                            {payment.reference && (
                              <span className="font-mono">{t.invoice.reference || 'Ref'}: {payment.reference}</span>
                            )}
                            {payment.description && (
                              <span className="truncate max-w-xs" title={payment.description}>{payment.description}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/payments/${payment.id}`)
                        }}
                      >
                        {t.invoice.view}
                      </Button>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{t.invoice.totalPaid || 'Total Paid'}</span>
                      <span className="text-lg font-bold text-gray-900">
                        CHF {(invoice.paidAmount || 0).toFixed(2)} / CHF {(invoice.total || 0).toFixed(2)}
                      </span>
                    </div>
                    {invoice.paidAmount && invoice.total && invoice.paidAmount >= invoice.total && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        {t.invoice.invoiceFullyPaid}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>{t.invoice.noPaymentsMatched || 'No payments matched to this invoice yet'}</p>
                  <p className="text-xs mt-1">{t.invoice.paymentsWillAppear || 'Payments will appear here once matched'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>{t.invoice.notes || 'Notes'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{invoice.notes || (t.invoice.noNotes || 'No notes')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t.invoice.actions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleSendEmail}
                disabled={actionLoading !== null || !reminderEligibility?.canSend}
                title={reminderEligibility?.reason || ''}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {actionLoading === 'send-email' ? (t.invoice.sending || 'Sending...') : `${t.invoice.reminder} ${(invoice?.reminderLevel || 0) + 1}`}
              </Button>
              {reminderEligibility && !reminderEligibility.canSend && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <p className="text-blue-900 font-medium">{reminderEligibility.reason}</p>
                  {reminderEligibility.daysUntilEligible && (
                    <p className="text-blue-700 mt-1">
                      {t.invoice.availableIn || 'Available in'} {reminderEligibility.daysUntilEligible} {reminderEligibility.daysUntilEligible === 1 ? (t.invoice.day || 'day') : (t.invoice.days || 'days')}.
                    </p>
                  )}
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDownloadPDF}
                disabled={actionLoading !== null}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {actionLoading === 'download-pdf' ? (t.invoice.generating || 'Generating...') : (t.invoice.downloadPDF || 'Download PDF')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDuplicate}
                disabled={actionLoading !== null}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2m-5.5-5.5l-5 5m0 0l-2.5-2.5L5 13.5" />
                </svg>
                {actionLoading === 'duplicate' ? (t.invoice.duplicating || 'Duplicating...') : (t.invoice.duplicate || 'Duplicate')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={actionLoading !== null}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {actionLoading === 'delete' ? (t.invoice.deleting || 'Deleting...') : t.common.delete}
              </Button>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t.invoice.statusManagement || 'Status Management'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Current Status Display */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{t.invoice.currentStatus || 'Current Status'}:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusIcon(invoice.status)}
                    <span className="ml-1 capitalize">{invoice.status}</span>
                  </span>
                </div>
              </div>

              {/* Status Change Buttons */}
              <div className="space-y-2">
                {invoice.status === 'DRAFT' && (
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={handleMarkAsOpen}
                    disabled={actionLoading !== null}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {actionLoading === 'mark-open' ? (t.invoice.updating || 'Updating...') : (t.invoice.markAsOpen || 'Mark as Open')}
                  </Button>
                )}

                {invoice.status === 'OPEN' && (
                  <>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={handleMarkAsPaid}
                      disabled={actionLoading !== null}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {actionLoading === 'mark-paid' ? (t.invoice.updating || 'Updating...') : (t.invoice.markAsPaid || 'Mark as Paid')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:bg-red-50"
                      onClick={handleMarkAsCancelled}
                      disabled={actionLoading !== null}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {actionLoading === 'mark-cancelled' ? (t.invoice.updating || 'Updating...') : (t.invoice.markAsCancelled || 'Mark as Cancelled')}
                    </Button>
                  </>
                )}

                {invoice.status === 'PARTIAL_PAID' && (
                  <>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={handleMarkAsPaid}
                      disabled={actionLoading !== null}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {actionLoading === 'mark-paid' ? (t.invoice.updating || 'Updating...') : (t.invoice.markAsFullyPaid || 'Mark as Fully Paid')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:bg-red-50"
                      onClick={handleMarkAsCancelled}
                      disabled={actionLoading !== null}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {actionLoading === 'mark-cancelled' ? (t.invoice.updating || 'Updating...') : (t.invoice.markAsCancelled || 'Mark as Cancelled')}
                    </Button>
                  </>
                )}

                {(invoice.status === 'PAID' || invoice.status === 'CANCELLED') && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    {t.invoice.noStatusChangesAvailable || 'No status changes available'}
                  </div>
                )}
              </div>

              {/* Status Information */}
              <div className="text-xs text-gray-500 space-y-1">
                <div>• <strong>{t.invoice.draft}:</strong> {t.invoice.draftDescription || 'Invoice is being prepared'}</div>
                <div>• <strong>{t.invoice.open || 'Open'}:</strong> {t.invoice.openDescription || 'Invoice has been sent to customer'}</div>
                <div>• <strong>{t.invoice.paidStatus}:</strong> {t.invoice.paidDescription || 'Invoice has been fully paid'}</div>
                <div>• <strong>{t.invoice.cancelled}:</strong> {t.invoice.cancelledDescription || 'Invoice has been cancelled'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Files */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.invoice.files || 'Files'}</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleViewPDF}
                    disabled={actionLoading !== null}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {actionLoading === 'view-pdf' ? (t.invoice.opening || 'Opening...') : (t.invoice.viewPDF || 'View PDF')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleAddFile}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t.common.add || 'Add'}
                </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Find invoice PDF from files, or show generate option */}
                {(() => {
                  const invoicePdf = invoice.files?.find((f: any) => f.fileType === 'invoice_pdf')
                  return invoicePdf ? (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{invoicePdf.fileName}</p>
                          <p className="text-xs text-gray-500">{t.invoice.autoGeneratedPDF || 'Auto-generated PDF'} • {t.invoice.createdWhenCreated || 'Created when invoice was created'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {invoicePdf.downloadUrl && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => window.open(invoicePdf.downloadUrl, '_blank')}
                            >
                              {t.invoice.view}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = invoicePdf.downloadUrl
                                link.download = invoicePdf.fileName
                                link.click()
                              }}
                            >
                              Download
                            </Button>
                          </>
                        )}
                        {!invoicePdf.downloadUrl && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleViewPDF}
                              disabled={actionLoading !== null}
                            >
                              {actionLoading === 'view-pdf' ? 'Opening...' : 'View'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleDownloadPDF}
                              disabled={actionLoading !== null}
                            >
                              {actionLoading === 'download-pdf' ? (t.invoice.downloading || 'Downloading...') : t.common.download}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Invoice {invoice?.number}.pdf</p>
                          <p className="text-xs text-gray-500">{t.invoice.pdfGeneratedOnDemand || 'PDF will be generated on-demand'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleViewPDF}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === 'view-pdf' ? 'Opening...' : 'View'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDownloadPDF}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === 'download-pdf' ? 'Downloading...' : 'Download'}
                        </Button>
                      </div>
                    </div>
                  )
                })()}

                {/* Other uploaded files (reminder PDFs, etc.) - exclude invoice_pdf as it's shown above */}
                {invoice.files && invoice.files.length > 0 && invoice.files
                  .filter((f: any) => f.fileType !== 'invoice_pdf')
                  .map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mt-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        file.fileType === 'reminder_pdf' ? 'bg-orange-100' : 'bg-blue-100'
                      }`}>
                        <svg className={`w-4 h-4 ${file.fileType === 'reminder_pdf' ? 'text-orange-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {file.fileType === 'reminder_pdf' && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                              {t.invoice.reminder} {file.reminderLevel}
                            </span>
                          )}
                          <p className="text-xs text-gray-500">
                            {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : (t.invoice.na || 'N/A')}
                          </p>
                        </div>
                      </div>
                    </div>
                    {file.downloadUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(file.downloadUrl, '_blank')}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.invoice.internalNotes || 'Internal Notes'}</CardTitle>
                {!isEditingNotes && (
                  <Button variant="outline" size="sm" onClick={handleAddComment}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                    {notes ? t.common.edit : (t.common.add || 'Add')}
                </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <div className="space-y-3">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.invoice.addInternalNotesPlaceholder || 'Add internal notes about this invoice...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[120px]"
                    rows={5}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEditNotes}
                      disabled={notesLoading}
                    >
                      {t.common.cancel}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveNotes}
                      disabled={notesLoading}
                    >
                      {notesLoading ? (t.invoice.saving || 'Saving...') : (t.invoice.saveNotes || 'Save Notes')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[100px]">
                  {notes ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <p>{t.invoice.noInternalNotes || 'No internal notes yet.'}</p>
                      <p className="text-xs mt-1">{t.invoice.clickAddToAddNotes || 'Click "Add" to add notes'}</p>
                    </div>
                  )}
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail

