import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../contexts/ToastContext'
import Button from '../components/Button'
import Input from '../components/Input'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'

const AcceptInvitation: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [invitation, setInvitation] = useState<any>(null)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (token) {
      loadInvitation()
    }
  }, [token])

  const loadInvitation = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await apiClient.getInvitationByToken(token)
      if (response.success) {
        setInvitation(response.data.invitation)
        setFormData(prev => ({ ...prev, name: response.data.invitation.name || '' }))
      } else {
        showError('Invalid Invitation', response.error || 'This invitation is invalid or has expired')
        setTimeout(() => navigate('/login'), 3000)
      }
    } catch (error: any) {
      console.error('Error loading invitation:', error)
      showError('Error', error.response?.data?.error || 'Failed to load invitation')
      setTimeout(() => navigate('/login'), 3000)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.name) {
      newErrors.name = 'Name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAccept = async () => {
    if (!validateForm() || !token) return

    setAccepting(true)
    try {
      const response = await apiClient.acceptInvitation(token, formData.password, formData.name)
      if (response.success) {
        showSuccess('Account Created', 'Your account has been created successfully! You can now log in.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        showError('Failed to Accept', response.error || 'Failed to create your account')
      }
    } catch (error: any) {
      console.error('Error accepting invitation:', error)
      showError('Error', error.response?.data?.error || 'Failed to accept invitation')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Not Found</h2>
              <p className="text-gray-600 mb-6">This invitation is invalid or has expired.</p>
              <Button variant="primary" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Accept Invitation</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">You've been invited!</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>{invitation.company?.name || 'A company'}</strong> has invited you to join their team.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  You'll be added as a <strong>{invitation.role}</strong>. Set up your account below to get started.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={invitation.email}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div>
                <Input
                  label="Full Name *"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    setErrors({ ...errors, name: '' })
                  }}
                  placeholder="Enter your full name"
                  error={errors.name}
                />
              </div>

              <div>
                <Input
                  label="Password *"
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    setErrors({ ...errors, password: '' })
                  }}
                  placeholder="Create a password (min. 8 characters)"
                  error={errors.password}
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
              </div>

              <div>
                <Input
                  label="Confirm Password *"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value })
                    setErrors({ ...errors, confirmPassword: '' })
                  }}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                />
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleAccept}
                  disabled={accepting || !formData.password || !formData.confirmPassword || !formData.name}
                >
                  {accepting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Accept Invitation & Create Account'
                  )}
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AcceptInvitation

