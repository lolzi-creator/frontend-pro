import React, { useState, useMemo } from 'react'
import CompactMobileCard from './CompactMobileCard'
import TouchButton from './TouchButton'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  mobileRender?: (row: T) => React.ReactNode
  priority?: 'high' | 'medium' | 'low'
}

interface CompactMobileTableProps<T> {
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

function CompactMobileTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = true,
  searchPlaceholder = "Search...",
  pagination = true,
  pageSize = 8, // Smaller default page size
  bulkActions = false,
  onBulkAction,
  onRowClick,
  className = ""
}: CompactMobileTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

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

  // Mobile card render - more compact
  const renderMobileCard = (row: T, index: number) => {
    const rowId = (row as any).id || index
    const highPriorityColumns = columns.filter(col => col.priority === 'high')
    const mediumPriorityColumns = columns.filter(col => col.priority === 'medium')
    const actionColumn = columns.find(col => col.key === 'actions')
    const isSelected = selectedRows.has(rowId)

    return (
      <CompactMobileCard
        key={rowId}
        onClick={() => onRowClick?.(row)}
        selected={isSelected}
      >
        {/* Compact Header Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0">
            {highPriorityColumns.map((column) => (
              <div key={String(column.key)} className="mb-1">
                {column.mobileRender ? column.mobileRender(row) : column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
              </div>
            ))}
          </div>
          {bulkActions && (
            <div onClick={(e) => e.stopPropagation()} className="ml-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSelectRow(rowId)}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
          )}
        </div>

        {/* Compact Details Row */}
        {mediumPriorityColumns.length > 0 && (
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
            {mediumPriorityColumns.map((column) => (
              <div key={String(column.key)} className="truncate">
                <span className="font-medium">{column.label}:</span>
                <span className="ml-1">
                  {column.mobileRender ? column.mobileRender(row) : column.render ? column.render(row[column.key], row) : String(row[column.key] || '')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Compact Actions */}
        {actionColumn && (
          <div className="flex items-center justify-end space-x-1 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
            {actionColumn.render ? actionColumn.render(null, row) : null}
          </div>
        )}
      </CompactMobileCard>
    )
  }

  return (
    <div className={className}>
      {/* Compact Header */}
      {(title || searchable || bulkActions) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
          )}
          
          <div className="flex flex-col gap-2">
            {/* Search */}
            {searchable && (
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            )}

            {/* Bulk Actions */}
            {bulkActions && selectedRows.size > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  {selectedRows.size} selected
                </span>
                <select
                  onChange={(e) => handleBulkAction(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">Actions</option>
                  <option value="export">Export</option>
                  <option value="delete">Delete</option>
                  <option value="mark_paid">Mark Paid</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="space-y-1">
        {paginatedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            {searchTerm ? 'No results found' : 'No data available'}
          </div>
        ) : (
          paginatedData.map((row, index) => renderMobileCard(row, index))
        )}
      </div>

      {/* Compact Pagination */}
      {pagination && totalPages > 1 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Pagination Info */}
            <div className="text-xs text-gray-600 text-center sm:text-left">
              {startItem}-{endItem} of {filteredData.length}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center space-x-1">
              <TouchButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs"
              >
                First
              </TouchButton>
              <TouchButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs"
              >
                Prev
              </TouchButton>
              
              {/* Page Numbers - Show fewer on mobile */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + i
                  if (pageNum > totalPages) return null
                  
                  return (
                    <TouchButton
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0 text-xs"
                    >
                      {pageNum}
                    </TouchButton>
                  )
                })}
              </div>

              <TouchButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs"
              >
                Next
              </TouchButton>
              <TouchButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs"
              >
                Last
              </TouchButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompactMobileTable



