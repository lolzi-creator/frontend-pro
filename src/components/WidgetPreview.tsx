import React from 'react'
import Modal from './Modal'
import { useLanguage } from '../contexts/LanguageContext'
import type { DashboardWidget } from './DashboardCustomizeModal'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'

interface WidgetPreviewProps {
  widget: DashboardWidget
  isOpen: boolean
  onClose: () => void
  stats?: any
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ widget, isOpen, onClose, stats }) => {
  const { t } = useLanguage()

  const renderPreview = () => {
    switch (widget.id) {
      case 'total-revenue':
        return (
          <StatsCard
            title={t.dashboard.totalRevenue}
            value={stats?.totalRevenue ? `CHF ${stats.totalRevenue.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'CHF 12,345.67'}
            change={stats?.revenueChange !== undefined ? `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange.toFixed(1)}% ${t.dashboard.fromLastMonth || 'from last month'}` : '+5.2% from last month'}
            changeType={stats?.revenueChange !== undefined ? (stats.revenueChange >= 0 ? 'positive' : 'negative') : 'positive'}
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
            value={stats?.outstandingInvoices ? `CHF ${stats.outstandingInvoices.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'CHF 8,234.56'}
            change={stats?.overdueCount ? `${stats.overdueCount} invoices overdue` : '3 invoices overdue'}
            changeType={stats?.overdueCount && stats.overdueCount > 0 ? 'negative' : 'negative'}
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
            value={stats?.newCustomers ? stats.newCustomers.toString() : '12'}
            change={stats?.customersChange !== undefined ? `${stats.customersChange >= 0 ? '+' : ''}${stats.customersChange.toFixed(1)}% ${t.dashboard.fromLastMonth || 'from last month'}` : '+8.3% from last month'}
            changeType={stats?.customersChange !== undefined ? (stats.customersChange >= 0 ? 'positive' : 'negative') : 'positive'}
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
            value={stats?.quotesSent ? stats.quotesSent.toString() : '24'}
            change={stats?.quotesChange !== undefined ? `${stats.quotesChange >= 0 ? '+' : ''}${stats.quotesChange.toFixed(1)}% ${t.dashboard.fromLastMonth || 'from last month'}` : '+12.5% from last month'}
            changeType={stats?.quotesChange !== undefined ? (stats.quotesChange >= 0 ? 'positive' : 'negative') : 'positive'}
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
          <div className="max-h-96 overflow-hidden">
            <RecentActivity recentInvoices={stats?.recentInvoices || []} />
          </div>
        )

      default:
        return (
          <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{widget.title}</h3>
            <p className="text-sm text-gray-600">{widget.description}</p>
            <p className="text-xs text-gray-500 mt-4">Preview coming soon</p>
          </div>
        )
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t.dashboard.widgetPreview || 'Preview'}: ${widget.title}`} size="lg">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          {renderPreview()}
        </div>
        <div className="text-center pt-2 border-t">
          <p className="text-sm text-gray-600">{widget.description}</p>
        </div>
      </div>
    </Modal>
  )
}

export default WidgetPreview

