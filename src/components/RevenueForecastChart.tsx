import React from 'react'
import LineChart from './LineChart'

interface RevenueForecastChartProps {
  data: Array<{
    period: string
    actual: number
    forecast: number
    confidence: number
  }>
  className?: string
}

const RevenueForecastChart: React.FC<RevenueForecastChartProps> = ({ 
  data, 
  className = '' 
}) => {
  // Transform data for the chart
  const chartData = data.map(item => ({
    x: item.period,
    y: item.actual,
    forecast: item.forecast,
    confidence: item.confidence
  }))

  const forecastData = data.map(item => ({
    x: item.period,
    y: item.forecast
  }))

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Forecast</h3>
          <p className="text-sm text-gray-600">Actual vs predicted revenue trends</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Actual</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Forecast</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <LineChart
          data={chartData}
          title=""
          subtitle=""
          height={300}
          color="#3b82f6"
          showArea={true}
          showDots={true}
          showGrid={true}
          showForecast={true}
          forecastData={forecastData}
          forecastColor="#f97316"
        />
      </div>

      {/* Confidence indicators */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {data.slice(-3).map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-sm text-gray-600">{item.period}</div>
            <div className="text-xs text-gray-500">
              Confidence: {Math.round(item.confidence * 100)}%
            </div>
            <div className={`w-full h-1 mt-1 rounded-full ${
              item.confidence > 0.8 ? 'bg-green-500' :
              item.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RevenueForecastChart
