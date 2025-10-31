import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Invoices from './pages/Invoices'
import CreateInvoice from './pages/CreateInvoice'
import InvoiceDetail from './pages/InvoiceDetail'
import Quotes from './pages/Quotes'
import CreateQuote from './pages/CreateQuote'
import QuoteDetail from './pages/QuoteDetail'
import AcceptQuote from './pages/AcceptQuote'
import AcceptInvitation from './pages/AcceptInvitation'
import Customers from './pages/Customers'
import CreateCustomer from './pages/CreateCustomer'
import CustomerDetail from './pages/CustomerDetail'
import Payments from './pages/Payments'
import PaymentDetail from './pages/PaymentDetail'
import Expenses from './pages/Expenses'
import CreateExpense from './pages/CreateExpense'
import ExpenseDetail from './pages/ExpenseDetail'
import EditExpense from './pages/EditExpense'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ComponentDemo from './pages/ComponentDemo'

function App() {
  return (
    <ToastProvider>
      <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/quotes/accept/:token" element={<AcceptQuote />} />
        <Route path="/invitations/accept/:token" element={<AcceptInvitation />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
        <Route path="/invoices" element={
          <ProtectedRoute>
            <Layout><Invoices /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/invoices/create" element={
          <ProtectedRoute>
            <Layout><CreateInvoice /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/invoices/:id" element={
          <ProtectedRoute>
            <Layout><InvoiceDetail /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/quotes" element={
          <ProtectedRoute>
            <Layout><Quotes /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/quotes/create" element={
          <ProtectedRoute>
            <Layout><CreateQuote /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/quotes/:id/edit" element={
          <ProtectedRoute>
            <Layout><CreateQuote /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/quotes/:id" element={
          <ProtectedRoute>
            <Layout><QuoteDetail /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute>
            <Layout><Customers /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/customers/create" element={
          <ProtectedRoute>
            <Layout><CreateCustomer /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/customers/:id" element={
          <ProtectedRoute>
            <Layout><CustomerDetail /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
          <ProtectedRoute>
            <Layout><Payments /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/payments/:id" element={
          <ProtectedRoute>
            <Layout><PaymentDetail /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ProtectedRoute>
            <Layout><Expenses /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/expenses/create" element={
          <ProtectedRoute>
            <Layout><CreateExpense /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/expenses/:id/edit" element={
          <ProtectedRoute>
            <Layout><EditExpense /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/expenses/:id" element={
          <ProtectedRoute>
            <Layout><ExpenseDetail /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout><Reports /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/components" element={
          <ProtectedRoute>
            <Layout><ComponentDemo /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App