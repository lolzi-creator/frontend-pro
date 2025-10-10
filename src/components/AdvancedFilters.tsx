import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'
import Button from './Button'

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'date' | 'dateRange' | 'number' | 'text'
  options?: FilterOption[]
  placeholder?: string
}

interface AdvancedFiltersProps {
  filters: FilterConfig[]
  onApplyFilters: (filters: Record<string, any>) => void
  onClearFilters: () => void
  className?: string
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onApplyFilters,
  onClearFilters,
  className = ""
}) => {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleApply = () => {
    onApplyFilters(filterValues)
    setIsOpen(false)
  }

  const handleClear = () => {
    setFilterValues({})
    onClearFilters()
    setIsOpen(false)
  }

  const hasActiveFilters = Object.values(filterValues).some(value => 
    value !== undefined && value !== '' && value !== null
  )

  const renderFilterInput = (filter: FilterConfig) => {
    const value = filterValues[filter.key] || ''

    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All {filter.label}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        )

      case 'dateRange':
        return (
          <div className="flex space-x-2">
            <input
              type="date"
              value={value?.from || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, from: e.target.value })}
              placeholder="From"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="date"
              value={value?.to || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, to: e.target.value })}
              placeholder="To"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        )

      case 'number':
        return (
          <div className="flex space-x-2">
            <input
              type="number"
              value={value?.min || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, min: e.target.value })}
              placeholder="Min"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              value={value?.max || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, max: e.target.value })}
              placeholder="Max"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        )

      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          Advanced Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              {Object.values(filterValues).filter(v => v !== undefined && v !== '' && v !== null).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-red-600 hover:bg-red-50"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="primary" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdvancedFilters
