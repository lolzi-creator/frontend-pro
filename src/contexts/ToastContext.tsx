import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import ToastContainer from '../components/ToastContainer'

interface ToastData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose?: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

export type { ToastData }

interface ToastContextType {
  toasts: ToastData[]
  showToast: (toast: Omit<ToastData, 'id'>) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
  showSuccess: (title: string, message?: string, options?: Partial<ToastData>) => void
  showError: (title: string, message?: string, options?: Partial<ToastData>) => void
  showWarning: (title: string, message?: string, options?: Partial<ToastData>) => void
  showInfo: (title: string, message?: string, options?: Partial<ToastData>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastData = {
      id,
      duration: 5000,
      ...toast
    }
    
    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const showSuccess = useCallback((title: string, message?: string, options?: Partial<ToastData>) => {
    showToast({
      type: 'success',
      title,
      message,
      ...options
    })
  }, [showToast])

  const showError = useCallback((title: string, message?: string, options?: Partial<ToastData>) => {
    showToast({
      type: 'error',
      title,
      message,
      duration: 7000, // Errors stay longer
      ...options
    })
  }, [showToast])

  const showWarning = useCallback((title: string, message?: string, options?: Partial<ToastData>) => {
    showToast({
      type: 'warning',
      title,
      message,
      ...options
    })
  }, [showToast])

  const showInfo = useCallback((title: string, message?: string, options?: Partial<ToastData>) => {
    showToast({
      type: 'info',
      title,
      message,
      ...options
    })
  }, [showToast])

  const value: ToastContextType = {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer 
        toasts={toasts.map(toast => ({
          ...toast,
          onClose: removeToast
        }))} 
        onRemoveToast={removeToast} 
      />
    </ToastContext.Provider>
  )
}
