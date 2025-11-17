import React from 'react'
import Skeleton from './Skeleton'

interface TableSkeletonProps {
  rows?: number
  columns?: number
  showHeader?: boolean
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true
}) => {
  return (
    <div className="w-full">
      {showHeader && (
        <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`header-${index}`} height="1rem" />
          ))}
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="1rem" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableSkeleton








