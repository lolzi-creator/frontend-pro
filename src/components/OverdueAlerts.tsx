import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'

interface OverdueInvoice {
  id: string
  number: string
  customer: string
  amount: string
  daysOverdue: number
  dueDate: string
}

const OverdueAlerts: React.FC = () => {
  // TODO: Replace with real API call when overdue invoices API is available
  const overdueInvoices: OverdueInvoice[] = []

  const getDaysOverdueColor = (days: number) => {
    if (days <= 7) return 'text-warning-600'
    if (days <= 30) return 'text-orange-600'
    return 'text-error-600'
  }

  const getDaysOverdueBg = (days: number) => {
    if (days <= 7) return 'bg-warning-100'
    if (days <= 30) return 'bg-orange-100'
    return 'bg-error-100'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Overdue Invoices
        </CardTitle>
      </CardHeader>
      <CardContent>
        {overdueInvoices.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">All caught up!</h3>
            <p className="text-sm text-gray-500">No overdue invoices at the moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {overdueInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {invoice.number}
                    </p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDaysOverdueBg(invoice.daysOverdue)} ${getDaysOverdueColor(invoice.daysOverdue)}`}>
                      {invoice.daysOverdue} days
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {invoice.customer}
                  </p>
                  <p className="text-xs text-gray-400">
                    Due: {invoice.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {invoice.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OverdueAlerts