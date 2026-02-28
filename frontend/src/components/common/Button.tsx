/**
 * Button Component
 */
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { useEditMode } from '@/store/context/EditModeContext'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) => {
  const { isEditMode } = useEditMode()

  const baseClasses = 'font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  }

  const variantClasses = {
    primary: isEditMode 
      ? 'bg-bee-red hover:bg-bee-red-dark text-white' 
      : 'bg-bee-yellow hover:bg-bee-yellow-dark text-bee-black',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-bee-red hover:bg-bee-red-dark text-white',
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
