import React from 'react'
import Chart from './Chart'

interface BarData {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: BarData[]
  title?: string
  subtitle?: string
  className?: string
  loading?: boolean
  error?: string
  height?: number
  showValues?: boolean
  horizontal?: boolean
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  subtitle,
  className = '',
  loading = false,
  error,
  height = 300,
  showValues = true,
  horizontal = false
}) => {
  if (loading || error) {
    return (
      <Chart
        title={title}
        subtitle={subtitle}
        className={className}
        loading={loading}
        error={error}
      />
    )
  }

  if (!data || data.length === 0) {
    return (
      <Chart
        title={title}
        subtitle={subtitle}
        className={className}
        error="No data available"
      />
    )
  }

  const maxValue = Math.max(...data.map(d => d.value))
  const colors = [
    '#f97316', // orange-500
    '#06b6d4', // cyan-500
    '#8b5cf6', // violet-500
    '#10b981', // emerald-500
    '#ef4444', // red-500
    '#f59e0b', // amber-500
    '#3b82f6', // blue-500
    '#ec4899'  // pink-500
  ]

  return (
    <Chart
      title={title}
      subtitle={subtitle}
      className={className}
    >
      <div className="relative" style={{ height: `${height}px` }}>
        {horizontal ? (
          // Horizontal bars
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = (item.value / maxValue) * 100
              const color = item.color || colors[index % colors.length]
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-20 text-sm text-gray-600 truncate">
                    {item.label}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className="h-6 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                    {showValues && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {item.value.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Vertical bars
          <div className="flex items-end justify-between space-x-2 h-full">
            {data.map((item, index) => {
              const percentage = (item.value / maxValue) * 100
              const color = item.color || colors[index % colors.length]
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t transition-all duration-500 ease-out hover:opacity-80"
                      style={{
                        height: `${percentage}%`,
                        backgroundColor: color,
                        minHeight: item.value > 0 ? '4px' : '0'
                      }}
                    />
                    {showValues && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                        {item.value.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-600 text-center truncate w-full">
                    {item.label}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Chart>
  )
}

export default BarChart
