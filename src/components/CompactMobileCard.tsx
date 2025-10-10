import React from 'react'

interface CompactMobileCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
}

const CompactMobileCard: React.FC<CompactMobileCardProps> = ({
  children,
  className = '',
  onClick,
  selected = false
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-3 mb-2
        ${onClick ? 'cursor-pointer hover:shadow-sm active:scale-[0.98]' : ''}
        ${selected ? 'ring-2 ring-orange-500 bg-orange-50' : ''}
        transition-all duration-150
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default CompactMobileCard
