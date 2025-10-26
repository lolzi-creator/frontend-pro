import React from 'react'
import Chart from './Chart'

interface PieData {
  label: string
  value: number
  color?: string
}

interface PieChartProps {
  data: PieData[]
  title?: string
  subtitle?: string
  className?: string
  loading?: boolean
  error?: string
  size?: number
  height?: number
  showLegend?: boolean
  showValues?: boolean
  showPercentages?: boolean
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  subtitle,
  className = '',
  loading = false,
  error,
  size = 200,
  showLegend = true,
  showValues = true,
  showPercentages = true
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

  const total = data.reduce((sum, item) => sum + item.value, 0)
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

  let cumulativePercentage = 0

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const startAngle = (cumulativePercentage / 100) * 360
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360
    
    cumulativePercentage += percentage

    const color = item.color || colors[index % colors.length]
    
    // Calculate path for pie segment
    const radius = size / 2 - 10
    const centerX = size / 2
    const centerY = size / 2
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180)
    const endAngleRad = (endAngle - 90) * (Math.PI / 180)
    
    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)
    
    const largeArcFlag = percentage > 50 ? 1 : 0
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')

    return {
      ...item,
      pathData,
      color,
      percentage,
      startAngle,
      endAngle
    }
  })

  return (
    <Chart
      title={title}
      subtitle={subtitle}
      className={className}
    >
      <div className="flex items-center justify-center space-x-8">
        {/* Pie Chart */}
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
              />
            ))}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="space-y-2 min-w-0 flex-1">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {segment.label}
                  </div>
                  {showValues && (
                    <div className="text-xs text-gray-500">
                      {segment.value.toLocaleString()}
                      {showPercentages && ` (${segment.percentage.toFixed(1)}%)`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Chart>
  )
}

export default PieChart

