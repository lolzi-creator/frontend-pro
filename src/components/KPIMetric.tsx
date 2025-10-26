import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPIMetricProps {
  title: string
  value: number
  previousValue: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  format: 'currency' | 'number' | 'percentage'
  trend: 'up' | 'down' | 'stable'
  icon: string
  color: string
  className?: string
}

const KPIMetric: React.FC<KPIMetricProps> = ({
  title,
  value,
  previousValue,
  change,
  changeType,
  format,
  trend,
  icon,
  color,
  className = ''
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `CHF ${val.toLocaleString()}`
      case 'percentage':
        return `${val}%`
      case 'number':
      default:
        return val.toLocaleString()
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />
      case 'down':
        return <TrendingDown className="w-4 h-4" />
      case 'stable':
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 bg-green-50'
      case 'decrease':
        return 'text-red-600 bg-red-50'
      case 'neutral':
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
            style={{ backgroundColor: `${color}20` }}
          >
            <span className="text-2xl">{icon}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()}`}>
          {getTrendIcon()}
          <span className="ml-1">{Math.abs(change)}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </div>
        <div className="text-sm text-gray-500">
          vs {formatValue(previousValue)} last period
        </div>
      </div>
      
      {/* Mini trend line */}
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            changeType === 'increase' ? 'bg-green-500' : 
            changeType === 'decrease' ? 'bg-red-500' : 'bg-gray-400'
          }`}
          style={{ 
            width: `${Math.min(Math.abs(change) * 2, 100)}%` 
          }}
        />
      </div>
    </div>
  )
}

export default KPIMetric

