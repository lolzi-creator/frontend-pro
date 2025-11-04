import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

interface RecentInvoice {
  id: string
  number: string
  total: number
  status: string
  date: string
}

interface AuditLogEntry {
  id: string
  type: string
  action: string
  resourceId?: string
  details?: any
  userName: string
  timestamp: string
}

interface RecentActivityProps {
  recentInvoices?: RecentInvoice[]
  recentActivity?: AuditLogEntry[]
}

const RecentActivity: React.FC<RecentActivityProps> = ({ recentInvoices = [], recentActivity = [] }) => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return t.dashboard.justNow || 'Just now'
      if (diffMins < 60) return `${diffMins} ${t.dashboard.minutesAgo || 'min ago'}`
      if (diffHours < 24) return `${diffHours} ${diffHours > 1 ? (t.dashboard.hoursAgo || 'hours ago') : (t.dashboard.hourAgo || 'hour ago')}`
      if (diffDays < 7) return `${diffDays} ${diffDays > 1 ? (t.dashboard.daysAgo || 'days ago') : (t.dashboard.dayAgo || 'day ago')}`
      
      return date.toLocaleDateString('de-CH', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getActionLabel = (action: string) => {
    const actionMap: { [key: string]: string } = {
      'INVOICE_CREATED': t.dashboard.actionInvoiceCreated || 'Created invoice',
      'INVOICE_UPDATED': t.dashboard.actionInvoiceUpdated || 'Updated invoice',
      'INVOICE_STATUS_UPDATED': t.dashboard.actionInvoiceStatusUpdated || 'Updated invoice status',
      'INVOICE_DELETED': t.dashboard.actionInvoiceDeleted || 'Deleted invoice',
      'INVOICE_REMINDER_SENT': t.dashboard.actionInvoiceReminderSent || 'Sent reminder',
      'CUSTOMER_CREATED': t.dashboard.actionCustomerCreated || 'Created customer',
      'CUSTOMER_UPDATED': t.dashboard.actionCustomerUpdated || 'Updated customer',
      'CUSTOMER_DELETED': t.dashboard.actionCustomerDeleted || 'Deleted customer',
      'QUOTE_CREATED': t.dashboard.actionQuoteCreated || 'Created quote',
      'QUOTE_UPDATED': t.dashboard.actionQuoteUpdated || 'Updated quote',
      'QUOTE_STATUS_UPDATED': t.dashboard.actionQuoteStatusUpdated || 'Updated quote status',
      'QUOTE_SENT': t.dashboard.actionQuoteSent || 'Sent quote',
      'QUOTE_ACCEPTED': t.dashboard.actionQuoteAccepted || 'Accepted quote',
      'QUOTE_DELETED': t.dashboard.actionQuoteDeleted || 'Deleted quote',
      'PAYMENT_IMPORTED': t.dashboard.actionPaymentImported || 'Imported payments',
      'PAYMENT_MATCHED': t.dashboard.actionPaymentMatched || 'Matched payment',
      'EXPENSE_CREATED': t.dashboard.actionExpenseCreated || 'Created expense',
      'EXPENSE_UPDATED': t.dashboard.actionExpenseUpdated || 'Updated expense',
      'EXPENSE_APPROVED': t.dashboard.actionExpenseApproved || 'Approved expense',
      'EXPENSE_PAID': t.dashboard.actionExpensePaid || 'Marked expense as paid',
      'EXPENSE_DELETED': t.dashboard.actionExpenseDeleted || 'Deleted expense'
    }
    return actionMap[action] || action.replace(/_/g, ' ').toLowerCase()
  }

  const getActionIcon = (action: string, type: string) => {
    if (action.includes('INVOICE') || type === 'invoice') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
    if (action.includes('QUOTE') || type === 'quote') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
    if (action.includes('CUSTOMER') || type === 'customer') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
    if (action.includes('PAYMENT') || type === 'payment') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
    if (action.includes('EXPENSE') || type === 'expense') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  const getActionColor = (action: string) => {
    if (action.includes('CREATED')) return 'bg-blue-100 text-blue-600'
    if (action.includes('UPDATED')) return 'bg-orange-100 text-orange-600'
    if (action.includes('DELETED')) return 'bg-red-100 text-red-600'
    if (action.includes('SENT') || action.includes('SENT')) return 'bg-green-100 text-green-600'
    if (action.includes('APPROVED') || action.includes('PAID')) return 'bg-teal-100 text-teal-600'
    return 'bg-gray-100 text-gray-600'
  }

  const handleActivityClick = (activity: AuditLogEntry) => {
    if (!activity.resourceId) return
    
    const routeMap: { [key: string]: string } = {
      'invoice': '/invoices',
      'customer': '/customers',
      'quote': '/quotes',
      'payment': '/payments',
      'expense': '/expenses'
    }
    
    const baseRoute = routeMap[activity.type]
    if (baseRoute) {
      navigate(`${baseRoute}/${activity.resourceId}`)
    }
  }

  // Use audit logs if available, otherwise fall back to invoices
  const displayActivity = recentActivity.length > 0 ? recentActivity : recentInvoices.map(inv => ({
    id: inv.id,
    type: 'invoice',
    action: 'INVOICE_CREATED',
    resourceId: inv.id,
    details: { invoiceNumber: inv.number, total: inv.total, status: inv.status },
    userName: '',
    timestamp: inv.date
  })) as any

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.dashboard.recentActivity}</CardTitle>
      </CardHeader>
      <CardContent>
        {displayActivity.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">{t.dashboard.noRecentActivity || 'No recent activity'}</h3>
            <p className="text-sm text-gray-500">{t.dashboard.activityWillAppear || 'Activity will appear here as you use the system'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayActivity.slice(0, 20).map((activity: any) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors ${
                  activity.resourceId ? 'cursor-pointer' : ''
                }`}
                onClick={() => activity.resourceId && handleActivityClick(activity)}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(activity.action)}`}>
                  {getActionIcon(activity.action, activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {getActionLabel(activity.action)}
                    </p>
                    <p className="text-xs text-gray-400 ml-2">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  {activity.details && (
                    <div className="mt-1">
                      {activity.details.invoiceNumber && (
                        <p className="text-xs text-gray-600">
                          {t.invoice.title} {activity.details.invoiceNumber}
                          {activity.details.total && ` • CHF ${activity.details.total.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </p>
                      )}
                      {activity.details.customerName && (
                        <p className="text-xs text-gray-600">{t.customer.title}: {activity.details.customerName}</p>
                      )}
                      {activity.details.quoteNumber && (
                        <p className="text-xs text-gray-600">
                          {t.quote.title} {activity.details.quoteNumber}
                          {activity.details.total && ` • CHF ${activity.details.total.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </p>
                      )}
                      {activity.details.title && (
                        <p className="text-xs text-gray-600">
                          {activity.details.title}
                          {activity.details.amount && ` • CHF ${activity.details.amount.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </p>
                      )}
                      {activity.details.count !== undefined && (
                        <p className="text-xs text-gray-600">
                          {activity.details.count} {activity.details.count !== 1 ? (t.dashboard.paymentsImported || 'payments imported') : (t.dashboard.paymentImported || 'payment imported')}
                          {activity.details.automaticallyMatched !== undefined && activity.details.automaticallyMatched > 0 && 
                            ` • ${activity.details.automaticallyMatched} ${t.dashboard.autoMatched || 'auto-matched'}`}
                        </p>
                      )}
                      {activity.details.amount && !activity.details.title && !activity.details.invoiceNumber && (
                        <p className="text-xs text-gray-600">
                          {t.invoice.amount}: CHF {activity.details.amount.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  )}
                  {activity.userName && (
                    <p className="text-xs text-gray-500 mt-1">{t.dashboard.by || 'by'} {activity.userName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivity
