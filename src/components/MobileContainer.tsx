import React from 'react'

interface MobileContainerProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  className = '',
  padding = 'md',
  maxWidth = 'full'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4 lg:p-6',
    lg: 'p-6 lg:p-8'
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }

  const classes = `
    w-full mx-auto
    ${paddingClasses[padding]}
    ${maxWidthClasses[maxWidth]}
    ${className}
  `.trim()

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export default MobileContainer
