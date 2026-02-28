/**
 * Floating Actions Component - Save and Cancel buttons in edit mode
 */
import { useEditMode } from '@/store/context/EditModeContext'
import Button from '../common/Button'

interface FloatingActionsProps {
  onSave: () => void
  onCancel: () => void
}

const FloatingActions = ({ onSave, onCancel }: FloatingActionsProps) => {
  const { isEditMode } = useEditMode()

  if (!isEditMode) return null

  return (
    <div className="fixed bottom-6 right-6 flex gap-3 z-40">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onSave}>
        Save Changes
      </Button>
    </div>
  )
}

export default FloatingActions
