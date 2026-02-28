/**
 * Hobby-related types
 */

export type FieldType = 'text' | 'number' | 'date' | 'boolean'

export interface FieldDefinition {
  name: string
  field_type: FieldType
  required: boolean
}

export interface CategorySchema {
  category_name: string
  fields: FieldDefinition[]
}

export interface SubCategoryItem {
  id: string
  data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Category {
  name: string
  schema: CategorySchema
  items: SubCategoryItem[]
  created_at: string
  updated_at: string
}

export interface Hobby {
  id: string
  user_id: string
  name: string
  description?: string
  categories: Category[]
  created_at: string
  updated_at: string
}

export interface HobbyCreate {
  name: string
  description?: string
}

export interface HobbyUpdate {
  name?: string
  description?: string
}

export interface CategoryCreate {
  name: string
  fields: FieldDefinition[]
}

export interface CategoryUpdate {
  name?: string
  fields?: FieldDefinition[]
}

export interface SubCategoryItemCreate {
  data: Record<string, any>
}

export interface SubCategoryItemUpdate {
  data: Record<string, any>
}
