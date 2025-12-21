import { WorkflowStep } from '../../services/types'

interface ProgressIndicatorProps {
  currentStep: string | null
}

const steps: { key: WorkflowStep; label: string }[] = [
  { key: 'patient_intake', label: 'Patient Intake' },
  { key: 'emergency_detector', label: 'Emergency Check' },
  { key: 'supervisor', label: 'Orchestrating' },
  { key: 'doctor_note_generator', label: 'Clinical Notes' },
  { key: 'test_collector', label: 'Test Collection' },
  { key: 'rag_specialist', label: 'Diagnosis' },
  { key: 'treatment_approval', label: 'Treatment Review' },
  { key: 'dosage_calculator', label: 'Dosage Calculation' },
  { key: 'report_generator', label: 'Report Generation' },
  { key: 'history_saver', label: 'Saving' },
  { key: 'followup_agent', label: 'Follow-up' },
  { key: 'end', label: 'Complete' },
]

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const getCurrentStepIndex = () => {
    if (!currentStep) return -1
    // Handle special step names
    const normalizedStep = currentStep.replace(/_awaiting_confirmation|_waiting_input/g, '')
    const exactMatch = steps.findIndex((s) => s.key === currentStep)
    if (exactMatch !== -1) return exactMatch
    return steps.findIndex((s) => s.key === normalizedStep)
  }

  const currentIndex = getCurrentStepIndex()

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentIndex
          const isCompleted = currentIndex > index
          const isLast = index === steps.length - 1

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-gray-200 border-gray-300 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {/* Step Label */}
                <span
                  className={`text-xs mt-2 text-center ${
                    isActive ? 'font-semibold text-primary-600' : 'text-gray-500'
                  }`}
                  style={{ maxWidth: '80px' }}
                >
                  {step.label}
                </span>
              </div>
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressIndicator

