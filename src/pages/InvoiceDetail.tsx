import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'

const InvoiceDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock invoice data - in real app this would come from API
  const invoice = {
    id: id || '1',
    number: 'INV-001',
    status: 'pending',
    customer: {
      name: 'Acme Corp',
      email: 'billing@acmecorp.com',
      phone: '+41 44 123 45 67',
      address: 'Musterstrasse 123\n8001 Zürich\nSwitzerland',
      vatNumber: 'CHE-123.456.789'
    },
    company: {
      name: 'InvoSmart AG',
      address: 'Techstrasse 456\n8002 Zürich\nSwitzerland',
      vatNumber: 'CHE-987.654.321',
      phone: '+41 44 987 65 43',
      email: 'info@invoSmart.ch'
    },
    date: '2024-11-01',
    dueDate: '2024-11-15',
    subtotal: 2500.00,
    vatRate: 7.7,
    vatAmount: 192.50,
    total: 2692.50,
    paidAmount: 0,
    lineItems: [
      {
        id: '1',
        description: 'Web Development Services',
        quantity: 40,
        unitPrice: 50.00,
        total: 2000.00
      },
      {
        id: '2',
        description: 'UI/UX Design',
        quantity: 10,
        unitPrice: 50.00,
        total: 500.00
      }
    ],
    notes: 'Thank you for your business! Please pay within 14 days.',
    files: [
      { id: '1', name: 'contract.pdf', size: '2.3 MB', uploadedAt: '2024-11-01' },
      { id: '2', name: 'proposal.docx', size: '1.1 MB', uploadedAt: '2024-10-28' }
    ],
    comments: [
      {
        id: '1',
        author: 'John Doe',
        message: 'Invoice created and sent to customer',
        timestamp: '2024-11-01 10:30'
      },
      {
        id: '2',
        author: 'Sarah Miller',
        message: 'Customer confirmed receipt, payment expected next week',
        timestamp: '2024-11-03 14:15'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'overdue':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/invoices')}
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Invoices
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Poppins'}}>
                {invoice.number}
              </h2>
              <p className="text-gray-600">Invoice Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {getStatusIcon(invoice.status)}
              <span className="ml-1 capitalize">{invoice.status}</span>
            </span>
            <Button variant="outline">Edit</Button>
            <Button variant="primary">Send Email</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{invoice.company.name}</p>
                    <p className="whitespace-pre-line">{invoice.company.address}</p>
                    <p>VAT: {invoice.company.vatNumber}</p>
                    <p>Phone: {invoice.company.phone}</p>
                    <p>Email: {invoice.company.email}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{invoice.customer.name}</p>
                    <p className="whitespace-pre-line">{invoice.customer.address}</p>
                    <p>VAT: {invoice.customer.vatNumber}</p>
                    <p>Phone: {invoice.customer.phone}</p>
                    <p>Email: {invoice.customer.email}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Invoice Date</p>
                  <p className="font-medium text-gray-900">{new Date(invoice.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900">CHF {invoice.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Paid Amount</p>
                  <p className="font-medium text-gray-900">CHF {invoice.paidAmount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Qty</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Unit Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{item.description}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">{item.quantity}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900">CHF {item.unitPrice.toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">CHF {item.total.toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">
                        Subtotal
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        CHF {invoice.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-4 px-4 text-right font-medium text-gray-900">
                        VAT ({invoice.vatRate}%)
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        CHF {invoice.vatAmount.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={3} className="py-4 px-4 text-right font-bold text-lg text-gray-900">
                        Total
                      </td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-900">
                        CHF {invoice.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{invoice.notes}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="primary" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2m-5.5-5.5l-5 5m0 0l-2.5-2.5L5 13.5" />
                </svg>
                Duplicate
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark as Paid
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </Button>
            </CardContent>
          </Card>

          {/* Files */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Files</CardTitle>
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoice.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size} • {file.uploadedAt}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Comments</CardTitle>
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-medium text-sm">
                        {comment.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail
