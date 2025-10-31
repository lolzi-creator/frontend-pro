import React, { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import FileUpload from './FileUpload'
import { apiClient } from '../lib/api'

interface PaymentImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: any) => void
}

const PaymentImportModal: React.FC<PaymentImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [importType, setImportType] = useState<'mt940' | 'csv' | 'camt053' | 'manual'>('mt940')
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload') // For CSV: upload file or paste text
  const [file, setFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState('')
  const [manualData, setManualData] = useState({
    amount: '',
    reference: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0])
    }
  }

  const handleImport = async () => {
    setLoading(true)
    
    try {
      if (importType === 'manual') {
        onImport({ type: 'manual', data: manualData })
        showSuccess('Payment Added', 'Payment has been added successfully.')
      } else {
        let text: string
        
        // Get text from file or pasted input
        if ((importType === 'csv' || importType === 'mt940') && inputMode === 'paste') {
          if (!pastedText.trim()) {
            showError('No Data', `Please paste or type ${importType.toUpperCase()} data.`)
            return
          }
          text = pastedText
          console.log(`[Payments Import] Type: ${importType.toUpperCase()} (pasted)`, 'Input mode: paste')
        } else {
          if (!file) {
            showError('No File', 'Please select a file to import.')
            return
          }
          text = await file.text()
          console.log('[Payments Import] Type:', importType, 'Filename:', file.name)
        }
        
        console.log('[Payments Import] Payload preview (first 200 chars):', text.slice(0, 200))
        let response
        if (importType === 'csv') {
          console.log('[Payments Import] Parsing CSV client-side and calling /payments/import')
          // Robust CSV parse: handles BOM, comma/semicolon separators, quoted fields
          const raw = text.replace(/^\uFEFF/, '')
          const lines = raw.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0)
          console.log('[Payments Import] CSV line count (incl. header):', lines.length)
          if (lines.length < 2) {
            throw new Error('CSV must contain a header and at least one row')
          }
          const header = lines.shift() as string
          const sep = header.includes(';') && !header.includes(',') ? ';' : ','
          const splitRow = (row: string) => {
            const parts: string[] = []
            let current = ''
            let inQuotes = false
            for (let i = 0; i < row.length; i++) {
              const ch = row[i]
              if (ch === '"') {
                inQuotes = !inQuotes
              } else if (!inQuotes && ch === sep) {
                parts.push(current.trim().replace(/^\"|\"$/g, ''))
                current = ''
              } else {
                current += ch
              }
            }
            parts.push(current.trim().replace(/^\"|\"$/g, ''))
            return parts
          }
          const cols = splitRow(header).map(h => h.trim().replace(/^\ufeff/, '').toLowerCase())
          console.log('[Payments Import] CSV headers:', cols)
          const findIndex = (candidates: string[]) => candidates.map(c => c.toLowerCase()).map(c => cols.indexOf(c)).find(i => i !== -1) ?? -1
          const idxAmount = findIndex(['amount', 'amountchf', 'betrag', 'betrag (chf)'])
          const idxDate = findIndex(['date', 'valuedate', 'value date', 'datum'])
          const idxReference = findIndex(['reference', 'qrreference', 'qr reference', 'ref'])
          const idxDescription = findIndex(['description', 'text', 'note', 'details'])
          if (idxAmount === -1 || idxDate === -1) {
            throw new Error('CSV header must include Amount and Date')
          }
          const payments = lines
            .map(line => splitRow(line))
            .map(values => {
              const amountChf = parseFloat(values[idxAmount] || '0')
              return {
                amount: Math.round(amountChf * 100),
                valueDate: values[idxDate],
                reference: idxReference !== -1 ? (values[idxReference] || null) : null,
                description: idxDescription !== -1 ? (values[idxDescription] || null) : null,
              }
            })
            .filter(p => !isNaN(p.amount) && p.amount > 0 && p.valueDate)

          console.log('[Payments Import] Parsed payments count:', payments.length)
          response = await apiClient.importPayments(payments)
        } else if (importType === 'mt940') {
          console.log('[Payments Import] Parsing MT940 client-side and calling /payments/import')
          // Client-side MT940 parsing - more robust than backend
          const lines = text.split(/\r\n|\n|\r/)
          const payments: any[] = []
          let currentPayment: any = null

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue

            // Transaction line :61:
            if (trimmed.startsWith(':61:')) {
              // Save previous payment if exists
              if (currentPayment && currentPayment.amount > 0) {
                payments.push(currentPayment)
              }
              
              currentPayment = {
                amount: 0,
                valueDate: '',
                reference: null,
                description: null
              }

              // Parse :61:YYMMDDMMDD[DC]amount[NTRF][reference]//[additional_info]
              // Try multiple regex patterns for different MT940 formats
              // Pattern 1: with // separator (most common)
              let match = trimmed.match(/:61:(\d{6})(\d{4})([CD])(\d+(?:\.\d{2})?)(?:NTRF)?[^/]*\/\/([^:\r\n]+)/)
              
              if (!match) {
                // Pattern 2: without // separator, reference at end
                match = trimmed.match(/:61:(\d{6})(\d{4})([CD])(\d+(?:\.\d{2})?)(?:NTRF)?([^:\r\n]+)/)
              }
              
              if (!match) {
                // Pattern 3: minimal format - just date, time, DC, amount
                match = trimmed.match(/:61:(\d{6})(\d{4})([CD])(\d+(?:\.\d{2})?)/)
              }

              if (match) {
                const [, dateStr, , dc, amountStr, ref] = match
                // Parse date: YYMMDD -> YYYY-MM-DD
                const year = parseInt(dateStr.substring(0, 2))
                const month = dateStr.substring(2, 4)
                const day = dateStr.substring(4, 6)
                const fullYear = year < 50 ? 2000 + year : 1900 + year
                
                currentPayment.valueDate = `${fullYear}-${month}-${day}`
                const amountChf = parseFloat(amountStr || '0')
                if (!isNaN(amountChf) && amountChf > 0) {
                  currentPayment.amount = Math.round(amountChf * 100) // Convert to Rappen
                  if (dc === 'D') currentPayment.amount = -currentPayment.amount // Debit = negative
                  currentPayment.amount = Math.abs(currentPayment.amount) // Store as positive
                  
                  if (ref && ref.trim()) {
                    currentPayment.reference = ref.trim()
                  }
                }
              }
            } 
            // Description line :86:
            else if (trimmed.startsWith(':86:') && currentPayment) {
              const desc = trimmed.substring(4).trim()
              if (desc) {
                currentPayment.description = desc
              }
            }
          }

          // Don't forget the last payment
          if (currentPayment && currentPayment.amount > 0) {
            payments.push(currentPayment)
          }

          console.log('[Payments Import] Parsed MT940 payments count:', payments.length)
          console.log('[Payments Import] Parsed payments:', payments)
          
          if (payments.length === 0) {
            throw new Error('No valid payments found in MT940 file. Check the format.')
          }

          response = await apiClient.importPayments(payments)
        } else if (importType === 'camt053') {
          console.log('[Payments Import] Parsing CAMT.053 client-side and calling /payments/import')
          // Client-side CAMT.053 XML parsing
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(text, 'text/xml')
          
          // Check for parsing errors
          const parseError = xmlDoc.querySelector('parsererror')
          if (parseError) {
            throw new Error('Invalid XML format. Please check your CAMT.053 file.')
          }
          
          const payments: any[] = []
          
          // Find all Ntry (entry) elements
          const entries = xmlDoc.querySelectorAll('Ntry')
          
          entries.forEach((entry) => {
            try {
              // Get amount and currency
              const amtElem = entry.querySelector('Amt')
              const amount = amtElem?.getAttribute('Ccy') === 'CHF' 
                ? parseFloat(amtElem?.textContent || '0')
                : 0
              
              // Get credit/debit indicator
              const cdtDbtInd = entry.querySelector('CdtDbtInd')?.textContent?.trim()
              // Only process credits (CRDT) - money coming in
              if (cdtDbtInd !== 'CRDT' || amount <= 0) return
              
              // Get value date
              const valDt = entry.querySelector('ValDt Dt')?.textContent?.trim() || 
                           entry.querySelector('BookgDt Dt')?.textContent?.trim()
              
              if (!valDt) return
              
              // Get reference from nested transaction details
              let reference: string | null = null
              let description: string | null = null
              
              // Try to get from RmtInf > Ustrd (unstructured remittance info)
              const ustrd = entry.querySelector('RmtInf Ustrd, NtryDtls TxDtls RmtInf Ustrd')
              if (ustrd) {
                const text = ustrd.textContent?.trim()
                if (text) {
                  // Could be reference or description, try to detect
                  if (text.length <= 50 && /^[A-Z0-9]+$/.test(text)) {
                    reference = text
                  } else {
                    description = text
                  }
                }
              }
              
              // Try AcctSvcrRef as reference
              const acctSvcrRef = entry.querySelector('AcctSvcrRef, NtryDtls TxDtls Refs AcctSvcrRef')
              if (acctSvcrRef?.textContent?.trim() && !reference) {
                reference = acctSvcrRef.textContent.trim()
              }
              
              // Get description from RmtInf if not set
              if (!description) {
                const rmtInfText = entry.querySelector('RmtInf Ustrd, NtryDtls TxDtls RmtInf Ustrd')?.textContent?.trim()
                if (rmtInfText && rmtInfText.length > 50) {
                  description = rmtInfText
                }
              }
              
              payments.push({
                amount: Math.round(amount * 100), // Convert CHF to Rappen
                valueDate: valDt, // Already in YYYY-MM-DD format
                reference: reference || null,
                description: description || null
              })
            } catch (err) {
              console.warn('[Payments Import] Error parsing CAMT.053 entry:', err)
            }
          })
          
          console.log('[Payments Import] Parsed CAMT.053 payments count:', payments.length)
          console.log('[Payments Import] Parsed payments:', payments)
          
          if (payments.length === 0) {
            throw new Error('No valid payments found in CAMT.053 file. Make sure it contains credit entries (CRDT).')
          }
          
          response = await apiClient.importPayments(payments)
        }

        onImport(response)
        showSuccess('Import Successful', 'Payments have been imported successfully.')
      }
      onClose()
      
      // Reset form
      setFile(null)
      setPastedText('')
      setManualData({
        amount: '',
        reference: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error: any) {
      const serverMsg = error?.response?.data?.error || error?.response?.data?.message
      console.error('[Payments Import] Error:', error)
      if (error?.response) {
        console.error('[Payments Import] Response status:', error.response.status)
        console.error('[Payments Import] Response data:', error.response.data)
      }
      showError('Import Failed', serverMsg ? String(serverMsg) : 'Failed to import payments. Please check the console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Payments"
      size="md"
    >
      <div className="space-y-6">
        {/* Import Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Import Method
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            <button
              onClick={() => {
                setImportType('mt940')
                setInputMode('upload')
                setFile(null)
                setPastedText('')
              }}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                importType === 'mt940'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="font-medium">MT940</div>
              <div className="text-xs text-gray-500">Bank statement</div>
            </button>
            
            <button
              onClick={() => {
                setImportType('camt053')
                setInputMode('upload')
                setFile(null)
                setPastedText('')
              }}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                importType === 'camt053'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              </div>
              <div className="font-medium">CAMT.053</div>
              <div className="text-xs text-gray-500">XML statement</div>
            </button>
            
            <button
              onClick={() => {
                setImportType('csv')
                setInputMode('upload')
                setFile(null)
                setPastedText('')
              }}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                importType === 'csv'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="font-medium">CSV</div>
              <div className="text-xs text-gray-500">Spreadsheet</div>
            </button>
            
            <button
              onClick={() => {
                setImportType('manual')
                setInputMode('upload')
                setFile(null)
                setPastedText('')
              }}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                importType === 'manual'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="font-medium">Manual</div>
              <div className="text-xs text-gray-500">Single entry</div>
            </button>
          </div>
        </div>

        {/* File Upload or Manual Form */}
        {importType !== 'manual' ? (
          <div>
            {/* Input Mode Toggle (for CSV and MT940) */}
            {(importType === 'csv' || importType === 'mt940') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Method
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInputMode('upload')
                      setPastedText('')
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      inputMode === 'upload'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputMode('paste')
                      setFile(null)
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      inputMode === 'paste'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Paste/Type
                  </button>
                </div>
              </div>
            )}
            
            {/* File Upload */}
            {!((importType === 'csv' || importType === 'mt940') && inputMode === 'paste') ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload File
                </label>
                <FileUpload
                  onFilesSelected={handleFileUpload}
                  accept={importType === 'mt940' ? '.txt,.mt940' : importType === 'camt053' ? '.xml' : '.csv'}
                  maxFiles={1}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors"
                >
                  <div className="space-y-2">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      {importType === 'mt940' ? 'MT940 files (.txt, .mt940)' : importType === 'camt053' ? 'CAMT.053 XML files (.xml)' : 'CSV files (.csv)'}
                    </div>
                  </div>
                </FileUpload>
                {file && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-green-800">{file.name}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Paste/Type Textarea for CSV or MT940 */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste or Type {importType === 'csv' ? 'CSV' : 'MT940'} Data
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  {importType === 'csv' ? (
                    <p className="text-xs text-blue-700">
                      <strong>Format:</strong> amount,date,reference,description<br />
                      <strong>Example:</strong><br />
                      <code className="text-xs bg-white px-2 py-1 rounded block mt-1">
                        Amount,Date,Reference,Description<br />
                        11.95,2025-10-27,babd679202500018,Payment for RE-2025-0001
                      </code>
                    </p>
                  ) : (
                    <p className="text-xs text-blue-700">
                      <strong>MT940 Format:</strong> Bank statement format with :61: and :86: lines<br />
                      <strong>Example:</strong><br />
                      <code className="text-xs bg-white px-2 py-1 rounded block mt-1 whitespace-pre">
:61:2511051105C21.54NTRFNONREF//ba6d79202500018<br />
:86:PAYMENT FOR INVOICE RE-2025-0001
                      </code>
                    </p>
                  )}
                </div>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={importType === 'csv' 
                    ? "Amount,Date,Reference,Description\n11.95,2025-10-27,babd679202500018,Payment for RE-2025-0001"
                    : ":61:2511051105C21.54NTRFNONREF//ba6d79202500018\n:86:PAYMENT FOR INVOICE RE-2025-0001"
                  }
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 font-mono text-sm"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount (CHF)"
                type="number"
                value={manualData.amount}
                onChange={(e) => setManualData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                step="0.01"
              />
              <Input
                label="Date"
                type="date"
                value={manualData.date}
                onChange={(e) => setManualData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <Input
              label="Reference"
              value={manualData.reference}
              onChange={(e) => setManualData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Payment reference"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={manualData.description}
                onChange={(e) => setManualData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Payment description"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={loading || (importType !== 'manual' && ((importType === 'csv' || importType === 'mt940') && inputMode === 'paste' ? !pastedText.trim() : !file))}
            className="px-6"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Importing...
              </div>
            ) : (
              'Import Payments'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default PaymentImportModal
