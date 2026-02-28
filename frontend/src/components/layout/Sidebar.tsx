/**
 * Sidebar Component - Shows hobby tabs
 */
import { Hobby } from '@/types/hobby'
import { useEditMode } from '@/store/context/EditModeContext'

interface SidebarProps {
  hobbies: Hobby[]
  selectedHobbyId: string | null
  onSelectHobby: (hobbyId: string) => void
}

const Sidebar = ({ hobbies, selectedHobbyId, onSelectHobby }: SidebarProps) => {
  const { isEditMode } = useEditMode()

  return (
    <aside className={`w-64 min-h-screen border-r-2 transition-colors ${
      isEditMode ? 'bg-bee-black border-bee-red' : 'bg-bee-black border-bee-yellow'
    }`}>
      <div className="p-4">
        <h2 className={`text-xl font-bold mb-4 ${
          isEditMode ? 'text-bee-red' : 'text-bee-yellow'
        }`}>
          My Hobbies
        </h2>
        
        <div className="space-y-2">
          {hobbies.length === 0 ? (
            <p className="text-gray-400 text-sm">No hobbies yet. Create one to get started!</p>
          ) : (
            hobbies.map((hobby) => (
              <button
                key={hobby.id}
                onClick={() => onSelectHobby(hobby.id)}
                className={`w-full text-left px-4 py-3 rounded transition-colors ${
                  selectedHobbyId === hobby.id
                    ? isEditMode
                      ? 'bg-bee-red text-white'
                      : 'bg-bee-yellow text-bee-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {hobby.name}
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
