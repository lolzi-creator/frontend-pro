import React from 'react'
import { MoreVertical, X, Maximize2, Minimize2 } from 'lucide-react'
import Button from './Button'

interface DashboardWidgetProps {
  id: string
  title: string
  children: React.ReactNode
  size: 'small' | 'medium' | 'large'
  onRemove?: (id: string) => void
  onResize?: (id: string, size: 'small' | 'medium' | 'large') => void
  onMaximize?: (id: string) => void
  className?: string
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  title,
  children,
  size,
  onRemove,
  onResize,
  onMaximize,
  className = ''
}) => {
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-2',
    large: 'col-span-3'
  }

  return (
    <div className={`${sizeClasses[size]} bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group ${className}`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onResize && (
            <div className="flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResize(id, size === 'small' ? 'medium' : size === 'medium' ? 'large' : 'small')}
                className="p-1 h-8 w-8"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          )}
          {onMaximize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMaximize(id)}
              className="p-1 h-8 w-8"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(id)}
              className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

export default DashboardWidget







