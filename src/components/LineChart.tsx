import React from 'react'
import Chart from './Chart'

interface DataPoint {
  x: string | number
  y: number
  label?: string
}

interface LineChartProps {
  data: DataPoint[]
  title?: string
  subtitle?: string
  className?: string
  loading?: boolean
  error?: string
  height?: number
  color?: string
  showGrid?: boolean
  showDots?: boolean
  showArea?: boolean
  showForecast?: boolean
  forecastData?: DataPoint[]
  forecastColor?: string
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  subtitle,
  className = '',
  loading = false,
  error,
  height = 300,
  color = '#f97316', // orange-500
  showGrid = true,
  showDots = true,
  showArea = false,
  showForecast = false,
  forecastData = [],
  forecastColor = '#f59e0b'
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

  // Calculate chart dimensions and scales
  const chartWidth = 100
  const chartHeight = 100
  const padding = 10
  
  const maxY = Math.max(...data.map(d => d.y))
  const minY = Math.min(...data.map(d => d.y))
  const yRange = maxY - minY || 1
  
  const xStep = (chartWidth - 2 * padding) / (data.length - 1)
  const yScale = (chartHeight - 2 * padding) / yRange

  // Generate path data
  const points = data.map((point, index) => {
    const x = padding + index * xStep
    const y = padding + (maxY - point.y) * yScale
    return `${x},${y}`
  })

  const pathData = `M ${points.join(' L ')}`
  
  // Generate forecast path data if forecast is enabled
  let forecastPathData = ''
  if (showForecast && forecastData.length > 0) {
    const forecastPoints = forecastData.map((point, index) => {
      const x = padding + index * xStep
      const y = padding + (maxY - point.y) * yScale
      return `${x},${y}`
    })
    forecastPathData = `M ${forecastPoints.join(' L ')}`
  }
  
  // Generate area path (if enabled)
  const areaPathData = showArea 
    ? `${pathData} L ${padding + (data.length - 1) * xStep},${padding + chartHeight - padding} L ${padding},${padding + chartHeight - padding} Z`
    : ''

  return (
    <Chart
      title={title}
      subtitle={subtitle}
      className={className}
    >
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          {showGrid && (
            <g className="text-gray-200">
              {/* Horizontal grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={`h-${y}`}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
              {/* Vertical grid lines */}
              {data.map((_, index) => (
                <line
                  key={`v-${index}`}
                  x1={padding + index * xStep}
                  y1={padding}
                  x2={padding + index * xStep}
                  y2={chartHeight - padding}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
            </g>
          )}

          {/* Area fill (if enabled) */}
          {showArea && (
            <path
              d={areaPathData}
              fill={color}
              fillOpacity="0.1"
            />
          )}

          {/* Forecast line (dashed) */}
          {showForecast && forecastPathData && (
            <path
              d={forecastPathData}
              fill="none"
              stroke={forecastColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5,5"
              opacity="0.8"
            />
          )}

          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {showDots && points.map((point, index) => {
            const [x, y] = point.split(',').map(Number)
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="hover:r-4 transition-all duration-200"
              />
            )
          })}

          {/* Forecast data points */}
          {showForecast && showDots && forecastData.length > 0 && forecastPathData && (
            <>
              {forecastData.map((point, index) => {
                const x = padding + index * xStep
                const y = padding + (maxY - point.y) * yScale
                return (
                  <circle
                    key={`forecast-${index}`}
                    cx={x}
                    cy={y}
                    r="2"
                    fill={forecastColor}
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.8"
                    className="hover:r-3 transition-all duration-200"
                  />
                )
              })}
            </>
          )}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>{maxY.toLocaleString()}</span>
          <span>{Math.round((maxY + minY) / 2).toLocaleString()}</span>
          <span>{minY.toLocaleString()}</span>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
          {data.map((point, index) => (
            <span key={index} className="text-center">
              {typeof point.x === 'string' ? point.x : point.x.toString()}
            </span>
          ))}
        </div>
      </div>
    </Chart>
  )
}

export default LineChart
