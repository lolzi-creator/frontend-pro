import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'

const InvoiceDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesLoading, setNotesLoading] = useState(false)

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
          setInvoice(response.data.invoice)
          setNotes(response.data.invoice.internalNotes || '')
        } else {
          showToast({ type: 'error', title: 'Failed to load invoice' })
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
        showToast({ type: 'warning', title: 'Maximum reminder level reached' })
        return
      }
      
      // Cooldown removed for testing - can send reminders immediately
      
      const response = await apiClient.sendInvoiceReminder(id, nextLevel)
      if (response.success) {
        const isTestMode = response.data?.testMode
        showToast({ 
          type: 'success', 
          title: `Reminder ${nextLevel} sent successfully${isTestMode ? ' (test mode)' : ''}`,
          message: isTestMode ? 'Email sent to mksrhkov@gmail.com for testing' : undefined
        })
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          setInvoice(updatedInvoice.data.invoice)
        }
      } else {
        showToast({ type: 'error', title: 'Failed to send invoice reminder' })
      }
    } catch (error) {
      console.error('Error sending invoice reminder:', error)
      showToast({ type: 'error', title: 'Failed to send invoice reminder' })
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
      
      showToast({ type: 'success', title: 'PDF downloaded successfully' })
    } catch (error) {
      console.error('Error downloading PDF:', error)
      showToast({ type: 'error', title: 'Failed to download PDF' })
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
      
      showToast({ type: 'success', title: 'PDF opened in new tab' })
    } catch (error) {
      console.error('Error viewing PDF:', error)
      showToast({ type: 'error', title: 'Failed to open PDF' })
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
        showToast({ type: 'success', title: 'Invoice duplicated successfully' })
        navigate(`/invoices/${response.data.id}`)
      } else {
        showToast({ type: 'error', title: 'Failed to duplicate invoice' })
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
        showToast({ type: 'success', title: 'Invoice marked as paid' })
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          setInvoice(updatedInvoice.data.invoice)
        }
      } else {
        showToast({ type: 'error', title: 'Failed to mark invoice as paid' })
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
        showToast({ type: 'success', title: 'Invoice marked as open' })
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          setInvoice(updatedInvoice.data.invoice)
        }
      } else {
        showToast({ type: 'error', title: 'Failed to mark invoice as open' })
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
        showToast({ type: 'success', title: 'Invoice marked as cancelled' })
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          setInvoice(updatedInvoice.data.invoice)
        }
      } else {
        showToast({ type: 'error', title: 'Failed to mark invoice as cancelled' })
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
    
    if (!window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return
    }
    
    try {
      setActionLoading('delete')
      const response = await apiClient.deleteInvoice(id)
      if (response.success) {
        showToast({ type: 'success', title: 'Invoice deleted successfully' })
        navigate('/invoices')
      } else {
        showToast({ type: 'error', title: 'Failed to delete invoice' })
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      showToast({ type: 'error', title: 'Failed to delete invoice' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddFile = () => {
    showToast({ type: 'info', title: 'File upload not yet implemented' })
  }

  const handleDownloadFile = (fileId: string) => {
    showToast({ type: 'info', title: 'File download not yet implemented' })
  }

  const handleSaveNotes = async () => {
    if (!id) return
    
    try {
      setNotesLoading(true)
      const response = await apiClient.updateInvoice(id, { internalNotes: notes })
      
      if (response.success) {
        showToast({ type: 'success', title: 'Notes updated successfully' })
        setIsEditingNotes(false)
        // Refresh invoice data
        const updatedInvoice = await apiClient.getInvoice(id)
        if (updatedInvoice.success) {
          setInvoice(updatedInvoice.data.invoice)
          setNotes(updatedInvoice.data.invoice.internalNotes || '')
        }
      } else {
        showToast({ type: 'error', title: 'Failed to update notes' })
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
            <p className="text-gray-600 mt-4">Loading invoice...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice not found</h2>
          <Button onClick={() => navigate('/invoices')}>Back to Invoices</Button>
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
              Back to Invoices
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Poppins'}}>
                {invoice.number}
              </h2>
              <p className="text-gray-600">Invoice Details</p>
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
              Edit
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSendEmail}
              disabled={actionLoading !== null}
            >
              {actionLoading === 'send-email' ? 'Sending...' : `Send Reminder ${(invoice?.reminderLevel || 0) + 1}`}
            </Button>
          </div>
        </div>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{invoice.company?.name || 'Company Name'}</p>
                    <p className="whitespace-pre-line">{invoice.company?.address || 'Company Address'}</p>
                    <p>VAT: {invoice.company?.vatNumber || 'N/A'}</p>
                    <p>Phone: {invoice.company?.phone || 'N/A'}</p>
                    <p>Email: {invoice.company?.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{invoice.customer?.name || 'Customer Name'}</p>
                    <p className="whitespace-pre-line">{invoice.customer?.address || 'Customer Address'}</p>
                    <p>VAT: {invoice.customer?.vatNumber || 'N/A'}</p>
                    <p>Phone: {invoice.customer?.phone || 'N/A'}</p>
                    <p>Email: {invoice.customer?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Invoice Date</p>
                  <p className="font-medium text-gray-900">{invoice.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-900">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900">CHF {invoice.total ? (invoice.total / 100).toFixed(2) : '0.00'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Paid Amount</p>
                  <p className="font-medium text-gray-900">CHF {invoice.paidAmount ? (invoice.paidAmount / 100).toFixed(2) : '0.00'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reminder Level</p>
                  <p className="font-medium text-gray-900">
                    {invoice.reminderLevel ? `Level ${invoice.reminderLevel}` : 'None'}
                    {invoice.lastReminderAt && (
                      <span className="text-sm text-gray-500 block">
                        Last sent: {new Date(invoice.lastReminderAt).toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                      Test Mode: Emails sent to mksrhkov@gmail.com
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Qty</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Unit Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
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
                        <span className="text-gray-900">CHF {item.unitPrice ? (item.unitPrice / 100).toFixed(2) : '0.00'}</span>
                        </td>
                        <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">CHF {item.lineTotal ? (item.lineTotal / 100).toFixed(2) : '0.00'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">
                        Subtotal
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        CHF {(invoice.subtotal / 100).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">
                        VAT ({invoice.vatRate}%)
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        CHF {(invoice.vatAmount / 100).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-bold text-lg text-gray-900">
                        Total
                      </td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-900">
                        CHF {(invoice.total / 100).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{invoice.notes}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleSendEmail}
                disabled={actionLoading !== null}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {actionLoading === 'send-email' ? 'Sending...' : `Send Reminder ${(invoice?.reminderLevel || 0) + 1}`}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDownloadPDF}
                disabled={actionLoading !== null}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {actionLoading === 'download-pdf' ? 'Generating...' : 'Download PDF'}
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
                {actionLoading === 'duplicate' ? 'Duplicating...' : 'Duplicate'}
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
                {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
              </Button>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Current Status Display */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Status:</span>
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
                    {actionLoading === 'mark-open' ? 'Updating...' : 'Mark as Open'}
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
                      {actionLoading === 'mark-paid' ? 'Updating...' : 'Mark as Paid'}
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
                      {actionLoading === 'mark-cancelled' ? 'Updating...' : 'Mark as Cancelled'}
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
                      {actionLoading === 'mark-paid' ? 'Updating...' : 'Mark as Fully Paid'}
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
                      {actionLoading === 'mark-cancelled' ? 'Updating...' : 'Mark as Cancelled'}
                    </Button>
                  </>
                )}

                {(invoice.status === 'PAID' || invoice.status === 'CANCELLED') && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    No status changes available
                  </div>
                )}
              </div>

              {/* Status Information */}
              <div className="text-xs text-gray-500 space-y-1">
                <div>• <strong>Draft:</strong> Invoice is being prepared</div>
                <div>• <strong>Open:</strong> Invoice has been sent to customer</div>
                <div>• <strong>Paid:</strong> Invoice has been fully paid</div>
                <div>• <strong>Cancelled:</strong> Invoice has been cancelled</div>
              </div>
            </CardContent>
          </Card>

          {/* Files */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Files</CardTitle>
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
                    {actionLoading === 'view-pdf' ? 'Opening...' : 'View PDF'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleAddFile}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Auto-generated PDF file */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Invoice {invoice?.number}.pdf</p>
                      <p className="text-xs text-gray-500">Auto-generated PDF • Created when invoice was created</p>
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

                {/* Other uploaded files */}
                {(invoice.files || []).map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size} • {file.uploadedAt}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadFile(file.id)}>Download</Button>
                  </div>
                ))}
                {(!invoice.files || invoice.files.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-4">No additional files attached</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Internal Notes</CardTitle>
                {!isEditingNotes && (
                  <Button variant="outline" size="sm" onClick={handleAddComment}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                    {notes ? 'Edit' : 'Add'}
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
                    placeholder="Add internal notes about this invoice..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[120px]"
                    rows={5}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEditNotes}
                      disabled={notesLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveNotes}
                      disabled={notesLoading}
                    >
                      {notesLoading ? 'Saving...' : 'Save Notes'}
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
                      <p>No internal notes yet.</p>
                      <p className="text-xs mt-1">Click "Add" to add notes</p>
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

