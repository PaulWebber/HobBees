/**
 * Dynamic Form Component - Generates form based on schema
 */
import { useForm } from 'react-hook-form'
import { CategorySchema } from '@/types/hobby'
import FieldRenderer from './FieldRenderer'
import Button from '../common/Button'

interface DynamicFormProps {
  schema: CategorySchema
  onSubmit: (data: Record<string, any>) => void
  onCancel: () => void
  defaultValues?: Record<string, any>
  isEditMode?: boolean
}

const DynamicForm = ({ 
  schema, 
  onSubmit, 
  onCancel, 
  defaultValues = {},
  isEditMode = false 
}: DynamicFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-semibold text-bee-black mb-4">
        {isEditMode ? 'Edit' : 'Add'} {schema.category_name}
      </h3>

      {schema.fields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          register={register}
          error={errors[field.name]?.message as string}
          defaultValue={defaultValues[field.name]}
        />
      ))}

      <div className="flex gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEditMode ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  )
}

export default DynamicForm
