import React from 'react'

interface AIActionCardProps {
  type: 'customer' | 'invoice' | 'quote' | 'expense' | 'payment'
  data: any
  onExecute: (type: string, data: any) => void
  onCancel: () => void
}

const AIActionCard: React.FC<AIActionCardProps> = ({ type, data, onExecute, onCancel }) => {
  const getIcon = () => {
    switch (type) {
      case 'customer': return '👤'
      case 'invoice': return '📄'
      case 'quote': return '💼'
      case 'expense': return '💰'
      case 'payment': return '💳'
      default: return '✨'
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'customer': return 'Create Customer'
      case 'invoice': return 'Create Invoice'
      case 'quote': return 'Create Quote'
      case 'expense': return 'Create Expense'
      case 'payment': return 'Import Payment'
      default: return 'Execute Action'
    }
  }

  const getColor = () => {
    switch (type) {
      case 'customer': return 'from-purple-500 to-purple-600'
      case 'invoice': return 'from-blue-500 to-blue-600'
      case 'quote': return 'from-green-500 to-green-600'
      case 'expense': return 'from-red-500 to-red-600'
      case 'payment': return 'from-orange-500 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const renderData = () => {
    switch (type) {
      case 'customer':
        return (
          <div className="space-y-2 text-sm">
            <div><strong>Name:</strong> {data.name}</div>
            {data.email && <div><strong>Email:</strong> {data.email}</div>}
            {data.phone && <div><strong>Phone:</strong> {data.phone}</div>}
            {data.city && <div><strong>City:</strong> {data.city}</div>}
            {data.address && <div><strong>Address:</strong> {data.address}</div>}
          </div>
        )

      case 'invoice':
      case 'quote':
        return (
          <div className="space-y-2 text-sm">
            <div><strong>Customer:</strong> {data.customerName}</div>
            <div><strong>Amount:</strong> CHF {data.amount?.toFixed(2)}</div>
            {data.description && <div><strong>Description:</strong> {data.description}</div>}
          </div>
        )

      case 'expense':
        return (
          <div className="space-y-2 text-sm">
            <div><strong>Amount:</strong> CHF {data.amount?.toFixed(2)}</div>
            <div><strong>Category:</strong> {data.category || 'General'}</div>
            {data.description && <div><strong>Description:</strong> {data.description}</div>}
            {data.date && <div><strong>Date:</strong> {data.date}</div>}
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-2 text-sm">
            <div><strong>Amount:</strong> CHF {data.amount?.toFixed(2)}</div>
            {data.reference && <div><strong>Reference:</strong> {data.reference}</div>}
            {data.debtorName && <div><strong>From:</strong> {data.debtorName}</div>}
            {data.date && <div><strong>Date:</strong> {data.date}</div>}
          </div>
        )

      default:
        return <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 mt-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getIcon()}</span>
          <h3 className="font-semibold text-gray-900">{getTitle()}</h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          Ready to create
        </span>
      </div>

      <div className="bg-white rounded-lg p-3 mb-3 border border-gray-100">
        {renderData()}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onExecute(type, data)}
          className={`flex-1 bg-gradient-to-r ${getColor()} text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Create Now
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default AIActionCard

