import React from 'react'
import { useDashboard } from '../hooks/useDashboard'
import StatsCard from '../components/StatsCard'
import RecentActivity from '../components/RecentActivity'
import QuickActions from '../components/QuickActions'
import OverdueAlerts from '../components/OverdueAlerts'
import RevenueChart from '../components/RevenueChart'

const Dashboard: React.FC = () => {
  const { stats, loading, error } = useDashboard()

  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 lg:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 mb-2">Failed to load dashboard</p>
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 lg:py-8">
        {/* Page Header */}
        <div className="mb-4 lg:mb-6">
          <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-1" style={{fontFamily: 'Poppins'}}>
            Dashboard
          </h2>
          <p className="text-gray-600 text-sm">
            Manage your invoices, quotes, and business finances
          </p>
        </div>

        {/* Main Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <StatsCard
            title="Total Revenue"
            value={stats?.totalRevenue ? `CHF ${stats.totalRevenue.toLocaleString('de-CH')}` : 'CHF 0'}
            change="+12.5% from last month"
            changeType="positive"
            color="orange"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
          <StatsCard
            title="Outstanding Invoices"
            value={stats?.outstandingInvoices ? `CHF ${stats.outstandingInvoices.toLocaleString('de-CH')}` : 'CHF 0'}
            change="5 invoices pending"
            changeType="neutral"
            color="teal"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatsCard
            title="New Customers"
            value={stats?.newCustomers ? stats.newCustomers.toString() : '0'}
            change="+18.3% from last month"
            changeType="positive"
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Quotes Sent"
            value={stats?.quotesSent ? stats.quotesSent.toString() : '0'}
            change="+8.1% from last month"
            changeType="positive"
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <RevenueChart />
          
          {/* Overdue Alerts */}
          <OverdueAlerts />
        </div>
      </main>
    </div>
  )
}

export default Dashboard

