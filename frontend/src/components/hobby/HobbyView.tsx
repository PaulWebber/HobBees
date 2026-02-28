/**
 * Hobby View Component - Displays all categories for a hobby
 */
import { Hobby } from '@/types/hobby'
import CategoryBox from '../category/CategoryBox'
import hobbyService from '@/services/hobbyService'
import { useState } from 'react'

interface HobbyViewProps {
  hobby: Hobby
  onUpdate: () => void
}

const HobbyView = ({ hobby, onUpdate }: HobbyViewProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddItem = async (categoryName: string, data: Record<string, any>) => {
    try {
      setIsLoading(true)
      await hobbyService.addItemToCategory(hobby.id, categoryName, { data })
      onUpdate()
    } catch (error) {
      console.error('Error adding item:', error)
      alert('Failed to add item')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditItem = async (
    categoryName: string,
    itemId: string,
    data: Record<string, any>
  ) => {
    try {
      setIsLoading(true)
      await hobbyService.updateItemInCategory(hobby.id, categoryName, itemId, { data })
      onUpdate()
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update item')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (categoryName: string, itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      setIsLoading(true)
      await hobbyService.deleteItemFromCategory(hobby.id, categoryName, itemId)
      onUpdate()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryName: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) return

    try {
      setIsLoading(true)
      await hobbyService.deleteCategory(hobby.id, categoryName)
      onUpdate()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Hobby Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-bee-black">{hobby.name}</h2>
        {hobby.description && (
          <p className="text-gray-600 mt-2">{hobby.description}</p>
        )}
      </div>

      {/* Categories */}
      {hobby.categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No categories yet. Use the menu to add a category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {hobby.categories.map((category) => (
            <CategoryBox
              key={category.name}
              category={category}
              onAddItem={(data) => handleAddItem(category.name, data)}
              onEditItem={(itemId, data) => handleEditItem(category.name, itemId, data)}
              onDeleteItem={(itemId) => handleDeleteItem(category.name, itemId)}
              onDeleteCategory={() => handleDeleteCategory(category.name)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HobbyView
