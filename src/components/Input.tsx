import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  type,
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg'
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'
  const inputClasses = `${baseClasses} ${errorClasses} ${className}`

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Call original onFocus if provided
    const originalOnFocus = props.onFocus as ((e: React.FocusEvent<HTMLInputElement>) => void) | undefined
    if (originalOnFocus) {
      originalOnFocus(e)
    }
    
    // Auto-clear 0 values for number inputs
    if (type === 'number' && parseFloat(e.target.value) === 0) {
      e.target.value = ''
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        onFocus={handleFocus}
        {...(props as any)}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default Input
