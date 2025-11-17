import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useLanguage } from '../contexts/LanguageContext'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { t, language, setLanguage } = useLanguage()
  const [showLogin, setShowLogin] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.login(formData.email, formData.password)
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('company', JSON.stringify(response.data.company))
        
        // Redirect to dashboard
        navigate('/dashboard')
      } else {
        setError(response.error || t.auth.loginFailed)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || t.auth.networkError)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      {/* Language Selector - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-2 flex gap-1">
          {(['de', 'fr', 'en', 'it'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                language === lang
                  ? 'bg-[#ff6b35] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={
                lang === 'de' ? t.auth.deutsch :
                lang === 'fr' ? t.auth.francais :
                lang === 'it' ? t.auth.italiano :
                t.auth.english
              }
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl">
        {/* Logo & Branding */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{fontFamily: 'Poppins'}}>
            <span className="text-slate-900">Invo</span>
            <span className="text-[#ff6b35]">Smart</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t.auth.smartFinanceManagement}
          </p>
          <p className="text-slate-500 mt-2">
            {t.auth.invoicingPaymentsExpensesReports}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Features Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{t.auth.swissQrInvoices}</h3>
                  <p className="text-sm text-slate-600">{t.auth.swissQrInvoicesDescription}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{t.auth.automaticMatching}</h3>
                  <p className="text-sm text-slate-600">{t.auth.automaticMatchingDescription}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{t.auth.financialOverview}</h3>
                  <p className="text-sm text-slate-600">{t.auth.financialOverviewDescription}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {!showLogin ? (
              /* Welcome View */
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-6" style={{fontFamily: 'Poppins'}}>
                  {t.auth.welcomeToInvoSmart}
                </h2>

                <button
                  onClick={() => navigate('/register')}
                  className="w-full bg-[#ff6b35] text-white font-semibold py-4 rounded-xl hover:bg-[#ff5722] transition-all transform hover:scale-[1.02] shadow-lg mb-4"
                >
                  {t.auth.getStartedFreeTrial}
                </button>

                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-slate-100 text-slate-900 font-semibold py-4 rounded-xl hover:bg-slate-200 transition-all"
                >
                  {t.auth.signIn}
                </button>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="text-center space-y-2">
                    <div className="text-[#ff6b35] text-2xl font-bold">100%</div>
                    <div className="text-slate-600 text-sm">{t.auth.swissCompliant}</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Login Form */
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900" style={{fontFamily: 'Poppins'}}>{t.auth.signIn}</h2>
                  <button
                    onClick={() => {
                      setShowLogin(false)
                      setError('')
                    }}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      {t.auth.email}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition-colors"
                      placeholder="your@email.ch"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                      {t.auth.password}
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex">
                        <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ff6b35] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#ff5722] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t.auth.signingIn}
                      </div>
                    ) : (
                      t.auth.signIn
                    )}
                  </button>

                  <div className="text-center pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                      {t.auth.dontHaveAccount}{' '}
                      <button
                        type="button"
                        className="text-[#ff6b35] font-semibold hover:text-[#ff5722] transition-colors"
                        onClick={() => navigate('/register')}
                      >
                        {t.auth.getStarted}
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 InvoSmart. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
