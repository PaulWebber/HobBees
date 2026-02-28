/**
 * Dashboard Page Component
 */
import { useState, useEffect } from 'react'
import { useEditMode } from '@/store/context/EditModeContext'
import { Hobby } from '@/types/hobby'
import BurgerMenu from '@/components/layout/BurgerMenu'
import Sidebar from '@/components/layout/Sidebar'
import FloatingActions from '@/components/layout/FloatingActions'
import HobbyView from '@/components/hobby/HobbyView'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import SchemaBuilder from '@/components/forms/SchemaBuilder'
import hobbyService from '@/services/hobbyService'
import useHobbies from '@/hooks/useHobbies'

const Dashboard = () => {
  const { isEditMode, setHasUnsavedChanges } = useEditMode()
  const { hobbies, refreshHobbies } = useHobbies()
  const [selectedHobbyId, setSelectedHobbyId] = useState<string | null>(null)
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null)
  
  // Modal states
  const [isNewHobbyModalOpen, setIsNewHobbyModalOpen] = useState(false)
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)
  
  // Form states
  const [newHobbyName, setNewHobbyName] = useState('')
  const [newHobbyDescription, setNewHobbyDescription] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')

  // Select first hobby by default
  useEffect(() => {
    if (hobbies.length > 0 && !selectedHobbyId) {
      setSelectedHobbyId(hobbies[0].id)
    }
  }, [hobbies, selectedHobbyId])

  // Load selected hobby details
  useEffect(() => {
    const loadHobby = async () => {
      if (selectedHobbyId) {
        try {
          const hobby = await hobbyService.getHobby(selectedHobbyId)
          setSelectedHobby(hobby)
        } catch (error) {
          console.error('Error loading hobby:', error)
        }
      }
    }
    loadHobby()
  }, [selectedHobbyId])

  const handleSelectHobby = (hobbyId: string) => {
    setSelectedHobbyId(hobbyId)
  }

  const handleCreateHobby = async () => {
    if (!newHobbyName.trim()) {
      alert('Please enter a hobby name')
      return
    }

    try {
      await hobbyService.createHobby({
        name: newHobbyName,
        description: newHobbyDescription || undefined,
      })
      refreshHobbies()
      setIsNewHobbyModalOpen(false)
      setNewHobbyName('')
      setNewHobbyDescription('')
    } catch (error) {
      console.error('Error creating hobby:', error)
      alert('Failed to create hobby')
    }
  }

  const handleCreateCategory = async (fields: any[]) => {
    if (!selectedHobbyId) return
    if (!newCategoryName.trim()) {
      alert('Please enter a category name')
      return
    }

    try {
      await hobbyService.addCategory(selectedHobbyId, {
        name: newCategoryName,
        fields,
      })
      
      // Reload the hobby
      const hobby = await hobbyService.getHobby(selectedHobbyId)
      setSelectedHobby(hobby)
      
      setIsNewCategoryModalOpen(false)
      setNewCategoryName('')
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Failed to create category')
    }
  }

  const handleSaveChanges = () => {
    // Refresh hobby data
    if (selectedHobbyId) {
      hobbyService.getHobby(selectedHobbyId).then(setSelectedHobby)
    }
    setHasUnsavedChanges(false)
    alert('Changes saved successfully!')
  }

  const handleCancelChanges = () => {
    // Reload hobby to discard changes
    if (selectedHobbyId) {
      hobbyService.getHobby(selectedHobbyId).then(setSelectedHobby)
    }
    setHasUnsavedChanges(false)
  }

  const handleHobbyUpdate = async () => {
    if (selectedHobbyId) {
      const hobby = await hobbyService.getHobby(selectedHobbyId)
      setSelectedHobby(hobby)
    }
  }

  return (
    <div className={`flex min-h-screen transition-colors ${
      isEditMode ? 'bg-gray-50' : 'bg-white'
    }`}>
      {/* Sidebar */}
      <Sidebar
        hobbies={hobbies}
        selectedHobbyId={selectedHobbyId}
        onSelectHobby={handleSelectHobby}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className={`border-b-2 p-4 transition-colors ${
          isEditMode ? 'bg-white border-bee-red' : 'bg-white border-bee-yellow'
        }`}>
          <div className="flex items-center justify-between">
            <BurgerMenu
              onNewHobby={() => setIsNewHobbyModalOpen(true)}
              onNewCategory={() => setIsNewCategoryModalOpen(true)}
              hasSelectedHobby={!!selectedHobbyId}
            />
            <h1 className={`text-2xl font-bold ${
              isEditMode ? 'text-bee-red' : 'text-bee-yellow'
            }`}>
              🐝 HobBees
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {selectedHobby ? (
            <HobbyView hobby={selectedHobby} onUpdate={handleHobbyUpdate} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Select a hobby from the sidebar or create a new one
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Buttons */}
      <FloatingActions
        onSave={handleSaveChanges}
        onCancel={handleCancelChanges}
      />

      {/* New Hobby Modal */}
      <Modal
        isOpen={isNewHobbyModalOpen}
        onClose={() => setIsNewHobbyModalOpen(false)}
        title="Create New Hobby"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Hobby Name"
            value={newHobbyName}
            onChange={(e) => setNewHobbyName(e.target.value)}
            placeholder="e.g., Slingshot, Knitting, Clay"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={newHobbyDescription}
              onChange={(e) => setNewHobbyDescription(e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Describe your hobby..."
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsNewHobbyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateHobby}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Category Modal */}
      <Modal
        isOpen={isNewCategoryModalOpen}
        onClose={() => setIsNewCategoryModalOpen(false)}
        title="Create New Category"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g., Latex, Needles, Frames"
          />
          <SchemaBuilder
            onSubmit={handleCreateCategory}
            onCancel={() => setIsNewCategoryModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard
