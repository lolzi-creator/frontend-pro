import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import { useLanguage } from '../contexts/LanguageContext'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Plus, X } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import WidgetPreview from './WidgetPreview'

export interface DashboardWidget {
  id: string
  title: string
  description: string
  defaultVisible: boolean
}

interface DashboardCustomizeModalProps {
  isOpen: boolean
  onClose: () => void
  widgetPreferences: Array<{ id: string; visible: boolean; order: number }>
  availableWidgets: DashboardWidget[]
  onSave: (widgets: Array<{ id: string; visible: boolean; order: number }>) => void
}

interface SortableWidgetItemProps {
  widget: DashboardWidget
  isVisible: boolean
  onToggle: () => void
  onPreview: () => void
  onRemove: () => void
}

const SortableWidgetItem: React.FC<SortableWidgetItemProps> = ({ widget, isVisible, onToggle, onPreview, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 border rounded-lg bg-white ${
        isDragging ? 'shadow-lg' : 'shadow-sm'
      } ${isVisible ? 'border-orange-200' : 'border-gray-200'}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-900">{widget.title}</h4>
          {isVisible && (
            <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
              Visible
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">{widget.description}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onPreview}
          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          title="Preview widget"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg transition-colors ${
            isVisible
              ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
          title={isVisible ? 'Hide widget' : 'Show widget'}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        {isVisible && (
          <button
            onClick={onRemove}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Remove widget"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

const DashboardCustomizeModal: React.FC<DashboardCustomizeModalProps> = ({
  isOpen,
  onClose,
  widgetPreferences,
  availableWidgets,
  onSave,
}) => {
  const { t } = useLanguage()
  const { stats } = useDashboard()
  const [localPreferences, setLocalPreferences] = useState(widgetPreferences)
  const [availableWidgetsList, setAvailableWidgetsList] = useState<DashboardWidget[]>(availableWidgets)
  const [previewWidget, setPreviewWidget] = useState<DashboardWidget | null>(null)

  useEffect(() => {
    if (isOpen) {
      setLocalPreferences(widgetPreferences)
      setAvailableWidgetsList(availableWidgets)
    }
  }, [isOpen, widgetPreferences, availableWidgets])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = localPreferences.findIndex((wp) => wp.id === active.id)
      const newIndex = localPreferences.findIndex((wp) => wp.id === over.id)

      const newPreferences = arrayMove(localPreferences, oldIndex, newIndex).map((wp, index) => ({
        ...wp,
        order: index,
      }))

      setLocalPreferences(newPreferences)
    }
  }

  const handleToggle = (widgetId: string) => {
    setLocalPreferences((prev) =>
      prev.map((wp) =>
        wp.id === widgetId ? { ...wp, visible: !wp.visible } : wp
      )
    )
  }

  const handleAddWidget = (widgetId: string) => {
    if (!localPreferences.some((wp) => wp.id === widgetId)) {
      const newPref = {
        id: widgetId,
        visible: true,
        order: localPreferences.length,
      }
      setLocalPreferences([...localPreferences, newPref])
    } else {
      handleToggle(widgetId)
    }
  }

  const handleRemoveWidget = (widgetId: string) => {
    setLocalPreferences((prev) => prev.filter((wp) => wp.id !== widgetId))
  }

  const handlePreview = (widgetId: string) => {
    const widget = availableWidgetsList.find((w) => w.id === widgetId)
    if (widget) {
      setPreviewWidget(widget)
    }
  }

  const handleSave = () => {
    onSave(localPreferences)
    onClose()
  }

  const handleReset = () => {
    const defaults = availableWidgetsList
      .filter((w) => w.defaultVisible)
      .map((w, index) => ({
        id: w.id,
        visible: true,
        order: index,
      }))
    setLocalPreferences(defaults)
  }

  const visibleWidgetIds = localPreferences.map((wp) => wp.id)
  const hiddenWidgets = availableWidgetsList.filter(
    (w) => !localPreferences.some((wp) => wp.id === w.id)
  )

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={t.dashboard.customizeDashboard} size="xl">
        <div className="flex flex-col h-full" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <div className="space-y-6">
              <p className="text-sm text-gray-600">
                {t.dashboard.selectWidgetsDescription ||
                  'Drag and drop widgets to reorder them. Click the eye icon to show/hide widgets.'}
              </p>

              {/* Visible Widgets Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Visible Widgets</h3>
                  <span className="text-xs text-gray-500">
                    {localPreferences.filter((wp) => wp.visible).length} visible
                  </span>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={localPreferences.map((wp) => wp.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {localPreferences.map((wp) => {
                        const widget = availableWidgetsList.find((w) => w.id === wp.id)
                        if (!widget) return null

                        return (
                          <SortableWidgetItem
                            key={wp.id}
                            widget={widget}
                            isVisible={wp.visible}
                            onToggle={() => handleToggle(wp.id)}
                            onPreview={() => handlePreview(wp.id)}
                            onRemove={() => handleRemoveWidget(wp.id)}
                          />
                        )
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Available Widgets Section */}
              {hiddenWidgets.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Available Widgets</h3>
                    <span className="text-xs text-gray-500">{hiddenWidgets.length} available</span>
                  </div>

                  <div className="space-y-2">
                    {hiddenWidgets.map((widget) => (
                      <div
                        key={widget.id}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-gray-900">{widget.title}</h4>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{widget.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreview(widget.id)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                            title="Preview widget"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAddWidget(widget.id)}
                            className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                            title="Add widget"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Action Buttons */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t bg-white sticky bottom-0 pb-2 -mx-6 px-6">
            <Button variant="secondary" onClick={handleReset}>
              {t.dashboard.resetToDefaults || 'Reset to Defaults'}
            </Button>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={onClose}>
                {t.common.cancel}
              </Button>
              <Button variant="primary" onClick={handleSave}>
                {t.dashboard.saveChanges || t.common.save}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Widget Preview Modal */}
      {previewWidget && (
        <WidgetPreview
          widget={previewWidget}
          isOpen={!!previewWidget}
          onClose={() => setPreviewWidget(null)}
          stats={stats}
        />
      )}
    </>
  )
}

export default DashboardCustomizeModal

// Export function to get widgets with translations
export const getAvailableWidgets = (t: any): DashboardWidget[] => [
  // Default widgets (always visible by default)
  {
    id: 'total-revenue',
    title: t.dashboard.totalRevenue,
    description: t.dashboard.widgetTotalRevenueDesc || 'Total revenue from all invoices',
    defaultVisible: true,
  },
  {
    id: 'outstanding',
    title: t.dashboard.outstanding,
    description: t.dashboard.widgetOutstandingDesc || 'Amount owed from unpaid invoices',
    defaultVisible: true,
  },
  {
    id: 'new-customers',
    title: t.dashboard.newCustomers,
    description: t.dashboard.widgetNewCustomersDesc || 'New customers this month',
    defaultVisible: true,
  },
  {
    id: 'quotes-sent',
    title: t.dashboard.quotesSent,
    description: t.dashboard.widgetQuotesSentDesc || 'Quotes sent this month',
    defaultVisible: true,
  },
  {
    id: 'recent-invoices',
    title: t.dashboard.widgetRecentInvoices || 'Recent Invoices',
    description: t.dashboard.widgetRecentInvoicesDesc || 'Latest invoices list',
    defaultVisible: true,
  },
]
