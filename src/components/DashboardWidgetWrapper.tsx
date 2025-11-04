import React from 'react'
import { Plus, X } from 'lucide-react'
import { Card } from './Card'
import { useLanguage } from '../contexts/LanguageContext'

interface DashboardWidgetWrapperProps {
  widgetId: string
  title: string
  children: React.ReactNode
  onAdd?: () => void
  onRemove?: () => void
  canAdd?: boolean
  canRemove?: boolean
  className?: string
}

const DashboardWidgetWrapper: React.FC<DashboardWidgetWrapperProps> = ({
  widgetId,
  title,
  children,
  onAdd,
  onRemove,
  canAdd = false,
  canRemove = true,
  className = '',
}) => {
  const { t } = useLanguage()

  return (
    <div className={`relative group ${className}`}>
      <Card className="h-full">
        {/* Widget Header with Actions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {canAdd && onAdd && (
              <button
                onClick={onAdd}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title={t.dashboard.addWidget || 'Add widget'}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            {canRemove && onRemove && (
              <button
                onClick={onRemove}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title={t.dashboard.removeWidget || 'Remove widget'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="p-4">{children}</div>
      </Card>
    </div>
  )
}

export default DashboardWidgetWrapper

