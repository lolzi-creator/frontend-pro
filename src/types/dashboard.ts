export interface KPIMetric {
  id: string
  title: string
  value: number
  previousValue: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  format: 'currency' | 'number' | 'percentage'
  trend: 'up' | 'down' | 'stable'
  icon: string
  color: string
}

export interface ChartDataPoint {
  x: string | number
  y: number
  label?: string
  color?: string
}

export interface RevenueForecast {
  period: string
  actual: number
  forecast: number
  confidence: number
}

export interface PaymentPattern {
  method: string
  count: number
  amount: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

export interface DashboardWidget {
  id: string
  type: 'chart' | 'metric' | 'table' | 'list'
  title: string
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number; w: number; h: number }
  config: any
  visible: boolean
}

export interface DashboardData {
  kpis: KPIMetric[]
  revenueData: ChartDataPoint[]
  paymentPatterns: PaymentPattern[]
  forecast: RevenueForecast[]
  recentActivity: any[]
  overdueInvoices: any[]
  topCustomers: any[]
  widgets: DashboardWidget[]
}



