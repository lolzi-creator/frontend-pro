import React, { useState, useEffect } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'
import StatsCard from '../components/StatsCard'
import RecentActivity from '../components/RecentActivity'
import DashboardCustomizeModal, { getAvailableWidgets } from '../components/DashboardCustomizeModal'
import { LoadingSpinner, CardSkeleton, Alert } from '../components'
import { apiClient } from '../lib/api'

// Widget components - will receive translations as props
const TotalRevenueWidget: React.FC<{ stats: any; title: string; fromLastMonth: string }> = ({ stats, title, fromLastMonth }) => (
  <StatsCard
    title={title}
    value={stats?.totalRevenue ? `CHF ${stats.totalRevenue.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'CHF 0.00'}
    change={stats?.revenueChange !== undefined ? `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange.toFixed(1)}% ${fromLastMonth}` : 'No data'}
    changeType={stats?.revenueChange !== undefined ? (stats.revenueChange >= 0 ? 'positive' : 'negative') : 'neutral'}
    color="orange"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    }
  />
)

const OutstandingWidget: React.FC<{ stats: any; title: string; totalInvoicesLabel: string }> = ({ stats, title, totalInvoicesLabel }) => (
  <StatsCard
    title={title}
    value={stats?.outstandingInvoices ? `CHF ${stats.outstandingInvoices.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'CHF 0.00'}
    change={stats?.totalInvoices ? `${stats.totalInvoices} ${totalInvoicesLabel}` : 'No invoices'}
    changeType="neutral"
    color="teal"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    }
  />
)

const NewCustomersWidget: React.FC<{ stats: any; title: string; totalCustomersLabel: string }> = ({ stats, title, totalCustomersLabel }) => (
  <StatsCard
    title={title}
    value={stats?.newCustomers ? stats.newCustomers.toString() : '0'}
    change={stats?.totalCustomers ? `${stats.totalCustomers} ${totalCustomersLabel}` : 'No customers'}
    changeType="neutral"
    color="blue"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
  />
)

const QuotesSentWidget: React.FC<{ stats: any; title: string; totalQuotesLabel: string }> = ({ stats, title, totalQuotesLabel }) => (
  <StatsCard
    title={title}
    value={stats?.quotesSent ? stats.quotesSent.toString() : '0'}
    change={stats?.totalQuotes ? `${stats.totalQuotes} ${totalQuotesLabel}` : 'No quotes'}
    changeType="neutral"
    color="purple"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    }
  />
)

const ExpensesWidget: React.FC<{ stats: any; title: string; totalExpensesLabel: string }> = ({ stats, title, totalExpensesLabel }) => (
  <StatsCard
    title={title}
    value={stats?.thisMonthExpenses ? `CHF ${stats.thisMonthExpenses.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'CHF 0.00'}
    change={stats?.totalExpenses ? `${stats.totalExpenses} ${totalExpensesLabel}` : 'No expenses'}
    changeType="neutral"
    color="red"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
  />
)

const NetProfitWidget: React.FC<{ stats: any; title: string; thisMonth: string }> = ({ stats, title, thisMonth }) => (
  <StatsCard
    title={title}
    value={stats?.netProfit ? `CHF ${stats.netProfit.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'CHF 0.00'}
    change={thisMonth}
    changeType={stats?.netProfit && stats.netProfit >= 0 ? 'positive' : 'negative'}
    color="green"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    }
  />
)

const OverdueWidget: React.FC<{ stats: any; title: string; actionRequired: string; allPaidOnTime: string }> = ({ stats, title, actionRequired, allPaidOnTime }) => (
  <StatsCard
    title={title}
    value={stats?.overdueCount ? stats.overdueCount.toString() : '0'}
    change={stats?.overdueCount && stats.overdueCount > 0 ? actionRequired : allPaidOnTime}
    changeType={stats?.overdueCount && stats.overdueCount > 0 ? 'negative' : 'positive'}
    color="red"
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    }
  />
)

const SimpleDashboard: React.FC = () => {
  const { stats, loading, error, refetch } = useDashboard()
  const { showError, showSuccess } = useToast()
  const { t } = useLanguage()
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>([])
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)

  // Load user preferences on mount
  useEffect(() => {
    loadUserPreferences()
  }, [])

  const loadUserPreferences = async () => {
    try {
      const availableWidgets = getAvailableWidgets(t)
      const userData = localStorage.getItem('user')
      if (!userData) {
        // Use defaults if no user
        const defaults = availableWidgets.filter((w: any) => w.defaultVisible).map((w: any) => w.id)
        setVisibleWidgets(defaults)
        return
      }

      // Try to get from localStorage first
      const saved = localStorage.getItem('dashboard-widgets')
      if (saved) {
        setVisibleWidgets(JSON.parse(saved))
      } else {
        // Use defaults
        const defaults = availableWidgets.filter((w: any) => w.defaultVisible).map((w: any) => w.id)
        setVisibleWidgets(defaults)
        // Save defaults
        localStorage.setItem('dashboard-widgets', JSON.stringify(defaults))
      }
    } catch (err) {
      console.error('Error loading dashboard preferences:', err)
      const availableWidgets = getAvailableWidgets(t)
      const defaults = availableWidgets.filter((w: any) => w.defaultVisible).map((w: any) => w.id)
      setVisibleWidgets(defaults)
    }
  }

  const handleSaveWidgets = (widgets: Array<{ id: string; visible: boolean; order: number }>) => {
    try {
      // Save to localStorage (can be moved to backend later)
      const visibleIds = widgets.filter(w => w.visible).map(w => w.id)
      localStorage.setItem('dashboard-widgets', JSON.stringify(visibleIds))
      setVisibleWidgets(visibleIds)
      showSuccess(t.dashboard.dashboardUpdated, t.dashboard.preferencesSaved)
    } catch (err) {
      console.error('Error saving dashboard preferences:', err)
      showError(t.common.error, t.dashboard.failedToSave)
    }
  }

  useEffect(() => {
    if (error) {
      showError(t.dashboard.failedToLoad, t.dashboard.tryAgain)
    }
  }, [error, showError, t])

  // Widget renderer
  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'total-revenue':
        return <TotalRevenueWidget key={widgetId} stats={stats} title={t.dashboard.totalRevenue} fromLastMonth={t.dashboard.fromLastMonth} />
      case 'outstanding':
        return <OutstandingWidget key={widgetId} stats={stats} title={t.dashboard.outstanding} totalInvoicesLabel={t.dashboard.totalInvoicesLabel} />
      case 'new-customers':
        return <NewCustomersWidget key={widgetId} stats={stats} title={t.dashboard.newCustomers} totalCustomersLabel={t.dashboard.totalCustomersLabel} />
      case 'quotes-sent':
        return <QuotesSentWidget key={widgetId} stats={stats} title={t.dashboard.quotesSent} totalQuotesLabel={t.dashboard.totalQuotesLabel} />
      case 'expenses':
        return <ExpensesWidget key={widgetId} stats={stats} title={t.dashboard.thisMonthExpenses} totalExpensesLabel={t.dashboard.totalExpensesLabel} />
      case 'net-profit':
        return <NetProfitWidget key={widgetId} stats={stats} title={t.dashboard.netProfit} thisMonth={t.dashboard.thisMonth} />
      case 'overdue-count':
        return <OverdueWidget key={widgetId} stats={stats} title={t.dashboard.overdueInvoices} actionRequired={t.dashboard.actionRequired} allPaidOnTime={t.dashboard.allPaidOnTime} />
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
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} showActions={false} lines={2} />
            ))}
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
            title={t.dashboard.failedToLoad}
            message={error}
            onClose={() => refetch()}
          >
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t.dashboard.tryAgain}
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
                {t.dashboard.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {t.dashboard.subtitle}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCustomizeModal(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {t.dashboard.customize}
              </button>
              <button
                onClick={() => refetch()}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t.dashboard.refresh}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Dynamic based on visible widgets */}
        {visibleWidgets.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            {visibleWidgets
              .filter(id => id !== 'recent-invoices')
              .map(widgetId => renderWidget(widgetId))
            }
          </div>
        ) : (
          <div className="mb-6 lg:mb-8 p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-4">{t.dashboard.noWidgets}</p>
            <button
              onClick={() => setShowCustomizeModal(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t.dashboard.customizeDashboard}
            </button>
          </div>
        )}

        {/* Recent Invoices - Only show if widget is visible */}
        {visibleWidgets.includes('recent-invoices') && (
          <div className="mb-8">
            <RecentActivity 
              recentInvoices={stats?.recentInvoices || []}
              recentActivity={stats?.recentActivity || []}
            />
          </div>
        )}

        {/* Customize Modal */}
        <DashboardCustomizeModal
          isOpen={showCustomizeModal}
          onClose={() => setShowCustomizeModal(false)}
          widgetPreferences={visibleWidgets.map((id, index) => ({ id, visible: true, order: index }))}
          availableWidgets={getAvailableWidgets(t)}
          onSave={handleSaveWidgets}
        />
      </main>
    </div>
  )
}

export default SimpleDashboard

