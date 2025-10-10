import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'md':
        return 'w-6 h-6'
      case 'lg':
        return 'w-8 h-8'
      case 'xl':
        return 'w-12 h-12'
      default:
        return 'w-6 h-6'
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-orange-500'
      case 'white':
        return 'text-white'
      case 'gray':
        return 'text-gray-500'
      default:
        return 'text-orange-500'
    }
  }

  return (
    <div className={`animate-spin ${getSizeClasses()} ${getColorClasses()} ${className}`}>
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

export default LoadingSpinner
