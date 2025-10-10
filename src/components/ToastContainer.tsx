import React from 'react'
import Toast from './Toast'
import type { ToastProps } from './Toast'

interface ToastContainerProps {
  toasts: ToastProps[]
  onRemoveToast: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-sm">
      <div className="space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onRemoveToast}
          />
        ))}
      </div>
    </div>
  )
}

export default ToastContainer
