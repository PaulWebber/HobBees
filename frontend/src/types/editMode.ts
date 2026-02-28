/**
 * Edit mode context types
 */

export interface EditModeContextType {
  isEditMode: boolean
  hasUnsavedChanges: boolean
  enterEditMode: () => void
  exitEditMode: () => void
  toggleEditMode: () => void
  setHasUnsavedChanges: (value: boolean) => void
}
