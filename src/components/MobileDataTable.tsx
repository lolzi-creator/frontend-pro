import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'
import Button from './Button'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  mobileRender?: (row: T) => React.ReactNode
  priority?: 'high' | 'medium' | 'low' // For mobile display priority
}

interface MobileDataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  title?: string
  searchable?: boolean
  searchPlaceholder?: string
  pagination?: boolean
  pageSize?: number
  bulkActions?: boolean
  onBulkAction?: (action: string, selectedRows: T[]) => void
  onRowClick?: (row: T) => void
  className?: string
}

function MobileDataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = true,
  searchPlaceholder = "Search...",
  pagination = true,
  pageSize = 10,
  bulkActions = false,
  onBulkAction,
  onRowClick,
  className = ""
}: MobileDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile')

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key]
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }, [data, searchTerm, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, pageSize, pagination])

  // Calculate pagination info
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, filteredData.length)

  // Handle sorting
  const handleSort = (key: keyof T) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null
      }
      return { key, direction: 'asc' }
    })
  }

  // Handle row selection
  const handleSelectRow = (rowId: string | number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((row, index) => (row as any).id || index)))
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    const selectedData = data.filter((row, index) => selectedRows.has((row as any).id || index))
    onBulkAction?.(action, selectedData)
    setSelectedRows(new Set())
  }

  // Get sort icon
  const getSortIcon = (key: keyof T) => {
    if (sortConfig?.key !== key) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  // Mobile card render
  const renderMobileCard = (row: T, index: number) => {
    const rowId = (row as any).id || index
    const highPriorityColumns = columns.filter(col => col.priority === 'high')
    const mediumPriorityColumns = columns.filter(col => col.priority === 'medium')
    const actionColumn = columns.find(col => col.key === 'actions')

    return (
      <div
        key={rowId}
        className={`bg-white rounded-lg border border-gray-200 p-4 mb-3 ${
          onRowClick ? 'cursor-pointer hover:shadow-md' : ''
        } transition-shadow`}
        onClick={() => onRowClick?.(row)}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {highPriorityColumns.map((column) => (
              <div key={String(column.key)} className="mb-1">
                {column.mobileRender ? column.mobileRender(row) : column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
              </div>
            ))}
          </div>
          {bulkActions && (
            <div onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedRows.has(rowId)}
                onChange={() => handleSelectRow(rowId)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="space-y-2">
          {mediumPriorityColumns.map((column) => (
            <div key={String(column.key)} className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{column.label}:</span>
              <span className="text-gray-900">
                {column.mobileRender ? column.mobileRender(row) : column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
              </span>
            </div>
          ))}
        </div>

        {/* Card Actions */}
        {actionColumn && (
          <div className="mt-4 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
            {actionColumn.render ? actionColumn.render(null, row) : null}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      {/* Header */}
      {(title || searchable || bulkActions) && (
        <CardHeader>
          <div className="flex flex-col space-y-4">
            {title && (
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{title}</CardTitle>
                {/* View Mode Toggle - Hidden on mobile */}
                <div className="hidden sm:flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`p-2 rounded-lg ${viewMode === 'mobile' ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`p-2 rounded-lg ${viewMode === 'desktop' ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              {searchable && (
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}

              {/* Bulk Actions */}
              {bulkActions && selectedRows.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedRows.size} selected
                  </span>
                  <select
                    onChange={(e) => handleBulkAction(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Bulk Actions</option>
                    <option value="export">Export Selected</option>
                    <option value="delete">Delete Selected</option>
                    <option value="mark_paid">Mark as Paid</option>
                    <option value="send_email">Send Email</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        {/* Mobile View */}
        <div className="block sm:hidden">
          <div className="p-4">
            {paginatedData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? 'No results found' : 'No data available'}
              </div>
            ) : (
              paginatedData.map((row, index) => renderMobileCard(row, index))
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {/* Select All Checkbox */}
                  {bulkActions && (
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                  )}

                  {/* Column Headers */}
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`text-left py-3 px-4 font-medium text-gray-600 ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                      style={{ width: column.width }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (bulkActions ? 1 : 0)}
                      className="text-center py-12 text-gray-500"
                    >
                      {searchTerm ? 'No results found' : 'No data available'}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const rowId = (row as any).id || index
                    return (
                      <tr
                        key={rowId}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          onRowClick ? 'cursor-pointer' : ''
                        } transition-colors`}
                        onClick={() => onRowClick?.(row)}
                      >
                        {/* Row Checkbox */}
                        {bulkActions && (
                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedRows.has(rowId)}
                              onChange={() => handleSelectRow(rowId)}
                              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                          </td>
                        )}

                        {/* Row Data */}
                        {columns.map((column) => (
                          <td
                            key={String(column.key)}
                            className="py-4 px-4"
                            style={{ width: column.width }}
                          >
                            {column.render
                              ? column.render(row[column.key], row)
                              : String(row[column.key] || '')
                            }
                          </td>
                        ))}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Pagination Info */}
              <div className="text-sm text-gray-700">
                Showing {startItem} to {endItem} of {filteredData.length} results
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    if (pageNum > totalPages) return null
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MobileDataTable
