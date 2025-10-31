import React, { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { Alert, LoadingSpinner } from '../components'
import { apiClient } from '../lib/api'
import Modal from '../components/Modal'

const Settings: React.FC = () => {
  const { showSuccess, showError, showInfo } = useToast()
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

  // Get current user to check if admin
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = currentUser?.role === 'ADMIN'

  const handleSave = async (section: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showSuccess('Settings Saved', `${section} settings have been updated successfully.`)
    } catch (err) {
      setError('Failed to save settings. Please try again.')
      showError('Save Failed', 'Failed to save settings. Please try again.')
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

  const fetchUsers = async () => {
    try {
      const response = await apiClient.getUsers()
      if (response.success) {
        setUsers(response.data || [])
      }
    } catch (error: any) {
      console.error('Error fetching users:', error)
      showError('Failed to load users', error.response?.data?.message || 'Unknown error')
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
      showError('Failed to load permissions', error.response?.data?.message || 'Unknown error')
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
      showError('Failed to load role permissions', error.response?.data?.message || 'Unknown error')
    }
  }

  const handleInviteUser = async () => {
    if (!inviteForm.email || !inviteForm.name) {
      showError('Validation Error', 'Please fill in all required fields')
      return
    }

    setInviting(true)
    try {
      const response = await apiClient.inviteUser(inviteForm.email, inviteForm.name, inviteForm.role)
      if (response.success) {
        showSuccess('Invitation Sent', `Invitation email has been sent to ${inviteForm.email}`)
        setShowInviteModal(false)
        setInviteForm({ email: '', name: '', role: 'EMPLOYEE' })
        fetchInvitations()
      } else {
        showError('Failed to send invitation', response.message || 'Unknown error')
      }
    } catch (error: any) {
      console.error('Error inviting user:', error)
      showError('Failed to send invitation', error.response?.data?.message || 'Unknown error')
    } finally {
      setInviting(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: 'ADMIN' | 'EMPLOYEE') => {
    try {
      const response = await apiClient.updateUserRole(userId, newRole)
      if (response.success) {
        showSuccess('Role Updated', 'User role has been updated successfully')
        fetchUsers()
      } else {
        showError('Failed to update role', response.message || 'Unknown error')
      }
    } catch (error: any) {
      console.error('Error updating user role:', error)
      showError('Failed to update role', error.response?.data?.message || 'Unknown error')
    }
  }

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = isActive 
        ? await apiClient.reactivateUser(userId)
        : await apiClient.deactivateUser(userId)
      
      if (response.success) {
        showSuccess('Status Updated', `User has been ${isActive ? 'reactivated' : 'deactivated'}`)
        fetchUsers()
      }
    } catch (error: any) {
      console.error('Error updating user status:', error)
      showError('Failed to update status', error.response?.data?.message || 'Unknown error')
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const response = await apiClient.cancelInvitation(invitationId)
      if (response.success) {
        showSuccess('Invitation Cancelled', 'The invitation has been cancelled')
        fetchInvitations()
      }
    } catch (error: any) {
      console.error('Error cancelling invitation:', error)
      showError('Failed to cancel invitation', error.response?.data?.message || 'Unknown error')
    }
  }

  const handleSavePermissions = async () => {
    setSavingPermissions(true)
    try {
      const response = await apiClient.updateRolePermissions(selectedRole, rolePermissions)
      if (response.success) {
        showSuccess('Permissions Updated', `Permissions for ${selectedRole} role have been updated`)
      } else {
        showError('Failed to update permissions', response.message || 'Unknown error')
      }
    } catch (error: any) {
      console.error('Error updating permissions:', error)
      showError('Failed to update permissions', error.response?.data?.message || 'Unknown error')
    } finally {
      setSavingPermissions(false)
    }
  }

  const handleResetPermissions = async () => {
    if (!window.confirm(`Are you sure you want to reset all permissions for ${selectedRole} role to defaults?`)) {
      return
    }

    try {
      const response = await apiClient.resetRolePermissions(selectedRole)
      if (response.success) {
        showSuccess('Permissions Reset', `Permissions for ${selectedRole} role have been reset to defaults`)
        fetchRolePermissions(selectedRole)
      }
    } catch (error: any) {
      console.error('Error resetting permissions:', error)
      showError('Failed to reset permissions', error.response?.data?.message || 'Unknown error')
    }
  }

  const handleTogglePermission = (permissionName: string) => {
    if (selectedRole === 'ADMIN') {
      showInfo('Info', 'Admin role has all permissions and cannot be modified')
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
      showError('Failed to load company data', error.response?.data?.message || 'Unknown error')
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      showError('Invalid File Type', 'Please upload an image file (JPEG, PNG, GIF, WebP, or SVG)')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('File Too Large', 'Logo file must be smaller than 5MB')
      return
    }

    setUploadingLogo(true)
    try {
      const response = await apiClient.uploadLogo(file)
      if (response.success) {
        setLogoUrl(response.data?.logo_url || null)
        showSuccess('Logo Uploaded', 'Company logo has been uploaded successfully')
        // Refresh company data
        fetchCompany()
      } else {
        showError('Upload Failed', response.message || 'Failed to upload logo')
      }
    } catch (error: any) {
      console.error('Error uploading logo:', error)
      showError('Upload Failed', error.response?.data?.message || 'Failed to upload logo')
    } finally {
      setUploadingLogo(false)
      // Reset input
      event.target.value = ''
    }
  }

  const handleDeleteLogo = async () => {
    if (!window.confirm('Are you sure you want to delete the company logo?')) {
      return
    }

    setDeletingLogo(true)
    try {
      const response = await apiClient.deleteLogo()
      if (response.success) {
        setLogoUrl(null)
        showSuccess('Logo Deleted', 'Company logo has been deleted successfully')
        // Refresh company data
        fetchCompany()
      } else {
        showError('Delete Failed', response.message || 'Failed to delete logo')
      }
    } catch (error: any) {
      console.error('Error deleting logo:', error)
      showError('Delete Failed', error.response?.data?.message || 'Failed to delete logo')
    } finally {
      setDeletingLogo(false)
    }
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Poppins'}}>
              Settings
            </h2>
            <p className="text-gray-600">
              Manage your account and application preferences
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            title="Error"
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
                  Profile
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
                  Company
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
                  Preferences
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
                  Security
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
                  Team
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
                    Permissions
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
                  Billing
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
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-600">JD</span>
                  </div>
                  <div>
                    <Button variant="outline">Change Photo</Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
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
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
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
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Logo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Company Logo</label>
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
                              Uploading...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              {logoUrl ? 'Change Logo' : 'Upload Logo'}
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
                                Deleting...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Logo
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        JPG, PNG, GIF, WebP, or SVG. Max size 5MB. The logo will appear on all PDFs and emails.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    defaultValue={companyData?.name || "InvoSmart AG"}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VAT Number</label>
                    <input
                      type="text"
                      defaultValue="CHE-123.456.789"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company UID</label>
                    <input
                      type="text"
                      defaultValue="CHE-123.456.789"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
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
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
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
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>English</option>
                    <option>Deutsch</option>
                    <option>Français</option>
                    <option>Italiano</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>CHF (Swiss Franc)</option>
                    <option>EUR (Euro)</option>
                    <option>USD (US Dollar)</option>
                    <option>GBP (British Pound)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                      <p className="text-sm text-gray-500">Use dark theme for the application</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Auto-save</h4>
                      <p className="text-sm text-gray-500">Automatically save changes as you work</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="primary">Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <Button variant="primary">Update Password</Button>
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
                    <CardTitle>Team Management</CardTitle>
                    {isAdmin && (
                      <Button variant="primary" onClick={() => setShowInviteModal(true)}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Invite Member
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Team Members</h4>
                      <p className="text-sm text-gray-500 mb-4">Manage your team members and their roles</p>
                      <div className="space-y-3">
                        {users.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">No users found</p>
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
                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">You</span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs px-2 py-0.5 rounded ${
                                        user.role === 'ADMIN' 
                                          ? 'bg-orange-100 text-orange-800' 
                                          : 'bg-blue-100 text-blue-800'
                                      }`}>
                                        {user.role}
                                      </span>
                                      {!user.is_active && (
                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Inactive</span>
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
                                      <option value="EMPLOYEE">Employee</option>
                                      <option value="ADMIN">Admin</option>
                                    </select>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleToggleUserStatus(user.id, !user.is_active)}
                                    >
                                      {user.is_active ? 'Deactivate' : 'Activate'}
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
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Pending Invitations</h4>
                        <div className="space-y-2">
                          {invitations
                            .filter((inv: any) => !inv.accepted_at && new Date(inv.expires_at) > new Date())
                            .map((invitation: any) => (
                              <div key={invitation.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{invitation.name}</p>
                                  <p className="text-xs text-gray-500">{invitation.email} • {invitation.role}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelInvitation(invitation.id)}
                                >
                                  Cancel
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
                title="Invite Team Member"
                size="md"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as 'ADMIN' | 'EMPLOYEE' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="ADMIN">Admin</option>
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
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleInviteUser}
                      disabled={inviting || !inviteForm.email || !inviteForm.name}
                    >
                      {inviting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Sending...
                        </>
                      ) : (
                        'Send Invitation'
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
                  <CardTitle>Role Permissions</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleResetPermissions} size="sm">
                      Reset to Defaults
                    </Button>
                    <Button variant="primary" onClick={handleSavePermissions} disabled={savingPermissions} size="sm">
                      {savingPermissions ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Role Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => {
                        setSelectedRole(e.target.value as 'ADMIN' | 'EMPLOYEE')
                        fetchRolePermissions(e.target.value as 'ADMIN' | 'EMPLOYEE')
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 max-w-xs"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    {selectedRole === 'ADMIN' && (
                      <p className="text-sm text-gray-500 mt-2">Admin role has all permissions enabled and cannot be modified.</p>
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

          {/* Billing Settings */}
          {activeTab === 'billing' && (
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Pro Plan</h4>
                    <p className="text-sm text-gray-500">CHF 29/month • Next billing: Dec 15, 2024</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h4>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">•••• •••• •••• 1234</p>
                        <p className="text-xs text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Billing History</h4>
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






