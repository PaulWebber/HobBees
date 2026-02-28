/**
 * Field Renderer Component - Renders appropriate input based on field type
 */
import { FieldDefinition, FieldType } from '@/types/hobby'
import { UseFormRegister } from 'react-hook-form'

interface FieldRendererProps {
  field: FieldDefinition
  register: UseFormRegister<any>
  error?: string
  defaultValue?: any
  disabled?: boolean
}

const FieldRenderer = ({ field, register, error, defaultValue, disabled = false }: FieldRendererProps) => {
  const renderInput = () => {
    switch (field.field_type) {
      case 'text':
        return (
          <input
            type="text"
            {...register(field.name, { required: field.required })}
            defaultValue={defaultValue}
            disabled={disabled}
            className="input-field"
            placeholder={`Enter ${field.name}`}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            {...register(field.name, { required: field.required, valueAsNumber: true })}
            defaultValue={defaultValue}
            disabled={disabled}
            className="input-field"
            placeholder={`Enter ${field.name}`}
            step="any"
          />
        )

      case 'date':
        return (
          <input
            type="date"
            {...register(field.name, { required: field.required })}
            defaultValue={defaultValue}
            disabled={disabled}
            className="input-field"
          />
        )

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register(field.name)}
              defaultChecked={defaultValue}
              disabled={disabled}
              className="w-4 h-4 text-bee-yellow bg-gray-100 border-gray-300 rounded focus:ring-bee-yellow focus:ring-2"
            />
            <label className="ml-2 text-sm text-gray-700">Yes</label>
          </div>
        )

      default:
        return (
          <input
            type="text"
            {...register(field.name, { required: field.required })}
            defaultValue={defaultValue}
            disabled={disabled}
            className="input-field"
          />
        )
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.name}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default FieldRenderer
