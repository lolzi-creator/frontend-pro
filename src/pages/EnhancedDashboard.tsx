import React, { useEffect, useState } from 'react'
import { useEnhancedDashboard } from '../hooks/useEnhancedDashboard'
import { useToast } from '../contexts/ToastContext'
import { 
  LoadingSpinner, 
  CardSkeleton, 
  Alert, 
  KPIMetric, 
  RevenueForecastChart, 
  PaymentPatternsChart, 
  DashboardWidget, 
  ExportModal 
} from '../components'

const EnhancedDashboard: React.FC = () => {
  const { data, loading, error, refetch } = useEnhancedDashboard()
  const { showError, showInfo } = useToast()
  const [exportModal, setExportModal] = useState(false)

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      showError('Dashboard Error', 'Failed to load dashboard data. Please try again.')
    }
  }, [error, showError])

  const handleExport = (format: 'pdf' | 'excel', options: any) => {
    console.log('Exporting dashboard:', format, options)
    showInfo('Export Started', `Dashboard data is being exported as ${format.toUpperCase()}.`)
  }

  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 lg:py-8">
          {/* Page Header Skeleton */}
          <div className="mb-4 lg:mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>

          {/* KPI Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} showActions={false} lines={3} />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CardSkeleton showImage={false} lines={4} />
            <CardSkeleton showImage={false} lines={4} />
          </div>

          {/* Bottom Row Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSkeleton showImage={false} lines={3} />
            <CardSkeleton showImage={false} lines={3} />
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto">
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 lg:py-8">
          <Alert
            type="error"
            title="Failed to Load Dashboard"
            message={error}
            onClose={() => refetch()}
          >
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </Alert>
        </main>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 lg:py-8">
        {/* Page Header */}
        <div className="mb-4 lg:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-1" style={{fontFamily: 'Poppins'}}>
                Enhanced Dashboard
              </h2>
              <p className="text-gray-600 text-sm">
                Advanced analytics and business insights
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => refetch()}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => setExportModal(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {data?.kpis.map((kpi) => (
            <KPIMetric
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              previousValue={kpi.previousValue}
              change={kpi.change}
              changeType={kpi.changeType}
              format={kpi.format}
              trend={kpi.trend}
              icon={kpi.icon}
              color={kpi.color}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueForecastChart 
            data={data?.forecast || []} 
            className="col-span-1"
          />
          <PaymentPatternsChart 
            data={data?.paymentPatterns || []} 
            className="col-span-1"
          />
        </div>

        {/* Revenue Trend Chart */}
        <div className="mb-8">
          <DashboardWidget
            id="revenue-trend"
            title="Revenue Trend Analysis"
            size="large"
          >
            <div className="h-80">
              {/* This would use the enhanced LineChart with more features */}
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Revenue Chart</h3>
                  <p className="text-gray-500">Enhanced chart with zoom, pan, and drill-down capabilities</p>
                </div>
              </div>
            </div>
          </DashboardWidget>
        </div>

        {/* Bottom Row - Recent Activity and Top Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardWidget
            id="recent-activity"
            title="Recent Activity"
            size="medium"
          >
            <div className="space-y-4">
              {data?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>

          <DashboardWidget
            id="top-customers"
            title="Top Customers"
            size="medium"
          >
            <div className="space-y-4">
              {data?.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{customer.name}</h4>
                    <p className="text-sm text-gray-500">{customer.invoices} invoices</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">CHF {customer.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Last: {customer.lastPayment}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>

        {/* Export Modal */}
        <ExportModal
          isOpen={exportModal}
          onClose={() => setExportModal(false)}
          onExport={handleExport}
        />
      </main>
    </div>
  )
}

export default EnhancedDashboard
