import React, { useEffect, useState, useMemo } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useWidgetPreferences } from '../hooks/useWidgetPreferences'
import { getAvailableWidgets } from '../components/DashboardCustomizeModal'
import StatsCard from '../components/StatsCard'
import RecentActivity from '../components/RecentActivity'
import DashboardCustomizeModal from '../components/DashboardCustomizeModal'
import { LoadingSpinner, CardSkeleton, Alert } from '../components'
import { Settings } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { stats, loading, error, refetch } = useDashboard()
  const { showError, showInfo } = useToast()
  const { t } = useLanguage()
  const {
    widgetPreferences,
    visibleWidgets,
    saveWidgetPreferences,
    addWidget,
    removeWidget,
    isWidgetVisible,
  } = useWidgetPreferences()
  
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)
  const availableWidgets = getAvailableWidgets(t)

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      showError('Dashboard Error', 'Failed to load dashboard data. Please try again.')
    }
  }, [error, showError])

  const handleWidgetToggle = (widgetId: string) => {
    if (isWidgetVisible(widgetId)) {
      removeWidget(widgetId)
      showInfo(t.dashboard.widgetRemoved || 'Widget removed', t.dashboard.widgetRemoved || 'Widget has been removed from your dashboard')
    } else {
      addWidget(widgetId)
      showInfo(t.dashboard.widgetAdded || 'Widget added', t.dashboard.widgetAdded || 'Widget has been added to your dashboard')
    }
  }

  const renderWidget = (widgetId: string) => {
    const widget = availableWidgets.find(w => w.id === widgetId)
    if (!widget) {
      return null
    }

    switch (widgetId) {
      case 'total-revenue':
        return (
          <StatsCard
            title={t.dashboard.totalRevenue}
            value={stats?.totalRevenue ? `CHF ${stats.totalRevenue.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'CHF 0.00'}
            change={stats?.revenueChange !== undefined ? `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange.toFixed(1)}% ${t.dashboard.fromLastMonth || 'from last month'}` : t.dashboard.noData || 'No data'}
            changeType={stats?.revenueChange !== undefined ? (stats.revenueChange >= 0 ? 'positive' : 'negative') : 'neutral'}
            color="orange"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
        )

      case 'outstanding':
        return (
          <StatsCard
            title={t.dashboard.outstanding}
            value={stats?.outstandingInvoices ? `CHF ${stats.outstandingInvoices.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'CHF 0.00'}
            change={stats?.overdueCount ? `${stats.overdueCount} ${stats.overdueCount === 1 ? 'invoice' : 'invoices'} ${t.dashboard.overdue || 'overdue'}` : t.dashboard.allPaidOnTime || t.dashboard.allPaid || 'All paid'}
            changeType={stats?.overdueCount && stats.overdueCount > 0 ? 'negative' : 'neutral'}
            color="teal"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        )

      case 'new-customers':
        return (
          <StatsCard
            title={t.dashboard.newCustomers}
            value={stats?.newCustomers ? stats.newCustomers.toString() : '0'}
            change={stats?.customersChange !== undefined ? `${stats.customersChange >= 0 ? '+' : ''}${stats.customersChange.toFixed(1)}% ${t.dashboard.fromLastMonth || 'from last month'}` : t.dashboard.noData || 'No data'}
            changeType={stats?.customersChange !== undefined ? (stats.customersChange >= 0 ? 'positive' : 'negative') : 'neutral'}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        )

      case 'quotes-sent':
        return (
          <StatsCard
            title={t.dashboard.quotesSent}
            value={stats?.quotesSent ? stats.quotesSent.toString() : '0'}
            change={stats?.quotesChange !== undefined ? `${stats.quotesChange >= 0 ? '+' : ''}${stats.quotesChange.toFixed(1)}% ${t.dashboard.fromLastMonth || 'from last month'}` : t.dashboard.noData || 'No data'}
            changeType={stats?.quotesChange !== undefined ? (stats.quotesChange >= 0 ? 'positive' : 'negative') : 'neutral'}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        )

      case 'recent-invoices':
        return (
          <div key={widgetId} className="lg:col-span-2">
            <RecentActivity recentInvoices={stats?.recentInvoices || []} />
          </div>
        )


      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 lg:py-8">
          <div className="mb-4 lg:mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} showActions={false} lines={2} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <CardSkeleton showImage={false} lines={4} />
            </div>
            <div className="lg:col-span-1">
              <CardSkeleton showImage={false} lines={3} />
            </div>
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

  // Separate widgets into stats cards and other widgets
  const statsWidgetIds = ['total-revenue', 'outstanding', 'new-customers', 'quotes-sent']
  const statsWidgets = useMemo(() => visibleWidgets.filter(id => statsWidgetIds.includes(id)), [visibleWidgets])
  const otherWidgets = useMemo(() => visibleWidgets.filter(id => !statsWidgetIds.includes(id)), [visibleWidgets])
  
  // Debug: Log widget state (can be removed after testing)
  useEffect(() => {
    console.log('Dashboard Debug:', {
      visibleWidgets,
      statsWidgets,
      otherWidgets,
      widgetPreferences: widgetPreferences.filter(wp => wp.visible),
      widgetPreferencesCount: widgetPreferences.length,
      allVisiblePrefs: widgetPreferences.filter(wp => wp.visible).map(wp => wp.id),
      localStorageNew: localStorage.getItem('dashboard_widget_preferences'),
      localStorageOld: localStorage.getItem('dashboard-widgets')
    })
  }, [visibleWidgets, statsWidgets, otherWidgets, widgetPreferences])

  return (
    <div className="h-full overflow-y-auto">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 lg:py-8">
        {/* Page Header */}
        <div className="mb-4 lg:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-1" style={{fontFamily: 'Poppins'}}>
                {t.dashboard.title || 'Dashboard'}
              </h2>
              <p className="text-gray-600 text-sm">
                {t.dashboard.subtitle || 'Manage your invoices, quotes, and business finances'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCustomizeModal(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t.dashboard.customizeDashboard || 'Customize'}
              </button>
              <button
                onClick={() => refetch()}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t.dashboard.refresh || 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards Row */}
        {statsWidgets.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            {statsWidgets.map((widgetId) => (
              <div key={widgetId}>{renderWidget(widgetId)}</div>
            ))}
          </div>
        )}

        {/* Other Widgets - Dynamic Grid */}
        {otherWidgets.length > 0 && (
          <div className="space-y-6">
            {otherWidgets.map((widgetId) => (
              <div key={widgetId}>
                {renderWidget(widgetId)}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {visibleWidgets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t.dashboard.noWidgets || 'No widgets selected'}</p>
            <button
              onClick={() => setShowCustomizeModal(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {t.dashboard.customizeDashboard || 'Customize Dashboard'}
            </button>
          </div>
        )}
      </main>

      {/* Customize Modal */}
      <DashboardCustomizeModal
        isOpen={showCustomizeModal}
        onClose={() => {
          setShowCustomizeModal(false)
          // Force a re-render by checking localStorage again
          // The hook should automatically update, but this ensures it
        }}
        widgetPreferences={widgetPreferences}
        availableWidgets={availableWidgets}
        onSave={saveWidgetPreferences}
      />
    </div>
  )
}

export default Dashboard
