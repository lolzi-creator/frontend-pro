import React, { forwardRef } from 'react'

interface MobileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconClick?: () => void
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
}

const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(({
  className = '',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconClick,
  variant = 'default',
  size = 'md',
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation'

  const variantClasses = {
    default: 'border border-gray-300 rounded-lg bg-white focus:border-orange-500',
    filled: 'border-0 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500',
    outlined: 'border-2 border-gray-300 rounded-lg bg-transparent focus:border-orange-500'
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[44px]', // Minimum touch target
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-5 py-4 text-lg min-h-[52px]'
  }

  const inputClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  const containerClasses = `
    relative
    ${error ? 'text-red-600' : 'text-gray-700'}
  `

  const inputContainerClasses = `
    relative flex items-center
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'opacity-50' : ''}
  `

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className={inputContainerClasses}>
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          className={`
            ${inputClasses}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          `}
          disabled={disabled}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div 
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
              ${onRightIconClick ? 'cursor-pointer hover:text-gray-600' : 'pointer-events-none'}
            `}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

MobileInput.displayName = 'MobileInput'

export default MobileInput
