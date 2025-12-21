import { useState } from 'react'

interface CBCFormProps {
  onSubmit: (data: CBCData) => void
  onCancel?: () => void
}

export interface CBCData {
  wbc?: number
  rbc?: number
  hemoglobin?: number
  hematocrit?: number
  platelets?: number
  mcv?: number
  mch?: number
  mchc?: number
}

const CBCForm: React.FC<CBCFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CBCData>({})

  const handleChange = (field: keyof CBCData, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value)
    setFormData((prev) => ({ ...prev, [field]: numValue }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WBC (10³/µL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.wbc || ''}
              onChange={(e) => handleChange('wbc', e.target.value)}
              className="input-field"
              placeholder="e.g., 7.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RBC (10⁶/µL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.rbc || ''}
              onChange={(e) => handleChange('rbc', e.target.value)}
              className="input-field"
              placeholder="e.g., 4.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hemoglobin (g/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.hemoglobin || ''}
              onChange={(e) => handleChange('hemoglobin', e.target.value)}
              className="input-field"
              placeholder="e.g., 14.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hematocrit (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.hematocrit || ''}
              onChange={(e) => handleChange('hematocrit', e.target.value)}
              className="input-field"
              placeholder="e.g., 42.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platelets (10³/µL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.platelets || ''}
              onChange={(e) => handleChange('platelets', e.target.value)}
              className="input-field"
              placeholder="e.g., 250"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MCV (fL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.mcv || ''}
              onChange={(e) => handleChange('mcv', e.target.value)}
              className="input-field"
              placeholder="e.g., 90"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MCH (pg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.mch || ''}
              onChange={(e) => handleChange('mch', e.target.value)}
              className="input-field"
              placeholder="e.g., 30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MCHC (g/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.mchc || ''}
              onChange={(e) => handleChange('mchc', e.target.value)}
              className="input-field"
              placeholder="e.g., 33"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex-1">
            Submit Results
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default CBCForm

