/**
 * Category Box Component - Displays a category with its items
 */
import { useState } from 'react'
import { Category, SubCategoryItem } from '@/types/hobby'
import { useEditMode } from '@/store/context/EditModeContext'
import Button from '../common/Button'
import Modal from '../common/Modal'
import DynamicForm from '../forms/DynamicForm'

interface CategoryBoxProps {
  category: Category
  onAddItem: (data: Record<string, any>) => void
  onEditItem: (itemId: string, data: Record<string, any>) => void
  onDeleteItem: (itemId: string) => void
  onDeleteCategory: () => void
}

const CategoryBox = ({
  category,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDeleteCategory,
}: CategoryBoxProps) => {
  const { isEditMode } = useEditMode()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SubCategoryItem | null>(null)

  const handleAddSubmit = (data: Record<string, any>) => {
    onAddItem(data)
    setIsAddModalOpen(false)
  }

  const handleEditSubmit = (data: Record<string, any>) => {
    if (editingItem) {
      onEditItem(editingItem.id, data)
      setEditingItem(null)
    }
  }

  return (
    <div
      className={`border-2 rounded-lg p-4 transition-colors ${
        isEditMode ? 'border-bee-red' : 'border-bee-yellow'
      }`}
    >
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-bee-black">{category.name}</h3>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            Add New
          </Button>
          {isEditMode && (
            <Button size="sm" variant="danger" onClick={onDeleteCategory}>
              Delete Category
            </Button>
          )}
        </div>
      </div>

      {/* Items List */}
      {category.items.length === 0 ? (
        <p className="text-gray-500 text-sm">No items yet. Click "Add New" to add one.</p>
      ) : (
        <div className="space-y-3">
          {category.items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(item.data).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-xs text-gray-600 font-medium">{key}:</span>
                    <span className="ml-1 text-sm text-bee-black">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
              
              {isEditMode && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add ${category.name}`}
        size="md"
      >
        <DynamicForm
          schema={category.schema}
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Edit ${category.name}`}
        size="md"
      >
        {editingItem && (
          <DynamicForm
            schema={category.schema}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingItem(null)}
            defaultValues={editingItem.data}
            isEditMode={true}
          />
        )}
      </Modal>
    </div>
  )
}

export default CategoryBox
