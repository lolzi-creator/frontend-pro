import React from 'react'
import PieChart from './PieChart'

interface PaymentPattern {
  method: string
  count: number
  amount: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

interface PaymentPatternsChartProps {
  data: PaymentPattern[]
  className?: string
}

const PaymentPatternsChart: React.FC<PaymentPatternsChartProps> = ({ 
  data, 
  className = '' 
}) => {
  const chartData = data.map((item, index) => ({
    label: item.method,
    value: item.amount,
    color: [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'
    ][index % 6]
  }))

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank_transfer':
        return '🏦'
      case 'credit_card':
        return '💳'
      case 'paypal':
        return '🅿️'
      case 'cash':
        return '💵'
      case 'check':
        return '📄'
      default:
        return '💰'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      case 'stable':
      default:
        return '➡️'
    }
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <p className="text-sm text-gray-600">Distribution by payment method</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-64">
          <PieChart
            data={chartData}
            title=""
            subtitle=""
            height={250}
            showLegend={false}
          />
        </div>

        {/* Method breakdown */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getMethodIcon(item.method)}</span>
                <div>
                  <div className="font-medium text-gray-900 capitalize">
                    {item.method.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.count} payments
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  CHF {item.amount.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-1">{getTrendIcon(item.trend)}</span>
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PaymentPatternsChart
