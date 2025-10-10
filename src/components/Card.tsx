import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

const Card: React.FC<CardProps> = ({ className = '', hover = false, children, ...props }) => {
  const baseClasses = 'bg-white rounded-2xl shadow-lg border border-gray-200'
  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow duration-200' : ''
  const classes = `${baseClasses} ${hoverClasses} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
)

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  className = '', 
  children 
}) => (
  <h3 className={`text-lg font-bold text-gray-900 ${className}`} style={{fontFamily: 'Poppins'}}>
    {children}
  </h3>
)

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

export { Card, CardHeader, CardTitle, CardContent }
