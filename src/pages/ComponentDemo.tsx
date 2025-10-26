import React, { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import {
  Button,
  TouchButton,
  Input,
  Alert,
  ConfirmationModal,
  LoadingSpinner,
  Skeleton,
  TableSkeleton,
  CardSkeleton,
  FileUpload,
  LineChart,
  BarChart,
  PieChart,
  Chart
} from '../components'

const ComponentDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)

  // Sample data for charts
  const lineData = [
    { x: 'Jan', y: 12000 },
    { x: 'Feb', y: 15000 },
    { x: 'Mar', y: 18000 },
    { x: 'Apr', y: 14000 },
    { x: 'May', y: 22000 },
    { x: 'Jun', y: 25000 }
  ]

  const barData = [
    { label: 'Q1', value: 45000 },
    { label: 'Q2', value: 52000 },
    { label: 'Q3', value: 48000 },
    { label: 'Q4', value: 61000 }
  ]

  const pieData = [
    { label: 'Invoices', value: 45 },
    { label: 'Quotes', value: 25 },
    { label: 'Payments', value: 20 },
    { label: 'Expenses', value: 10 }
  ]

  const handleFileSelect = (files: File[]) => {
    showSuccess('Files Selected', `${files.length} file(s) selected successfully`)
  }

  const handleDelete = () => {
    setShowConfirmation(false)
    showSuccess('Item Deleted', 'The item has been deleted successfully')
  }

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Component Library Demo</h1>
        <p className="text-gray-600">Comprehensive collection of reusable UI components</p>
      </div>

      {/* Toast Notifications */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Toast Notifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button onClick={() => showSuccess('Success!', 'Operation completed successfully')}>
            Success Toast
          </Button>
          <Button onClick={() => showError('Error!', 'Something went wrong')}>
            Error Toast
          </Button>
          <Button onClick={() => showWarning('Warning!', 'Please check your input')}>
            Warning Toast
          </Button>
          <Button onClick={() => showInfo('Info', 'Here is some information')}>
            Info Toast
          </Button>
        </div>
      </section>

      {/* Alerts */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alerts</h2>
        <div className="space-y-4">
          <Alert type="success" title="Success!" message="Your changes have been saved successfully." />
          <Alert type="error" title="Error!" message="There was a problem processing your request." />
          <Alert type="warning" title="Warning!" message="Please review your information before proceeding." />
          <Alert type="info" title="Information" message="Here are some important details you should know." />
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Buttons</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="accent">Accent Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <TouchButton variant="primary" size="sm">Small</TouchButton>
            <TouchButton variant="primary" size="md">Medium</TouchButton>
            <TouchButton variant="primary" size="lg">Large</TouchButton>
          </div>
        </div>
      </section>

      {/* Form Components */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Form Components</h2>
        <div className="max-w-md space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            error="Please enter a valid email address"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <Input
            label="Description"
            placeholder="Enter description"
            helperText="This field is optional"
          />
        </div>
      </section>

      {/* Loading States */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Loading States</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Loading Spinners</h3>
            <div className="flex items-center space-x-4">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
              <LoadingSpinner size="xl" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Skeletons</h3>
            <div className="space-y-4">
              <Skeleton height="1rem" width="60%" />
              <Skeleton height="1rem" width="40%" />
              <Skeleton height="1rem" width="80%" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Table Skeleton</h3>
            <TableSkeleton rows={3} columns={4} />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Card Skeleton</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardSkeleton showImage={true} />
              <CardSkeleton showImage={false} />
            </div>
          </div>

          <div>
            <Button onClick={simulateLoading} disabled={loading}>
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Simulate Loading'}
            </Button>
          </div>
        </div>
      </section>

      {/* File Upload */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">File Upload</h2>
        <div className="max-w-md">
          <FileUpload
            onFileSelect={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx"
            multiple={true}
            maxSize={5}
            maxFiles={3}
          />
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart
            data={lineData}
            title="Revenue Trend"
            subtitle="Monthly revenue over time"
            height={300}
          />
          
          <BarChart
            data={barData}
            title="Quarterly Sales"
            subtitle="Sales by quarter"
            height={300}
            showValues={true}
          />
          
          <PieChart
            data={pieData}
            title="Document Types"
            subtitle="Distribution of document types"
            size={250}
            showLegend={true}
            showValues={true}
          />
          
          <Chart
            title="Custom Chart"
            subtitle="This is a custom chart container"
            loading={loading}
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Custom chart content goes here</p>
            </div>
          </Chart>
        </div>
      </section>

      {/* Confirmation Modal */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Confirmation Modal</h2>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowConfirmation(true)}
          >
            Show Confirmation Modal
          </Button>
        </div>
      </section>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

export default ComponentDemo

