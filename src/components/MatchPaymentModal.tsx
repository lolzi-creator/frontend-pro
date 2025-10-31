import React, { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import Input from './Input'
import Button from './Button'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'

interface MatchPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  payment: {
    id: string
    amount: number
    reference?: string | null
    description?: string | null
    valueDate?: string | Date
  } | null
  onMatched?: (result: any) => void
}

const MatchPaymentModal: React.FC<MatchPaymentModalProps> = ({ isOpen, onClose, payment, onMatched }) => {
  const { showError, showSuccess } = useToast()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [invoices, setInvoices] = useState<any[]>([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
      setInvoices([])
      setSelectedInvoiceId(null)
    } else if (isOpen && payment?.reference) {
      // Auto-search by QR reference when modal opens
      setSearch(payment.reference)
      autoSearchByReference(payment.reference)
    }
  }, [isOpen, payment])

  const autoSearchByReference = async (reference: string) => {
    if (!reference) return
    
    try {
      setSearching(true)
      // First try without search to make sure we can get invoices at all
      // Then filter client-side by QR reference
      const resp = await apiClient.getInvoices({ limit: 100 })
      
      console.log('[MatchPaymentModal] API Response:', resp)
      
      // Use same response structure as useInvoices hook expects
      let invoiceList: any[] = []
      if (resp?.success && resp?.data?.invoices) {
        invoiceList = Array.isArray(resp.data.invoices) ? resp.data.invoices : []
      } else {
        console.warn('[MatchPaymentModal] Unexpected response structure:', resp)
        invoiceList = []
      }
      
      console.log('[MatchPaymentModal] Extracted invoice list:', invoiceList.length, 'invoices')
      if (invoiceList.length > 0) {
        console.log('[MatchPaymentModal] First 5 invoices:', invoiceList.slice(0, 5).map((inv: any) => ({
          id: inv.id,
          number: inv.number,
          qrReference: inv.qrReference
        })))
      }
      
      // Filter to only invoices with matching QR reference (exact match required)
      const cleanReference = reference.replace(/\s/g, '').toUpperCase()
      console.log('[MatchPaymentModal] Looking for QR reference:', cleanReference)
      
      const matchingInvoices = invoiceList.filter((inv: any) => {
        const invQrRef = inv.qrReference ? inv.qrReference.replace(/\s/g, '').toUpperCase() : ''
        const matches = invQrRef === cleanReference
        if (matches) {
          console.log('[MatchPaymentModal] Found matching invoice:', inv.number, 'QR:', inv.qrReference)
        }
        return matches
      })
      
      console.log('[MatchPaymentModal] Matching invoices:', matchingInvoices.length)
      
      // Only show invoices with exact QR reference match
      setInvoices(matchingInvoices)
      
      // Auto-select the first (and likely only) exact match
      if (matchingInvoices.length === 1) {
        setSelectedInvoiceId(matchingInvoices[0].id)
      } else if (matchingInvoices.length > 1) {
        // If multiple matches, select the first one (shouldn't happen, but handle it)
        setSelectedInvoiceId(matchingInvoices[0].id)
      }
    } catch (e) {
      console.error('Error auto-searching:', e)
      setInvoices([])
    } finally {
      setSearching(false)
    }
  }

  const paymentInfo = useMemo(() => {
    if (!payment) return ''
    const parts = [] as string[]
    parts.push(`Amount: CHF ${((payment.amount || 0) / 100).toFixed(2)}`)
    if (payment.valueDate) {
      const date = typeof payment.valueDate === 'string' 
        ? new Date(payment.valueDate) 
        : payment.valueDate
      parts.push(`Date: ${date.toLocaleDateString()}`)
    }
    if (payment.reference) parts.push(`Ref: ${payment.reference}`)
    return parts.join(' • ')
  }, [payment])

  const runSearch = async () => {
    if (!search.trim()) {
      setInvoices([])
      return
    }
    
    try {
      setSearching(true)
      const resp = await apiClient.getInvoices({ search: search.trim(), limit: 50 })
      
      console.log('[MatchPaymentModal] Search API Response:', resp)
      
      // Use same response structure as useInvoices hook expects
      let invoiceList: any[] = []
      if (resp?.success && resp?.data?.invoices) {
        invoiceList = Array.isArray(resp.data.invoices) ? resp.data.invoices : []
      } else {
        console.warn('[MatchPaymentModal] Unexpected response structure:', resp)
        invoiceList = []
      }
      
      // If payment has a reference, filter to only show invoices with matching QR reference
      if (payment?.reference) {
        const cleanPaymentRef = payment.reference.replace(/\s/g, '').toUpperCase()
        invoiceList = invoiceList.filter((inv: any) => {
          const invQrRef = inv.qrReference ? inv.qrReference.replace(/\s/g, '').toUpperCase() : ''
          return invQrRef === cleanPaymentRef
        })
      }
      
      console.log('[MatchPaymentModal] Search result:', invoiceList.length, 'invoices')
      setInvoices(invoiceList)
    } catch (e) {
      console.error('Search error:', e)
      showError('Search failed', 'Could not search invoices.')
      setInvoices([])
    } finally {
      setSearching(false)
    }
  }

  const handleConfirm = async () => {
    if (!payment) return
    if (!selectedInvoiceId) {
      showError('No invoice selected', 'Please select an invoice to match.')
      return
    }
    try {
      setLoading(true)
      const resp = await apiClient.matchPayment(payment.id, selectedInvoiceId)
      showSuccess('Payment matched', 'The payment was linked to the invoice.')
      onMatched?.(resp)
      onClose()
    } catch (e) {
      showError('Match failed', 'Could not match payment to invoice.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Match Payment to Invoice" size="lg">
      <div className="space-y-4">
        <div className="text-sm text-gray-700">
          {paymentInfo}
        </div>

        {payment?.reference && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Payment Reference Found</p>
                <p className="text-xs text-blue-700 font-mono">{payment.reference}</p>
                <p className="text-xs text-blue-600 mt-1">Searching for matching invoices by QR reference...</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <Input
              label="Search by QR Reference"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  runSearch()
                }
              }}
              placeholder="Enter QR reference (e.g. babd679202500018)"
            />
          </div>
          <Button variant="outline" onClick={runSearch} disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
          {!searching && invoices.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              {payment?.reference 
                ? `No invoices found with QR reference "${payment.reference}". Only invoices with matching QR references will be shown.`
                : 'No invoices found. Enter a QR reference to search.'}
            </div>
          ) : searching ? (
            <div className="p-4 text-sm text-gray-500 text-center">Searching...</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {Array.isArray(invoices) && invoices.map((inv: any) => {
                const qrMatches = payment?.reference && inv.qrReference && (
                  inv.qrReference.replace(/\s/g, '').toUpperCase() === payment.reference.replace(/\s/g, '').toUpperCase()
                )
                
                return (
                  <li 
                    key={inv.id} 
                    className={`p-3 cursor-pointer border-l-4 ${
                      selectedInvoiceId === inv.id 
                        ? 'bg-orange-50 border-orange-500' 
                        : qrMatches
                        ? 'bg-green-50 border-green-400 hover:bg-green-100'
                        : 'border-transparent hover:bg-gray-50'
                    }`} 
                    onClick={() => setSelectedInvoiceId(inv.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">{inv.number || inv.id}</div>
                          {qrMatches && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                              QR Match
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{inv.customer?.name || '—'}</div>
                        {inv.qrReference && (
                          <div className={`text-xs break-all mt-1 ${
                            qrMatches ? 'font-medium text-green-700' : 'text-gray-500'
                          }`}>
                            QR Ref: {inv.qrReference}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 ml-4">CHF {((inv.total || 0) / 100).toFixed(2)}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={loading || !selectedInvoiceId}>
            {loading ? 'Matching...' : 'Match Payment'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default MatchPaymentModal


