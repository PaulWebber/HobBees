/**
 * Hobby API service
 */
import api from './api'
import {
  Hobby,
  HobbyCreate,
  HobbyUpdate,
  CategoryCreate,
  CategoryUpdate,
  SubCategoryItemCreate,
  SubCategoryItemUpdate,
} from '@/types/hobby'

export const hobbyService = {
  /**
   * Get all hobbies for the current user
   */
  async getHobbies(): Promise<Hobby[]> {
    const response = await api.get<Hobby[]>('/hobbies')
    return response.data
  },

  /**
   * Get a specific hobby by ID
   */
  async getHobby(hobbyId: string): Promise<Hobby> {
    const response = await api.get<Hobby>(`/hobbies/${hobbyId}`)
    return response.data
  },

  /**
   * Create a new hobby
   */
  async createHobby(data: HobbyCreate): Promise<Hobby> {
    const response = await api.post<Hobby>('/hobbies', data)
    return response.data
  },

  /**
   * Update a hobby
   */
  async updateHobby(hobbyId: string, data: HobbyUpdate): Promise<Hobby> {
    const response = await api.put<Hobby>(`/hobbies/${hobbyId}`, data)
    return response.data
  },

  /**
   * Delete a hobby
   */
  async deleteHobby(hobbyId: string): Promise<void> {
    await api.delete(`/hobbies/${hobbyId}`)
  },

  /**
   * Add a category to a hobby
   */
  async addCategory(hobbyId: string, data: CategoryCreate): Promise<Hobby> {
    const response = await api.post<Hobby>(`/hobbies/${hobbyId}/categories`, data)
    return response.data
  },

  /**
   * Update a category in a hobby
   */
  async updateCategory(
    hobbyId: string,
    categoryName: string,
    data: CategoryUpdate
  ): Promise<Hobby> {
    const response = await api.put<Hobby>(
      `/hobbies/${hobbyId}/categories/${encodeURIComponent(categoryName)}`,
      data
    )
    return response.data
  },

  /**
   * Delete a category from a hobby
   */
  async deleteCategory(hobbyId: string, categoryName: string): Promise<Hobby> {
    const response = await api.delete<Hobby>(
      `/hobbies/${hobbyId}/categories/${encodeURIComponent(categoryName)}`
    )
    return response.data
  },

  /**
   * Add an item to a category
   */
  async addItemToCategory(
    hobbyId: string,
    categoryName: string,
    data: SubCategoryItemCreate
  ): Promise<Hobby> {
    const response = await api.post<Hobby>(
      `/hobbies/${hobbyId}/categories/${encodeURIComponent(categoryName)}/items`,
      data
    )
    return response.data
  },

  /**
   * Update an item in a category
   */
  async updateItemInCategory(
    hobbyId: string,
    categoryName: string,
    itemId: string,
    data: SubCategoryItemUpdate
  ): Promise<Hobby> {
    const response = await api.put<Hobby>(
      `/hobbies/${hobbyId}/categories/${encodeURIComponent(categoryName)}/items/${itemId}`,
      data
    )
    return response.data
  },

  /**
   * Delete an item from a category
   */
  async deleteItemFromCategory(
    hobbyId: string,
    categoryName: string,
    itemId: string
  ): Promise<Hobby> {
    const response = await api.delete<Hobby>(
      `/hobbies/${hobbyId}/categories/${encodeURIComponent(categoryName)}/items/${itemId}`
    )
    return response.data
  },
}

export default hobbyService
