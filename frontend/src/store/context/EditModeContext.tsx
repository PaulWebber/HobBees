/**
 * Edit Mode Context Provider
 */
import { createContext, useContext, useState, ReactNode } from 'react'
import { EditModeContextType } from '@/types/editMode'

const EditModeContext = createContext<EditModeContextType | undefined>(undefined)

export const useEditMode = () => {
  const context = useContext(EditModeContext)
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider')
  }
  return context
}

interface EditModeProviderProps {
  children: ReactNode
}

export const EditModeProvider = ({ children }: EditModeProviderProps) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const enterEditMode = () => {
    setIsEditMode(true)
    setHasUnsavedChanges(false)
  }

  const exitEditMode = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to exit edit mode?'
      )
      if (!confirmed) {
        return
      }
    }
    setIsEditMode(false)
    setHasUnsavedChanges(false)
  }

  const toggleEditMode = () => {
    if (isEditMode) {
      exitEditMode()
    } else {
      enterEditMode()
    }
  }

  const value: EditModeContextType = {
    isEditMode,
    hasUnsavedChanges,
    enterEditMode,
    exitEditMode,
    toggleEditMode,
    setHasUnsavedChanges,
  }

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
}

export default EditModeContext
