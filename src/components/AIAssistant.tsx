import React, { useState, useRef, useEffect } from 'react'
import api from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import AIActionCard from './AIActionCard'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: any // Parsed action from AI
  actionCard?: {
    type: string
    data: any
  }
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { showError, showSuccess, showInfo } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI assistant. I can help you with:\n\n• Creating invoices and quotes\n• Checking payment status\n• Finding overdue invoices\n• Viewing business statistics\n• Managing customers\n\nHow can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Prepare messages for API (exclude timestamp)
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await api.post('/ai/chat', { messages: apiMessages })

      if (response.data.success) {
        // Clean the message - remove JSON blocks
        let cleanedMessage = response.data.data.message
        cleanedMessage = cleanedMessage.replace(/```json[\s\S]*?```/g, '').trim()
        
        const action = response.data.data.action

        // Detect if this is a creation action and show smart card
        let actionCard: any = null
        if (action && action.data) {
          const actionType = action.action
          if (['CREATE_CUSTOMER', 'CREATE_INVOICE', 'CREATE_QUOTE', 'CREATE_EXPENSE', 'IMPORT_PAYMENT'].includes(actionType)) {
            const typeMap: Record<string, string> = {
              'CREATE_CUSTOMER': 'customer',
              'CREATE_INVOICE': 'invoice',
              'CREATE_QUOTE': 'quote',
              'CREATE_EXPENSE': 'expense',
              'IMPORT_PAYMENT': 'payment'
            }
            actionCard = {
              type: typeMap[actionType],
              data: action.data
            }
          }
        }
        
        const aiMessage: Message = {
          role: 'assistant',
          content: cleanedMessage,
          timestamp: new Date(),
          action: actionCard ? null : action, // Only use old action if no card
          actionCard: actionCard
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        showError('AI Error', response.data.error || 'Failed to get AI response')
      }
    } catch (error: any) {
      console.error('AI chat error:', error)
      showError('AI Error', error.response?.data?.error || 'Failed to communicate with AI')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '👋 Chat cleared! How can I help you?',
        timestamp: new Date()
      }
    ])
  }

  const handleActionCardExecute = async (type: string, data: any) => {
    setIsLoading(true)

    const actionMap: Record<string, string> = {
      'customer': 'CREATE_CUSTOMER',
      'invoice': 'CREATE_INVOICE',
      'quote': 'CREATE_QUOTE',
      'expense': 'CREATE_EXPENSE',
      'payment': 'IMPORT_PAYMENT'
    }

    const action = {
      action: actionMap[type],
      data
    }

    await handleAction(action)
  }

  const handleActionCardCancel = (messageIndex: number) => {
    // Remove the action card from the message
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageIndex ? { ...msg, actionCard: undefined } : msg
    ))
  }

  const handleAction = async (action: any) => {
    if (!action) return

    setIsLoading(true)

    try {
      // Execute action automatically via API
      const response = await api.post('/ai/execute', {
        action: action.action,
        data: action.data || {}
      })

      if (response.data.success) {
        const result = response.data.data

        // Add AI response about the action
        const resultMessage: Message = {
          role: 'assistant',
          content: `✅ ${result.message}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, resultMessage])

        // Handle special direct actions (not from API)
        if (action.action === 'VIEW_INVOICE' && action.data?.invoiceId) {
          setTimeout(() => {
            window.location.href = `/invoices/${action.data.invoiceId}`
          }, 500)
          return
        }

        // Handle different action types
        switch (result.type) {
          case 'INVOICE_CREATED':
            showSuccess('Invoice Created!', `Invoice #${result.invoice.number} has been created.`)
            // Add a follow-up message with link
            setTimeout(() => {
              const followUp: Message = {
                role: 'assistant',
                content: `Would you like to view or edit the invoice?`,
                timestamp: new Date(),
                action: { action: 'VIEW_INVOICE', data: { invoiceId: result.invoiceId } }
              }
              setMessages(prev => [...prev, followUp])
            }, 500)
            break

          case 'EXPENSE_CREATED':
            showSuccess('Expense Created!', 'Your expense has been recorded.')
            setTimeout(() => {
              const followUp: Message = {
                role: 'assistant',
                content: `Expense recorded successfully! Anything else I can help you with?`,
                timestamp: new Date()
              }
              setMessages(prev => [...prev, followUp])
            }, 500)
            break

          case 'OVERDUE_INVOICES':
            if (result.count > 0) {
              setTimeout(() => {
                window.location.href = '/invoices?status=OVERDUE'
              }, 1000)
            }
            break

          case 'BUSINESS_STATS':
            const statsMessage: Message = {
              role: 'assistant',
              content: `📊 **Your Business Stats:**\n\n💰 Revenue: CHF ${result.stats.totalRevenue.toFixed(2)}\n📄 Total Invoices: ${result.stats.invoiceCount}\n⚠️ Overdue: ${result.stats.overdueCount}\n👥 Customers: ${result.stats.customerCount}\n💸 Outstanding: CHF ${result.stats.totalOutstanding.toFixed(2)}`,
              timestamp: new Date()
            }
            setMessages(prev => [...prev, statsMessage])
            break

          case 'CUSTOMER_CREATED':
            showSuccess('Customer Created!', `${result.customer.name} has been added.`)
            setTimeout(() => {
              const followUp: Message = {
                role: 'assistant',
                content: `Customer created successfully! Would you like to create an invoice for them?`,
                timestamp: new Date()
              }
              setMessages(prev => [...prev, followUp])
            }, 500)
            break

          case 'QUOTE_CREATED':
            showSuccess('Quote Created!', `Quote #${result.quote.number} has been created.`)
            setTimeout(() => {
              const followUp: Message = {
                role: 'assistant',
                content: `Quote created successfully! Would you like to view it?`,
                timestamp: new Date(),
                action: { action: 'VIEW_QUOTE', data: { quoteId: result.quoteId } }
              }
              setMessages(prev => [...prev, followUp])
            }, 500)
            break

          case 'PAYMENT_IMPORTED':
            if (result.matched) {
              showSuccess('Payment Matched!', `Payment matched to Invoice #${result.invoice.number}`)
            } else {
              showInfo('Payment Imported', 'Payment imported but no matching invoice found')
            }
            break

          case 'CUSTOMERS_LIST':
            if (result.customers && result.customers.length > 0) {
              const customerList = result.customers
                .map((c: any) => `• ${c.name} (${c.city || 'N/A'})`)
                .join('\n')
              const customersMessage: Message = {
                role: 'assistant',
                content: `👥 **Found ${result.count} Customer(s):**\n\n${customerList}`,
                timestamp: new Date()
              }
              setMessages(prev => [...prev, customersMessage])
            } else {
              const noCustomersMessage: Message = {
                role: 'assistant',
                content: '👥 No customers found matching your criteria.',
                timestamp: new Date()
              }
              setMessages(prev => [...prev, noCustomersMessage])
            }
            break
        }
      } else {
        showError('Action Failed', response.data.error || 'Failed to execute action')
      }
    } catch (error: any) {
      console.error('Action execution error:', error)
      showError('Action Failed', error.response?.data?.error || 'Failed to execute action')
    } finally {
      setIsLoading(false)
    }
  }

  const renderActionButton = (action: any) => {
    if (!action || !action.action) return null

    const actionLabels: Record<string, { label: string; icon: string; color: string }> = {
      CREATE_INVOICE: { label: 'Create Now', icon: '📄', color: 'from-blue-500 to-blue-600' },
      CREATE_EXPENSE: { label: 'Create Now', icon: '💰', color: 'from-red-500 to-red-600' },
      SHOW_OVERDUE: { label: 'Show Now', icon: '⚠️', color: 'from-yellow-500 to-yellow-600' },
      VIEW_STATS: { label: 'Show Stats', icon: '📊', color: 'from-green-500 to-green-600' },
      VIEW_INVOICE: { label: 'View Invoice', icon: '👁️', color: 'from-purple-500 to-purple-600' },
    }

    const actionInfo = actionLabels[action.action]
    if (!actionInfo) return null

    return (
      <button
        onClick={() => handleAction(action)}
        className={`mt-3 inline-flex items-center px-4 py-2 bg-gradient-to-r ${actionInfo.color} text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-[1.02]`}
      >
        <span className="mr-2">{actionInfo.icon}</span>
        {actionInfo.label}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>
                AI Assistant
              </h2>
              <p className="text-orange-100 text-sm">Powered by Groq AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
              title="Clear chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap break-words text-sm">
                  {message.content}
                </div>
                {message.role === 'assistant' && message.actionCard && (
                  <AIActionCard
                    type={message.actionCard.type as any}
                    data={message.actionCard.data}
                    onExecute={handleActionCardExecute}
                    onCancel={() => handleActionCardCancel(index)}
                  />
                )}
                {message.role === 'assistant' && message.action && renderActionButton(message.action)}
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-orange-100' : 'text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('de-CH', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
          <div className="flex items-end space-x-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about your invoices, customers, or business..."
              className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all max-h-32"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl px-6 py-3 font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant

