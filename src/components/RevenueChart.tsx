import React from 'react'
import LineChart from './LineChart'

const RevenueChart: React.FC = () => {
  // TODO: Replace with real API call when revenue data API is available
  const revenueData = [
    { x: 'Jan', y: 12000 },
    { x: 'Feb', y: 15000 },
    { x: 'Mar', y: 18000 },
    { x: 'Apr', y: 14000 },
    { x: 'May', y: 22000 },
    { x: 'Jun', y: 25000 }
  ]

  return (
    <LineChart
      data={revenueData}
      title="Revenue Trend"
      subtitle="Monthly revenue over time"
      height={300}
      color="#f97316"
      showArea={true}
      showDots={true}
      showGrid={true}
    />
  )
}

export default RevenueChart