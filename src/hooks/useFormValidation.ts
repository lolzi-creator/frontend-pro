import { useState, useCallback } from 'react'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  email?: boolean
  number?: boolean
  min?: number
  max?: number
}

export interface ValidationErrors {
  [key: string]: string
}

export interface FormData {
  [key: string]: any
}

export const useFormValidation = (initialData: FormData, rules: Record<string, ValidationRule>) => {
  const [data, setData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = rules[name]
    if (!rule) return null

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${name} is required`
    }

    // Skip other validations if value is empty and not required
    if (!value || value.toString().trim() === '') {
      return null
    }

    // Email validation
    if (rule.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    // Number validation
    if (rule.number) {
      if (isNaN(Number(value))) {
        return 'Please enter a valid number'
      }
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters long`
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name} must be no more than ${rule.maxLength} characters long`
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return `Please enter a valid ${name}`
    }

    // Min value validation
    if (rule.min !== undefined && Number(value) < rule.min) {
      return `${name} must be at least ${rule.min}`
    }

    // Max value validation
    if (rule.max !== undefined && Number(value) > rule.max) {
      return `${name} must be no more than ${rule.max}`
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value)
    }

    return null
  }, [rules])

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(rules).forEach(name => {
      const error = validateField(name, data[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [data, rules, validateField])

  const setFieldValue = useCallback((name: string, value: any) => {
    setData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  const setFieldTouched = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  const handleBlur = useCallback((name: string) => {
    setFieldTouched(name)
    const error = validateField(name, data[name])
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [data, validateField, setFieldTouched])

  const handleChange = useCallback((name: string, value: any) => {
    setFieldValue(name, value)
  }, [setFieldValue])

  const reset = useCallback(() => {
    setData(initialData)
    setErrors({})
    setTouched({})
  }, [initialData])

  const getFieldError = useCallback((name: string): string | null => {
    return touched[name] ? errors[name] || null : null
  }, [errors, touched])

  const isFieldValid = useCallback((name: string): boolean => {
    return !getFieldError(name)
  }, [getFieldError])

  const isFormValid = useCallback((): boolean => {
    return Object.keys(rules).every(name => isFieldValid(name))
  }, [rules, isFieldValid])

  return {
    data,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    getFieldError,
    isFieldValid,
    isFormValid,
    reset
  }
}

