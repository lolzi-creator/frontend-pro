import React, { forwardRef, useState } from 'react'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface MobileSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  searchable?: boolean
  multiple?: boolean
  clearable?: boolean
  onClear?: () => void
}

const MobileSelect = forwardRef<HTMLSelectElement, MobileSelectProps>(({
  className = '',
  label,
  error,
  helperText,
  options,
  placeholder = 'Select an option...',
  variant = 'default',
  size = 'md',
  searchable = false,
  multiple = false,
  clearable = false,
  onClear,
  disabled,
  value,
  onChange,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation appearance-none'

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

  const selectClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  const containerClasses = `
    relative
    ${error ? 'text-red-600' : 'text-gray-700'}
  `

  const selectContainerClasses = `
    relative
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'opacity-50' : ''}
  `

  // Filter options based on search term
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  // Get selected option(s)
  const getSelectedOptions = () => {
    if (multiple && Array.isArray(value)) {
      return options.filter(option => value.includes(option.value))
    } else if (!multiple && value !== undefined && value !== '') {
      return options.filter(option => option.value === value)
    }
    return []
  }

  const selectedOptions = getSelectedOptions()

  // Handle option selection
  const handleOptionClick = (optionValue: string | number) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : []
      const newValue = currentValue.includes(optionValue)
        ? currentValue.filter(v => v !== optionValue)
        : [...currentValue, optionValue]
      onChange?.({
        target: { value: newValue }
      } as unknown as React.ChangeEvent<HTMLSelectElement>)
    } else {
      onChange?.({
        target: { value: optionValue }
      } as React.ChangeEvent<HTMLSelectElement>)
      setIsOpen(false)
    }
  }

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple) {
      onChange?.({
        target: { value: [] }
      } as unknown as React.ChangeEvent<HTMLSelectElement>)
    } else {
      onChange?.({
        target: { value: '' }
      } as React.ChangeEvent<HTMLSelectElement>)
    }
    onClear?.()
  }

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div className={selectContainerClasses}>
        {/* Custom Select Button */}
        <button
          type="button"
          className={`
            ${selectClasses}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            text-left cursor-pointer
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {selectedOptions.length === 0 ? (
                <span className="text-gray-500">{placeholder}</span>
              ) : multiple ? (
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((option) => (
                    <span
                      key={option.value}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800"
                    >
                      {option.label}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOptionClick(option.value)
                        }}
                        className="ml-1 text-orange-600 hover:text-orange-800"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span>{selectedOptions[0]?.label || placeholder}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-2">
              {/* Clear Button */}
              {clearable && selectedOptions.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Dropdown Arrow */}
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Hidden Native Select for Form Submission */}
        <select
          ref={ref}
          className="sr-only"
          value={value}
          onChange={onChange}
          multiple={multiple}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            {/* Options List */}
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple 
                    ? Array.isArray(value) && value.includes(option.value)
                    : value === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`
                        w-full px-4 py-3 text-left text-sm transition-colors
                        ${isSelected 
                          ? 'bg-orange-50 text-orange-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                        ${option.disabled 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer'
                        }
                      `}
                      onClick={() => !option.disabled && handleOptionClick(option.value)}
                      disabled={option.disabled}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {isSelected && (
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
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

MobileSelect.displayName = 'MobileSelect'

export default MobileSelect
