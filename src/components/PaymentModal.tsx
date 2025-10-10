import React, { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSave }) => {
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'CHF',
    paymentMethod: 'bank_transfer',
    reference: '',
    description: '',
    paidAt: new Date().toISOString().split('T')[0],
    invoiceId: '',
    notes: ''
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onSave(formData)
      showSuccess('Payment Added!', `Payment of ${formData.amount} ${formData.currency} has been recorded successfully.`)
      onClose()
      
      // Reset form
      setFormData({
        amount: '',
        currency: 'CHF',
        paymentMethod: 'bank_transfer',
        reference: '',
        description: '',
        paidAt: new Date().toISOString().split('T')[0],
        invoiceId: '',
        notes: ''
      })
    } catch (error) {
      showError('Failed to Add Payment', 'There was an error adding the payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'credit_card', label: 'Credit Card', icon: '💳' },
    { value: 'paypal', label: 'PayPal', icon: '🅿️' },
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'check', label: 'Check', icon: '📄' },
    { value: 'other', label: 'Other', icon: '📝' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Payment"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Details */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
            Payment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Amount *"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              >
                <option value="CHF">CHF (Swiss Franc)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>
            <Input
              label="Payment Date *"
              type="date"
              value={formData.paidAt}
              onChange={(e) => handleChange('paidAt', e.target.value)}
              required
            />
            <Input
              label="Invoice ID"
              value={formData.invoiceId}
              onChange={(e) => handleChange('invoiceId', e.target.value)}
              placeholder="INV-2024-001"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Payment Method
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => handleChange('paymentMethod', method.value)}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.paymentMethod === method.value
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="text-sm font-medium">{method.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            Additional Information
          </h3>
          <div className="space-y-4">
            <Input
              label="Reference"
              value={formData.reference}
              onChange={(e) => handleChange('reference', e.target.value)}
              placeholder="Payment reference number"
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Payment description"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional notes about this payment"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="px-6"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </div>
            ) : (
              'Add Payment'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PaymentModal
