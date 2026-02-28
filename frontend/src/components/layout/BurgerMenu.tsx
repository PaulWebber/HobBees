/**
 * Burger Menu Component
 */
import { useState } from 'react'
import { useAuth } from '@/store/context/AuthContext'
import { useEditMode } from '@/store/context/EditModeContext'
import { useNavigate } from 'react-router-dom'

interface BurgerMenuProps {
  onNewHobby: () => void
  onNewCategory?: () => void
  hasSelectedHobby: boolean
}

const BurgerMenu = ({ onNewHobby, onNewCategory, hasSelectedHobby }: BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()
  const { toggleEditMode, isEditMode } = useEditMode()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <div className="relative">
      {/* Burger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
        aria-label="Menu"
      >
        <span className={`block w-6 h-0.5 transition-all ${isEditMode ? 'bg-bee-red' : 'bg-bee-yellow'}`} />
        <span className={`block w-6 h-0.5 transition-all ${isEditMode ? 'bg-bee-red' : 'bg-bee-yellow'}`} />
        <span className={`block w-6 h-0.5 transition-all ${isEditMode ? 'bg-bee-red' : 'bg-bee-yellow'}`} />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={closeMenu}
          />
          
          {/* Menu Items */}
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 overflow-hidden">
            <button
              onClick={() => {
                onNewHobby()
                closeMenu()
              }}
              className="block w-full text-left px-4 py-3 text-bee-black hover:bg-gray-100 transition-colors"
            >
              New Hobby
            </button>

            {hasSelectedHobby && onNewCategory && (
              <button
                onClick={() => {
                  onNewCategory()
                  closeMenu()
                }}
                className="block w-full text-left px-4 py-3 text-bee-black hover:bg-gray-100 transition-colors"
              >
                New Category
              </button>
            )}

            <button
              onClick={() => {
                toggleEditMode()
                closeMenu()
              }}
              className="block w-full text-left px-4 py-3 text-bee-black hover:bg-gray-100 transition-colors"
            >
              {isEditMode ? 'Exit Edit Mode' : 'Edit/Delete'}
            </button>

            <button
              onClick={() => {
                // Settings navigation
                closeMenu()
              }}
              className="block w-full text-left px-4 py-3 text-bee-black hover:bg-gray-100 transition-colors"
            >
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-bee-black hover:bg-gray-100 transition-colors border-t border-gray-200"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default BurgerMenu
