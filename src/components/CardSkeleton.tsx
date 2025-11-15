import React from 'react'
import Skeleton from './Skeleton'

interface CardSkeletonProps {
  showImage?: boolean
  showActions?: boolean
  lines?: number
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showImage = false,
  showActions = true,
  lines = 3
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {showImage && (
        <Skeleton height="200px" className="mb-4" />
      )}
      
      <div className="space-y-3">
        <Skeleton height="1.5rem" width="60%" />
        
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={`line-${index}`} height="1rem" width={index === lines - 1 ? '40%' : '100%'} />
        ))}
        
        {showActions && (
          <div className="flex space-x-2 pt-4">
            <Skeleton height="2.5rem" width="80px" />
            <Skeleton height="2.5rem" width="80px" />
          </div>
        )}
      </div>
    </div>
  )
}

export default CardSkeleton







