import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import TouchButton from './TouchButton'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (filters: any, format: 'csv' | 'pdf') => void
  title: string
  filterOptions: {
    type: 'select' | 'date' | 'dateRange'
    key: string
    label: string
    options?: { value: string; label: string }[]
  }[]
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  title,
  filterOptions
}) => {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv')

  if (!isOpen) return null

  const handleExport = () => {
    onExport(filters, format)
    onClose()
    setFilters({})
    setFormat('csv')
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal container with animation */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white" style={{fontFamily: 'Poppins'}}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <p className="text-sm text-gray-600 mb-6">
            Choose your export format and apply filters to customize your export.
          </p>

          {/* Export Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`flex items-center justify-center px-6 py-4 border-2 rounded-xl transition-all ${
                  format === 'csv'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:shadow-sm'
                }`}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold">CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex items-center justify-center px-6 py-4 border-2 rounded-xl transition-all ${
                  format === 'pdf'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:shadow-sm'
                }`}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">PDF</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {filterOptions.length > 0 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Filters (Optional)
              </label>
              
              {filterOptions.map(option => (
                <div key={option.key}>
                  {option.type === 'select' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{option.label}</label>
                      <select
                        value={filters[option.key] || ''}
                        onChange={(e) => handleFilterChange(option.key, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="">All</option>
                        {option.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {option.type === 'date' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{option.label}</label>
                      <input
                        type="date"
                        value={filters[option.key] || ''}
                        onChange={(e) => handleFilterChange(option.key, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}

                  {option.type === 'dateRange' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">{option.label}</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="date"
                            placeholder="Start Date"
                            value={filters['startDate'] || ''}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                          />
                          <span className="text-xs text-gray-500 mt-1 block">Start Date</span>
                        </div>
                        <div>
                          <input
                            type="date"
                            placeholder="End Date"
                            value={filters['endDate'] || ''}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                          />
                          <span className="text-xs text-gray-500 mt-1 block">End Date</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <TouchButton
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </TouchButton>
            <TouchButton
              variant="primary"
              onClick={handleExport}
              className="px-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export {format.toUpperCase()}
            </TouchButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
