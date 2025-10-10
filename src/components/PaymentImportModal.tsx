import React, { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import FileUpload from './FileUpload'

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
  const [importType, setImportType] = useState<'mt940' | 'csv' | 'manual'>('mt940')
  const [file, setFile] = useState<File | null>(null)
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
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (importType === 'manual') {
        onImport({
          type: 'manual',
          data: manualData
        })
      } else {
        onImport({
          type: importType,
          file: file
        })
      }
      
      showSuccess('Import Successful', 'Payments have been imported successfully.')
      onClose()
      
      // Reset form
      setFile(null)
      setManualData({
        amount: '',
        reference: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      showError('Import Failed', 'Failed to import payments. Please try again.')
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
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setImportType('mt940')}
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
              onClick={() => setImportType('csv')}
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
              onClick={() => setImportType('manual')}
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload File
            </label>
            <FileUpload
              onFilesSelected={handleFileUpload}
              accept={importType === 'mt940' ? '.txt,.mt940' : '.csv'}
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
                  {importType === 'mt940' ? 'MT940 files (.txt, .mt940)' : 'CSV files (.csv)'}
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
            disabled={loading || (importType !== 'manual' && !file)}
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
