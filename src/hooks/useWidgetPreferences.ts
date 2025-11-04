import { useState, useEffect, useMemo } from 'react'
import { getAvailableWidgets } from '../components/DashboardCustomizeModal'
import { useLanguage } from '../contexts/LanguageContext'

const WIDGET_PREFERENCES_KEY = 'dashboard_widget_preferences'

export interface WidgetPreference {
  id: string
  visible: boolean
  order: number
}

export const useWidgetPreferences = () => {
  const { t } = useLanguage()
  
  const getDefaultWidgets = (): WidgetPreference[] => {
    const availableWidgets = getAvailableWidgets(t)
    return availableWidgets
      .filter(w => w.defaultVisible)
      .map((w, index) => ({
        id: w.id,
        visible: true,
        order: index
      }))
  }

  const [widgetPreferences, setWidgetPreferences] = useState<WidgetPreference[]>(() => {
    try {
      const saved = localStorage.getItem(WIDGET_PREFERENCES_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
          const availableWidgets = getAvailableWidgets(t)
          const availableIds = availableWidgets.map(w => w.id)
          const valid = parsed.filter((wp: WidgetPreference) => availableIds.includes(wp.id))
          if (valid.length > 0) {
            return valid
          }
        }
      }
    } catch (error) {
      console.error('Error loading widget preferences:', error)
    }
    return getDefaultWidgets()
  })

  // Sync with available widgets when language changes
  useEffect(() => {
    const availableWidgets = getAvailableWidgets(t)
    const availableIds = availableWidgets.map(w => w.id)
    
    const newDefaults = availableWidgets
      .filter(w => w.defaultVisible && !widgetPreferences.some(wp => wp.id === w.id))
      .map((w, index) => ({
        id: w.id,
        visible: true,
        order: widgetPreferences.length + index
      }))
    
    if (newDefaults.length > 0) {
      setWidgetPreferences(prev => {
        const updated = [...prev, ...newDefaults]
        saveToStorage(updated)
        return updated
      })
    }
  }, [t])

  const saveToStorage = (prefs: WidgetPreference[]) => {
    try {
      localStorage.setItem(WIDGET_PREFERENCES_KEY, JSON.stringify(prefs))
    } catch (error) {
      console.error('Error saving widget preferences:', error)
    }
  }

  const saveWidgetPreferences = (prefs: WidgetPreference[]) => {
    setWidgetPreferences(prefs)
    saveToStorage(prefs)
  }

  const updateWidgetOrder = (widgetIds: string[]) => {
    const updated = widgetIds.map((id, index) => {
      const existing = widgetPreferences.find(wp => wp.id === id)
      return {
        id,
        visible: existing?.visible ?? true,
        order: index
      }
    })
    saveWidgetPreferences(updated)
  }

  const toggleWidget = (widgetId: string) => {
    const updated = widgetPreferences.map(wp => 
      wp.id === widgetId ? { ...wp, visible: !wp.visible } : wp
    )
    saveWidgetPreferences(updated)
  }

  const addWidget = (widgetId: string) => {
    if (!widgetPreferences.some(wp => wp.id === widgetId)) {
      const availableWidgets = getAvailableWidgets(t)
      const widget = availableWidgets.find(w => w.id === widgetId)
      if (widget) {
        const newPref: WidgetPreference = {
          id: widgetId,
          visible: true,
          order: widgetPreferences.length
        }
        saveWidgetPreferences([...widgetPreferences, newPref])
      }
    } else {
      toggleWidget(widgetId)
    }
  }

  const removeWidget = (widgetId: string) => {
    toggleWidget(widgetId)
  }

  const visibleWidgets = useMemo(() => {
    return widgetPreferences
      .filter(wp => wp.visible)
      .sort((a, b) => a.order - b.order)
      .map(wp => wp.id)
  }, [widgetPreferences])

  const isWidgetVisible = (widgetId: string): boolean => {
    return widgetPreferences.some(wp => wp.id === widgetId && wp.visible)
  }

  const resetToDefaults = () => {
    const defaults = getDefaultWidgets()
    saveWidgetPreferences(defaults)
  }

  return {
    widgetPreferences,
    visibleWidgets,
    saveWidgetPreferences,
    updateWidgetOrder,
    addWidget,
    removeWidget,
    toggleWidget,
    isWidgetVisible,
    resetToDefaults
  }
}
