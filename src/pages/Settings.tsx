import React, { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'

type Language = 'de' | 'fr' | 'en' | 'it'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { Alert, LoadingSpinner } from '../components'
import { apiClient } from '../lib/api'
import Modal from '../components/Modal'

const Settings: React.FC = () => {
  const { showSuccess, showError, showInfo } = useToast()
  const { language, setLanguage, t } = useLanguage()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corp',
    phone: '+41 44 123 45 67',
    address: 'Bahnhofstrasse 1',
    city: 'Zurich',
    zipCode: '8001',
    country: 'Switzerland'
  })

  // User management state
  const [users, setUsers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({ email: '', name: '', role: 'EMPLOYEE' as 'ADMIN' | 'EMPLOYEE' })
  const [inviting, setInviting] = useState(false)

  // Permissions state
  const [permissions, setPermissions] = useState<Record<string, any[]>>({})
  const [rolePermissions, setRolePermissions] = useState<Record<string, boolean>>({})
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE')
  const [savingPermissions, setSavingPermissions] = useState(false)

  // Company/Logo state
  const [companyData, setCompanyData] = useState<any>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [deletingLogo, setDeletingLogo] = useState(false)

  // VAT Rates state
  const [vatRates, setVatRates] = useState<Array<{ name: string; rate: number; isDefault: boolean }>>([
    { name: 'Standard', rate: 7.7, isDefault: true },
    { name: 'Reduziert', rate: 2.5, isDefault: false },
    { name: 'Befreit', rate: 0, isDefault: false }
  ])
  const [loadingVatRates, setLoadingVatRates] = useState(false)
  const [savingVatRates, setSavingVatRates] = useState(false)

  // Get current user to check if admin
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = currentUser?.role === 'ADMIN'

  const handleSave = async (section: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showSuccess(t.settings.settingsSaved, t.settings.settingsUpdated.replace('{{section}}', section))
    } catch (err) {
      setError(t.settings.failedToSave)
      showError(t.settings.settingsError, t.settings.failedToSave)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Fetch users when Team tab is active
  useEffect(() => {
    if (activeTab === 'team' && isAdmin) {
      fetchUsers()
      fetchInvitations()
    }
  }, [activeTab, isAdmin])

  // Fetch permissions when Permissions tab is active
  useEffect(() => {
    if (activeTab === 'permissions' && isAdmin) {
      fetchPermissions()
      fetchRolePermissions(selectedRole)
    }
  }, [activeTab, selectedRole, isAdmin])

  // Fetch company data when Company tab is active
  useEffect(() => {
    if (activeTab === 'company') {
      fetchCompany()
    }
  }, [activeTab])

  // Fetch VAT rates when VAT Rates tab is active
  useEffect(() => {
    if (activeTab === 'vat-rates') {
      fetchVatRates()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    try {
      const response = await apiClient.getUsers()
      if (response.success) {
        setUsers(response.data || [])
      }
    } catch (error: any) {
      console.error('Error fetching users:', error)
      showError(t.settings.failedToLoadUsers, error.response?.data?.message || 'Unknown error')
    }
  }

  const fetchInvitations = async () => {
    try {
      const response = await apiClient.getInvitations()
      if (response.success) {
        setInvitations(response.data?.invitations || [])
      }
    } catch (error: any) {
      console.error('Error fetching invitations:', error)
    }
  }

  const fetchPermissions = async () => {
    try {
      const response = await apiClient.getPermissions()
      if (response.success) {
        setPermissions(response.data?.permissions || {})
      }
    } catch (error: any) {
      console.error('Error fetching permissions:', error)
      showError(t.settings.failedToLoadPermissions, error.response?.data?.message || 'Unknown error')
    }
  }

  const fetchRolePermissions = async (role: 'ADMIN' | 'EMPLOYEE') => {
    try {
      const response = await apiClient.getRolePermissions(role)
      if (response.success) {
        const permsMap: Record<string, boolean> = {}
        Object.entries(response.data?.permissions || {}).forEach(([key, value]: [string, any]) => {
          permsMap[key] = value.isGranted || false
        })
        setRolePermissions(permsMap)
      }
    } catch (error: any) {
      console.error('Error fetching role permissions:', error)
      showError(t.settings.failedToLoadRolePermissions, error.response?.data?.message || 'Unknown error')
    }
  }

  const handleInviteUser = async () => {
    if (!inviteForm.email || !inviteForm.name) {
      showError(t.settings.validationError, t.settings.fillAllFields)
      return
    }

    setInviting(true)
    try {
      const response = await apiClient.inviteUser(inviteForm.email, inviteForm.name, inviteForm.role)
      if (response.success) {
        showSuccess(t.settings.invitationSent, t.settings.invitationEmailSent.replace('{{email}}', inviteForm.email))
        setShowInviteModal(false)
        setInviteForm({ email: '', name: '', role: 'EMPLOYEE' })
        fetchInvitations()
      } else {
        showError(t.settings.failedToSendInvitation, response.message || 'Unknown error')
      }
    } catch (error: any) {
      console.error('Error inviting user:', error)
      showError(t.settings.failedToSendInvitation, error.response?.data?.message || 'Unknown error')
    } finally {
      setInviting(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: 'ADMIN' | 'EMPLOYEE') => {
    try {
      const response = await apiClient.updateUserRole(userId, newRole)
      if (response.success) {
        showSuccess(t.settings.roleUpdated, t.settings.userRoleUpdated)
        fetchUsers()
      } else {
        showError(t.settings.failedToUpdateRole, response.message || 'Unknown error')
      }
    } catch (error: any) {
      console.error('Error updating user role:', error)
      showError(t.settings.failedToUpdateRole, error.response?.data?.message || 'Unknown error')
    }
  }

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = isActive 
        ? await apiClient.reactivateUser(userId)
        : await apiClient.deactivateUser(userId)
      
      if (response.success) {
        showSuccess(t.settings.statusUpdated, isActive ? t.settings.userReactivated : t.settings.userDeactivated)
        fetchUsers()
      }
    } catch (error: any) {
      console.error('Error updating user status:', error)
      showError(t.settings.failedToUpdateStatus, error.response?.data?.message || 'Unknown error')
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const response = await apiClient.cancelInvitation(invitationId)
      if (response.success) {
        showSuccess(t.settings.invitationCancelled, t.settings.invitationHasBeenCancelled)
        fetchInvitations()
      }
    } catch (error: any) {
      console.error('Error cancelling invitation:', error)
      showError(t.settings.failedToCancelInvitation, error.response?.data?.message || 'Unknown error')
    }
  }

  const handleSavePermissions = async () => {
    setSavingPermissions(true)
    try {
      const response = await apiClient.updateRolePermissions(selectedRole, rolePermissions)
      if (response.success) {
        showSuccess(t.settings.permissionsUpdated, t.settings.permissionsForRoleUpdated.replace('{{role}}', selectedRole))
      } else {
        showError(t.settings.failedToUpdatePermissions, response.message || 'Unknown error')
      }
    } catch (error: any) {
      console.error('Error updating permissions:', error)
      showError(t.settings.failedToUpdatePermissions, error.response?.data?.message || 'Unknown error')
    } finally {
      setSavingPermissions(false)
    }
  }

  const handleResetPermissions = async () => {
    if (!window.confirm(t.settings.resetPermissionsConfirmation.replace('{{role}}', selectedRole))) {
      return
    }

    try {
      const response = await apiClient.resetRolePermissions(selectedRole)
      if (response.success) {
        showSuccess(t.settings.permissionsReset, t.settings.permissionsResetToDefaults.replace('{{role}}', selectedRole))
        fetchRolePermissions(selectedRole)
      }
    } catch (error: any) {
      console.error('Error resetting permissions:', error)
      showError(t.settings.failedToResetPermissions, error.response?.data?.message || 'Unknown error')
    }
  }

  const handleTogglePermission = (permissionName: string) => {
    if (selectedRole === 'ADMIN') {
      showInfo(t.settings.info, t.settings.adminHasAllPermissionsInfo)
      return
    }
    setRolePermissions(prev => ({
      ...prev,
      [permissionName]: !prev[permissionName]
    }))
  }

  const fetchCompany = async () => {
    try {
      const response = await apiClient.getCompany()
      if (response.success) {
        setCompanyData(response.data)
        setLogoUrl(response.data?.logo_url || null)
      }
    } catch (error: any) {
      console.error('Error fetching company:', error)
      showError(t.settings.failedToLoadCompanyData, error.response?.data?.message || 'Unknown error')
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      showError(t.settings.invalidFileType, t.settings.pleaseUploadImage)
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError(t.settings.fileTooLarge, t.settings.logoFileMustBeSmaller)
      return
    }

    setUploadingLogo(true)
    try {
      const response = await apiClient.uploadLogo(file)
      if (response.success) {
        setLogoUrl(response.data?.logo_url || null)
        showSuccess(t.settings.logoUploaded, t.settings.companyLogoUploaded)
        // Refresh company data
        fetchCompany()
      } else {
        showError(t.settings.uploadFailed, response.message || t.settings.uploadFailed)
      }
    } catch (error: any) {
      console.error('Error uploading logo:', error)
      showError(t.settings.uploadFailed, error.response?.data?.message || t.settings.uploadFailed)
    } finally {
      setUploadingLogo(false)
      // Reset input
      event.target.value = ''
    }
  }

  const handleDeleteLogo = async () => {
    if (!window.confirm(t.settings.deleteLogoConfirmation)) {
      return
    }

    setDeletingLogo(true)
    try {
      const response = await apiClient.deleteLogo()
      if (response.success) {
        setLogoUrl(null)
        showSuccess(t.settings.logoDeleted, t.settings.companyLogoDeleted)
        // Refresh company data
        fetchCompany()
      } else {
        showError(t.settings.deleteFailed, response.message || t.settings.deleteFailed)
      }
    } catch (error: any) {
      console.error('Error deleting logo:', error)
      showError(t.settings.deleteFailed, error.response?.data?.message || t.settings.deleteFailed)
    } finally {
      setDeletingLogo(false)
    }
  }

  const fetchVatRates = async () => {
    setLoadingVatRates(true)
    try {
      const response = await apiClient.getVatRates()
      if (response.success && response.data) {
        // Ensure we have exactly 3 rates, pad with empty ones if needed
        const rates = response.data.vatRates || response.data || []
        const paddedRates = [...rates]
        while (paddedRates.length < 3) {
          paddedRates.push({ name: '', rate: 0, isDefault: false })
        }
        setVatRates(paddedRates.slice(0, 3))
      }
    } catch (error: any) {
      console.error('Error fetching VAT rates:', error)
      showError(t.settings.failedToLoadVatRates, error.response?.data?.message || 'Unknown error')
    } finally {
      setLoadingVatRates(false)
    }
  }

  const handleSaveVatRates = async () => {
    // Validation
    const validRates = vatRates.filter(rate => rate.name.trim() && rate.rate >= 0 && rate.rate <= 100)
    
    if (validRates.length === 0) {
      showError(t.settings.validationError, t.settings.vatRateNameRequired)
      return
    }

    if (validRates.length > 3) {
      showError(t.settings.validationError, t.settings.maximumThreeRates)
      return
    }

    if (!validRates.some(rate => rate.isDefault)) {
      showError(t.settings.validationError, t.settings.atLeastOneDefault)
      return
    }

    setSavingVatRates(true)
    try {
      const response = await apiClient.updateVatRates(validRates)
      if (response.success) {
        showSuccess(t.settings.vatRatesSaved, t.settings.vatRatesUpdated)
        fetchVatRates()
      } else {
        showError(t.settings.failedToSaveVatRates, response.message || 'Unknown error')
      }
    } catch (error: any) {
      console.error('Error saving VAT rates:', error)
      showError(t.settings.failedToSaveVatRates, error.response?.data?.message || 'Unknown error')
    } finally {
      setSavingVatRates(false)
    }
  }

  const handleVatRateChange = (index: number, field: 'name' | 'rate' | 'isDefault', value: string | number | boolean) => {
    const updatedRates = [...vatRates]
    updatedRates[index] = { ...updatedRates[index], [field]: value }
    
    // If setting as default, unset others
    if (field === 'isDefault' && value === true) {
      updatedRates.forEach((rate, i) => {
        if (i !== index) {
          rate.isDefault = false
        }
      })
    }
    
    setVatRates(updatedRates)
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Poppins'}}>
              {t.settings.title}
            </h2>
            <p className="text-gray-600">
              {t.settings.subtitle}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            title={t.settings.settingsError}
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'text-orange-700 bg-orange-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t.settings.profile}
                </button>
                <button 
                  onClick={() => setActiveTab('company')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'company' 
                      ? 'text-orange-700 bg-orange-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {t.settings.company}
                </button>
                <button 
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'preferences' 
                      ? 'text-orange-700 bg-orange-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 00-1.066 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t.settings.preferences}
                </button>
                <button 
                  onClick={() => setActiveTab('vat-rates')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'vat-rates' 
                      ? 'text-orange-700 bg-orange-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {t.settings.vatRates}
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'security' 
                      ? 'text-orange-700 bg-orange-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {t.settings.security}
                </button>
                <button 
                  onClick={() => setActiveTab('team')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'team' 
                      ? 'text-orange-700 bg-orange-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {t.settings.team}
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => setActiveTab('permissions')}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'permissions' 
                        ? 'text-orange-700 bg-orange-50' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {t.settings.permissions}
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('billing')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'billing' 
                      ? 'text-orange-700 bg-orange-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t.settings.billing}
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.profileInformation}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-600">JD</span>
                  </div>
                  <div>
                    <Button variant="outline">{t.settings.changePhoto}</Button>
                    <p className="text-sm text-gray-500 mt-1">{t.settings.photoRequirements}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label={t.settings.firstName}
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder={t.settings.enterFirstName}
                  />
                  <Input
                    label={t.settings.lastName}
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder={t.settings.enterLastName}
                  />
                </div>

                <Input
                  label={t.settings.email}
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t.settings.enterEmail}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.phone}</label>
                  <input
                    type="tel"
                    defaultValue="+41 44 123 45 67"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    variant="primary" 
                    onClick={() => handleSave('Profile')}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        {t.settings.saving}
                      </div>
                    ) : (
                      t.settings.saveChanges
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Company Settings */}
          {activeTab === 'company' && (
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.companyInformation}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Logo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t.settings.companyLogo}</label>
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      {logoUrl ? (
                        <div className="relative">
                          <img 
                            src={logoUrl} 
                            alt="Company Logo" 
                            className="w-32 h-32 object-contain border border-gray-300 rounded-lg p-2 bg-white"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                          onChange={handleLogoUpload}
                          className="hidden"
                          disabled={uploadingLogo || deletingLogo}
                        />
                        <label
                          htmlFor="logo-upload"
                          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                            uploadingLogo || deletingLogo ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {uploadingLogo ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              {t.settings.saving}
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              {logoUrl ? t.common.edit : t.settings.upload}
                            </>
                          )}
                        </label>
                        {logoUrl && (
                          <button
                            onClick={handleDeleteLogo}
                            disabled={uploadingLogo || deletingLogo}
                            className={`ml-3 inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 ${
                              uploadingLogo || deletingLogo ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {deletingLogo ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                {t.settings.saving}
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {t.settings.remove}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {t.settings.logoRequirements}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.companyName}</label>
                  <input
                    type="text"
                    defaultValue={companyData?.name || "InvoSmart AG"}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.vatNumber}</label>
                    <input
                      type="text"
                      defaultValue="CHE-123.456.789"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.companyUID}</label>
                    <input
                      type="text"
                      defaultValue="CHE-123.456.789"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.address}</label>
                  <textarea
                    rows={3}
                    defaultValue="Musterstrasse 123&#10;8001 Zürich&#10;Switzerland"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    variant="primary" 
                    onClick={() => handleSave('Profile')}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        {t.settings.saving}
                      </div>
                    ) : (
                      t.settings.saveChanges
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.preferencesLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.language}</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="it">Italiano</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    {t.settings.thisChangesLanguage}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.currency}</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>CHF (Swiss Franc)</option>
                    <option>EUR (Euro)</option>
                    <option>USD (US Dollar)</option>
                    <option>GBP (British Pound)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.dateFormat}</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{t.settings.emailNotifications}</h4>
                      <p className="text-sm text-gray-500">{t.settings.receiveEmailNotifications}</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{t.settings.darkMode}</h4>
                      <p className="text-sm text-gray-500">{t.settings.useDarkTheme}</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{t.settings.autoSave}</h4>
                      <p className="text-sm text-gray-500">{t.settings.automaticallySave}</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="primary">{t.settings.savePreferences}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.securitySettings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">{t.settings.changePassword}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.currentPassword}</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.newPassword}</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.confirmNewPassword}</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <Button variant="primary">{t.settings.updatePassword}</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Team Settings */}
          {activeTab === 'team' && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t.settings.teamManagement}</CardTitle>
                    {isAdmin && (
                      <Button variant="primary" onClick={() => setShowInviteModal(true)}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {t.settings.inviteMember}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{t.settings.teamMembers}</h4>
                      <p className="text-sm text-gray-500 mb-4">{t.settings.manageTeamMembers}</p>
                      <div className="space-y-3">
                        {users.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">{t.settings.noUsersFound}</p>
                        ) : (
                          users.map((user: any) => {
                            const initials = user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
                            const isCurrentUser = user.id === currentUser?.id
                            return (
                              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    user.role === 'ADMIN' ? 'bg-orange-100' : 'bg-blue-100'
                                  }`}>
                                    <span className={`font-medium text-sm ${
                                      user.role === 'ADMIN' ? 'text-orange-600' : 'text-blue-600'
                                    }`}>{initials}</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                      {isCurrentUser && (
                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">{t.settings.you}</span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs px-2 py-0.5 rounded ${
                                        user.role === 'ADMIN' 
                                          ? 'bg-orange-100 text-orange-800' 
                                          : 'bg-blue-100 text-blue-800'
                                      }`}>
                                        {user.role === 'ADMIN' ? t.settings.admin : t.settings.employee}
                                      </span>
                                      {!user.is_active && (
                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">{t.settings.inactive}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {isAdmin && !isCurrentUser && (
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={user.role}
                                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value as 'ADMIN' | 'EMPLOYEE')}
                                      className="text-xs border border-gray-300 rounded px-2 py-1"
                                    >
                                      <option value="EMPLOYEE">{t.settings.employee}</option>
                                      <option value="ADMIN">{t.settings.admin}</option>
                                    </select>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleToggleUserStatus(user.id, !user.is_active)}
                                    >
                                      {user.is_active ? t.settings.deactivate : t.settings.activate}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    {/* Pending Invitations */}
                    {isAdmin && invitations.filter((inv: any) => !inv.accepted_at && new Date(inv.expires_at) > new Date()).length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{t.settings.pendingInvitations}</h4>
                        <div className="space-y-2">
                          {invitations
                            .filter((inv: any) => !inv.accepted_at && new Date(inv.expires_at) > new Date())
                            .map((invitation: any) => (
                              <div key={invitation.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{invitation.name}</p>
                                  <p className="text-xs text-gray-500">{invitation.email} • {invitation.role === 'ADMIN' ? t.settings.admin : t.settings.employee}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {t.settings.expiresLabel} {new Date(invitation.expires_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelInvitation(invitation.id)}
                                >
                                  {t.common.cancel}
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Invite Modal */}
              <Modal
                isOpen={showInviteModal}
                onClose={() => {
                  setShowInviteModal(false)
                  setInviteForm({ email: '', name: '', role: 'EMPLOYEE' })
                }}
                title={t.settings.inviteTeamMember}
                size="md"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.emailAddress} *</label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.fullName} *</label>
                    <input
                      type="text"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.role} *</label>
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as 'ADMIN' | 'EMPLOYEE' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="EMPLOYEE">{t.settings.employee}</option>
                      <option value="ADMIN">{t.settings.admin}</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowInviteModal(false)
                        setInviteForm({ email: '', name: '', role: 'EMPLOYEE' })
                      }}
                      disabled={inviting}
                    >
                      {t.common.cancel}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleInviteUser}
                      disabled={inviting || !inviteForm.email || !inviteForm.name}
                    >
                      {inviting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          {t.settings.sending}
                        </>
                      ) : (
                        t.settings.sendInvitation
                      )}
                    </Button>
                  </div>
                </div>
              </Modal>
            </>
          )}

          {/* Permissions Settings */}
          {activeTab === 'permissions' && isAdmin && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t.settings.rolePermissions}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleResetPermissions} size="sm">
                      {t.settings.resetToDefaults}
                    </Button>
                    <Button variant="primary" onClick={handleSavePermissions} disabled={savingPermissions} size="sm">
                      {savingPermissions ? t.settings.saving : t.settings.saveChanges}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Role Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.selectRole}</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => {
                        setSelectedRole(e.target.value as 'ADMIN' | 'EMPLOYEE')
                        fetchRolePermissions(e.target.value as 'ADMIN' | 'EMPLOYEE')
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 max-w-xs"
                    >
                      <option value="EMPLOYEE">{t.settings.employee}</option>
                      <option value="ADMIN">{t.settings.admin}</option>
                    </select>
                    {selectedRole === 'ADMIN' && (
                      <p className="text-sm text-gray-500 mt-2">{t.settings.adminHasAllPermissions}</p>
                    )}
                  </div>

                  {/* Permissions by Module */}
                  {Object.entries(permissions).map(([module, modulePermissions]) => (
                    <div key={module} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3 capitalize">{module}</h4>
                      <div className="space-y-2">
                        {modulePermissions.map((perm: any) => (
                          <div key={perm.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{perm.name.replace(module + '.', '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                              {perm.description && (
                                <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                              )}
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input
                                type="checkbox"
                                checked={selectedRole === 'ADMIN' ? true : (rolePermissions[perm.name] || false)}
                                onChange={() => handleTogglePermission(perm.name)}
                                disabled={selectedRole === 'ADMIN'}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* VAT Rates Settings */}
          {activeTab === 'vat-rates' && (
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.vatRatesSettings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-6">
                    {t.settings.vatRatesDescription}
                  </p>
                </div>

                {loadingVatRates ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {vatRates.map((rate, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          {index === 0 ? t.settings.vatRate1 : index === 1 ? t.settings.vatRate2 : t.settings.vatRate3}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.settings.vatRateName} *
                            </label>
                            <input
                              type="text"
                              value={rate.name}
                              onChange={(e) => handleVatRateChange(index, 'name', e.target.value)}
                              placeholder="z.B. Standard"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.settings.vatRatePercentage} *
                            </label>
                            <input
                              type="number"
                              value={rate.rate || ''}
                              onChange={(e) => handleVatRateChange(index, 'rate', parseFloat(e.target.value) || 0)}
                              onFocus={(e) => {
                                if (parseFloat(e.target.value) === 0) {
                                  e.target.value = '';
                                }
                              }}
                              placeholder="7.7"
                              step="0.1"
                              min="0"
                              max="100"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={rate.isDefault}
                                onChange={(e) => handleVatRateChange(index, 'isDefault', e.target.checked)}
                                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {t.settings.setAsDefault}
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    variant="primary" 
                    onClick={handleSaveVatRates}
                    disabled={savingVatRates || loadingVatRates}
                  >
                    {savingVatRates ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        {t.settings.saving}
                      </div>
                    ) : (
                      t.settings.saveChanges
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.billingSubscription}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{t.settings.proPlan}</h4>
                    <p className="text-sm text-gray-500">CHF 29/month • {t.settings.nextBilling} Dec 15, 2024</p>
                  </div>
                  <Button variant="outline">{t.settings.changePlan}</Button>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">{t.settings.paymentMethod}</h4>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">•••• •••• •••• 1234</p>
                        <p className="text-xs text-gray-500">{t.settings.expiresDate} 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">{t.settings.update}</Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">{t.settings.billingHistory}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">November 2024</span>
                      <span className="text-sm font-medium text-gray-900">CHF 29.00</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">October 2024</span>
                      <span className="text-sm font-medium text-gray-900">CHF 29.00</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">September 2024</span>
                      <span className="text-sm font-medium text-gray-900">CHF 29.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings






