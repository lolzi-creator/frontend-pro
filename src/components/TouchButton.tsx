import React from 'react'

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const TouchButton: React.FC<TouchButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation select-none'

  const variantClasses = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 focus:ring-orange-500 shadow-lg',
    secondary: 'bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700 focus:ring-teal-500 shadow-lg',
    accent: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-500 shadow-lg',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white active:bg-orange-600 focus:ring-orange-500',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500 shadow-lg'
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[44px]', // Minimum touch target
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]',
    xl: 'px-8 py-5 text-xl min-h-[56px]'
  }

  const widthClasses = fullWidth ? 'w-full' : ''

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`

  const renderIcon = () => {
    if (loading) {
      return (
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )
    }
    
    if (icon) {
      return <span className="flex-shrink-0">{icon}</span>
    }
    
    return null
  }

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {iconPosition === 'left' && (icon || loading) && <span className="ml-2" />}
      
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      
      {iconPosition === 'right' && (icon || loading) && <span className="ml-2" />}
      {iconPosition === 'right' && renderIcon()}
    </button>
  )
}

export default TouchButton
