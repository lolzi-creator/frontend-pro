import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'

type Step = 1 | 2 | 3 | 4 | 5

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const { t, language, setLanguage } = useLanguage()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVatRegistered, setIsVatRegistered] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Company Info
    companyName: '',
    uid: '',
    vatNumber: '',
    
    // Step 2: Address & Contact
    address: '',
    zip: '',
    city: '',
    country: 'CH',
    phone: '',
    companyEmail: '',
    website: '',
    
    // Step 3: Banking
    bankName: '',
    iban: '',
    qrIban: '',
    
    // Step 4: User Account
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    paymentTerms: 30,
    defaultLanguage: 'de'
  })

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        if (!formData.companyName || !formData.uid) {
          setError(t.auth.fillAllRequiredFields)
          return false
        }
        // VAT number is only required if company is VAT registered
        if (isVatRegistered && !formData.vatNumber) {
          setError(t.auth.fillAllRequiredFields)
          return false
        }
        return true
      case 2:
        if (!formData.address || !formData.zip || !formData.city || !formData.companyEmail) {
          setError(t.auth.fillAllRequiredFields)
          return false
        }
        return true
      case 3:
        if (!formData.iban) {
          setError(t.auth.ibanRequired)
          return false
        }
        // Basic IBAN validation
        const ibanClean = formData.iban.replace(/\s/g, '')
        if (!ibanClean.startsWith('CH') || ibanClean.length !== 21) {
          setError(t.auth.invalidSwissIban)
          return false
        }
        return true
      case 4:
        if (!formData.name || !formData.email || !formData.password) {
          setError(t.auth.fillAllRequiredFields)
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError(t.auth.passwordsDoNotMatch)
          return false
        }
        if (formData.password.length < 8) {
          setError(t.auth.passwordMinLength)
          return false
        }
        return true
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const prevStep = () => {
    setCurrentStep((currentStep - 1) as Step)
    setError('')
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setLoading(true)
    setError('')

    try {
      const registrationData: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        address: formData.address,
        zip: formData.zip,
        city: formData.city,
        companyEmail: formData.companyEmail,
        iban: formData.iban,
        paymentTerms: formData.paymentTerms,
        defaultLanguage: formData.defaultLanguage
      }

      // Add optional fields only if they have values
      if (formData.phone) registrationData.phone = formData.phone
      if (formData.uid) registrationData.uid = formData.uid
      if (formData.vatNumber) registrationData.vatNumber = formData.vatNumber
      if (formData.qrIban) registrationData.qrIban = formData.qrIban
      if (formData.bankName) registrationData.bankName = formData.bankName
      if (formData.website) registrationData.website = formData.website

      const response = await apiClient.register(registrationData)

      if (response.success) {
        setCurrentStep(5)
      } else {
        setError(response.error || 'Registration failed')
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMsg = err.response?.data?.details 
        ? `${err.response.data.error}: ${err.response.data.details.join(', ')}`
        : err.response?.data?.error || 'Registration failed'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const formatIBAN = (value: string) => {
    const clean = value.replace(/\s/g, '').toUpperCase()
    const formatted = clean.match(/.{1,4}/g)?.join(' ') || clean
    return formatted
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
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

      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{fontFamily: 'Poppins'}}>
            <span className="text-slate-900">Invo</span>
            <span className="text-[#ff6b35]">Smart</span>
          </h1>
          <p className="text-slate-600">{t.auth.smartFinanceManagement}</p>
        </div>

        {/* Stepper Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step
                        ? 'bg-[#ff6b35] text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-12 h-1 mx-2 transition-all ${
                        currentStep > step ? 'bg-[#ff6b35]' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-slate-600">
                {t.auth.step} {currentStep} {t.auth.of} 5
              </span>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            {/* Step 1: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Poppins'}}>{t.auth.companyInformation}</h2>
                  <p className="text-slate-600">{t.auth.companyInfoDescription}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.auth.companyName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                    placeholder="e.g., Acme Solutions AG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.auth.uidNumber} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.uid}
                    onChange={(e) => updateFormData('uid', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition font-mono"
                    placeholder="CHE-123.456.789"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVatRegistered}
                      onChange={(e) => {
                        setIsVatRegistered(e.target.checked)
                        if (!e.target.checked) {
                          updateFormData('vatNumber', '')
                        }
                      }}
                      className="mt-1 mr-3 w-5 h-5 text-[#ff6b35] border-slate-300 rounded focus:ring-[#ff6b35]"
                    />
                    <div>
                      <div className="font-medium text-slate-900">{t.auth.isVatRegistered}</div>
                      <div className="text-sm text-slate-600 mt-1">{t.auth.vatRegisteredDescription}</div>
                    </div>
                  </label>
                </div>

                {isVatRegistered && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.auth.vatNumber} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.vatNumber}
                      onChange={(e) => updateFormData('vatNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition font-mono"
                      placeholder="CHE-123.456.789 MWST"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Address & Contact */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Poppins'}}>{t.auth.addressContact}</h2>
                  <p className="text-slate-600">{t.auth.addressContactDescription}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.auth.streetAddress} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                    placeholder="Bahnhofstrasse 1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.auth.zip} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => updateFormData('zip', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                      placeholder="8001"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.auth.city} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                      placeholder="Zürich"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t.auth.phone}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                      placeholder="+41 44 123 45 67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.auth.companyEmail} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.companyEmail}
                      onChange={(e) => updateFormData('companyEmail', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                      placeholder="info@company.ch"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t.auth.website}</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                    placeholder="https://www.company.ch"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Banking */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Poppins'}}>{t.auth.bankingInformation}</h2>
                  <p className="text-slate-600">{t.auth.bankingInfoDescription}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">{t.auth.swissQrInvoices}</p>
                      <p>{t.auth.swissQrInvoicesDescription}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t.auth.bankName}</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => updateFormData('bankName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                    placeholder="UBS Switzerland AG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.auth.iban} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.iban}
                    onChange={(e) => updateFormData('iban', formatIBAN(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition font-mono text-lg"
                    placeholder="CH93 0076 2011 6238 5295 7"
                    maxLength={26}
                  />
                  <p className="text-xs text-slate-500 mt-1">Swiss IBAN format: CHxx xxxx xxxx xxxx xxxx x</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.auth.qrIban} <span className="text-slate-400">({t.common.optional})</span>
                  </label>
                  <input
                    type="text"
                    value={formData.qrIban}
                    onChange={(e) => updateFormData('qrIban', formatIBAN(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition font-mono text-lg"
                    placeholder="CH44 3199 9123 0008 8901 2"
                    maxLength={26}
                  />
                  <p className="text-xs text-slate-500 mt-1">{t.auth.qrIbanDescription}</p>
                </div>
              </div>
            )}

            {/* Step 4: User Account */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Poppins'}}>{t.auth.createYourAccount}</h2>
                  <p className="text-slate-600">{t.auth.accountDescription}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.auth.yourName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.auth.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                    placeholder="john@company.ch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.auth.password} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.auth.confirmPassword} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Business Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{t.auth.defaultPaymentTerms}</label>
                      <select
                        value={formData.paymentTerms}
                        onChange={(e) => updateFormData('paymentTerms', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ff6b35] outline-none"
                      >
                        <option value="14">{t.auth.days14}</option>
                        <option value="30">{t.auth.days30}</option>
                        <option value="60">{t.auth.days60}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{t.auth.language}</label>
                      <select
                        value={formData.defaultLanguage}
                        onChange={(e) => updateFormData('defaultLanguage', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ff6b35] outline-none"
                      >
                        <option value="de">{t.auth.deutsch}</option>
                        <option value="fr">{t.auth.francais}</option>
                        <option value="it">{t.auth.italiano}</option>
                        <option value="en">{t.auth.english}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Poppins'}}>{t.auth.setupComplete}</h2>
                  <p className="text-slate-600">{t.auth.accountReady}</p>
                </div>

                <div className="bg-gradient-to-br from-[#ff6b35] to-[#ff5722] rounded-xl p-8 text-white text-center">
                  <h3 className="text-xl font-bold mb-2">{t.auth.welcomeToInvoSmartTitle}</h3>
                  <p className="text-orange-100 mb-4">{t.auth.professionalInvoiceManagement}</p>
                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <p className="text-sm mb-2">Company: <strong>{formData.companyName}</strong></p>
                    <p className="text-sm">IBAN configured: <strong className="font-mono">{formData.iban}</strong></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">{t.auth.nextSteps}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-semibold text-slate-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{t.auth.importCustomers}</p>
                        <p className="text-sm text-slate-600">{t.auth.importCustomersDescription}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-semibold text-slate-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{t.auth.createFirstInvoice}</p>
                        <p className="text-sm text-slate-600">{t.auth.createFirstInvoiceDescription}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-semibold text-slate-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{t.auth.importBankPayments}</p>
                        <p className="text-sm text-slate-600">{t.auth.importBankPaymentsDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#ff6b35] text-white font-semibold py-4 rounded-lg hover:bg-[#ff5722] transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  {t.auth.goToLogin}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                ← {t.auth.back}
              </button>

              {currentStep === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-[#ff6b35] text-white font-semibold rounded-lg hover:bg-[#ff5722] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t.auth.creatingAccount : t.auth.completeSetup}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-[#ff6b35] text-white font-semibold rounded-lg hover:bg-[#ff5722] transition-all"
                >
                  {t.auth.next} →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            {t.auth.alreadyHaveAccount}{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#ff6b35] font-semibold hover:text-[#ff5722] transition-colors"
            >
              {t.auth.signIn}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
