import React, { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: 'pdf' | 'excel', options: ExportOptions) => void
}

interface ExportOptions {
  dateRange: {
    start: string
    end: string
  }
  includeCharts: boolean
  includeKPIs: boolean
  includeTables: boolean
  format: 'pdf' | 'excel'
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<ExportOptions>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    includeCharts: true,
    includeKPIs: true,
    includeTables: true,
    format: 'pdf'
  })

  const handleExport = async () => {
    setLoading(true)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onExport(options.format, options)
      showSuccess('Export Successful', `Dashboard data exported as ${options.format.toUpperCase()} successfully.`)
      onClose()
    } catch (error) {
      showError('Export Failed', 'Failed to export dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Dashboard"
      size="md"
    >
      <div className="space-y-6">
        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOptionChange('format', 'pdf')}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                options.format === 'pdf'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">PDF</span>
              </div>
              <div className="font-medium">PDF Report</div>
              <div className="text-xs text-gray-500">Print-ready format</div>
            </button>
            
            <button
              onClick={() => handleOptionChange('format', 'excel')}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                options.format === 'excel'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">XLS</span>
              </div>
              <div className="font-medium">Excel Spreadsheet</div>
              <div className="text-xs text-gray-500">Editable data format</div>
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={options.dateRange.start}
            onChange={(e) => handleOptionChange('dateRange', { ...options.dateRange, start: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={options.dateRange.end}
            onChange={(e) => handleOptionChange('dateRange', { ...options.dateRange, end: e.target.value })}
          />
        </div>

        {/* Include Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Include in Export
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeKPIs}
                onChange={(e) => handleOptionChange('includeKPIs', e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-3 text-sm text-gray-700">KPI Metrics</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeCharts}
                onChange={(e) => handleOptionChange('includeCharts', e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-3 text-sm text-gray-700">Charts & Graphs</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeTables}
                onChange={(e) => handleOptionChange('includeTables', e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-3 text-sm text-gray-700">Data Tables</span>
            </label>
          </div>
        </div>

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
            onClick={handleExport}
            disabled={loading}
            className="px-6"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </div>
            ) : (
              `Export ${options.format.toUpperCase()}`
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ExportModal



