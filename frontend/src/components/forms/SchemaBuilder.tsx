/**
 * Schema Builder Component - Allows users to define custom fields
 */
import { useState } from 'react'
import { FieldDefinition, FieldType } from '@/types/hobby'
import Button from '../common/Button'
import Input from '../common/Input'

interface SchemaBuilderProps {
  onSubmit: (fields: FieldDefinition[]) => void
  onCancel: () => void
}

const SchemaBuilder = ({ onSubmit, onCancel }: SchemaBuilderProps) => {
  const [fields, setFields] = useState<FieldDefinition[]>([])
  const [currentField, setCurrentField] = useState({
    name: '',
    field_type: 'text' as FieldType,
    required: false,
  })

  const addField = () => {
    if (!currentField.name.trim()) {
      alert('Please enter a field name')
      return
    }

    setFields([...fields, currentField])
    setCurrentField({
      name: '',
      field_type: 'text',
      required: false,
    })
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (fields.length === 0) {
      alert('Please add at least one field')
      return
    }
    onSubmit(fields)
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-bee-black mb-4">
          Define Fields for Category
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name
            </label>
            <input
              type="text"
              value={currentField.name}
              onChange={(e) =>
                setCurrentField({ ...currentField, name: e.target.value })
              }
              className="input-field"
              placeholder="e.g., Brand, Size, Quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Type
            </label>
            <select
              value={currentField.field_type}
              onChange={(e) =>
                setCurrentField({
                  ...currentField,
                  field_type: e.target.value as FieldType,
                })
              }
              className="input-field"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Yes/No</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center">
          <input
            type="checkbox"
            checked={currentField.required}
            onChange={(e) =>
              setCurrentField({ ...currentField, required: e.target.checked })
            }
            className="w-4 h-4 text-bee-yellow bg-gray-100 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Required field</label>
        </div>

        <Button type="button" onClick={addField} size="sm" className="mt-3">
          Add Field
        </Button>
      </div>

      {/* Field List */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Fields ({fields.length})
        </h4>
        {fields.length === 0 ? (
          <p className="text-sm text-gray-500">No fields added yet</p>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <span className="font-medium">{field.name}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    ({field.field_type})
                  </span>
                  {field.required && (
                    <span className="text-xs text-red-600 ml-2">Required</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="primary" onClick={handleSubmit}>
          Create Category
        </Button>
      </div>
    </div>
  )
}

export default SchemaBuilder
