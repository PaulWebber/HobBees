/**
 * Custom hook for managing hobbies
 */
import { useState, useEffect } from 'react'
import { Hobby } from '@/types/hobby'
import hobbyService from '@/services/hobbyService'

export const useHobbies = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHobbies = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await hobbyService.getHobbies()
      setHobbies(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch hobbies')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHobbies()
  }, [])

  const refreshHobbies = () => {
    fetchHobbies()
  }

  return {
    hobbies,
    isLoading,
    error,
    refreshHobbies,
  }
}

export default useHobbies
