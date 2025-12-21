import { DiagnosticState } from '../../services/types'

interface PatientDataCardProps {
  state: DiagnosticState
}

const PatientDataCard: React.FC<PatientDataCardProps> = ({ state }) => {
  const hasData =
    state.patient_name ||
    state.patient_age ||
    state.patient_gender ||
    state.patient_weight ||
    state.symptoms

  if (!hasData) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Extracted Patient Information
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        {state.patient_name && (
          <div>
            <span className="text-sm font-medium text-gray-700">Name:</span>
            <span className="ml-2 text-gray-900">{state.patient_name}</span>
          </div>
        )}
        {state.patient_age && (
          <div>
            <span className="text-sm font-medium text-gray-700">Age:</span>
            <span className="ml-2 text-gray-900">{state.patient_age} years</span>
          </div>
        )}
        {state.patient_gender && (
          <div>
            <span className="text-sm font-medium text-gray-700">Gender:</span>
            <span className="ml-2 text-gray-900 capitalize">{state.patient_gender}</span>
          </div>
        )}
        {state.patient_weight && (
          <div>
            <span className="text-sm font-medium text-gray-700">Weight:</span>
            <span className="ml-2 text-gray-900">{state.patient_weight} kg</span>
          </div>
        )}
        {state.patient_smoker !== undefined && (
          <div>
            <span className="text-sm font-medium text-gray-700">Smoker:</span>
            <span className="ml-2 text-gray-900">
              {state.patient_smoker ? 'Yes' : 'No'}
            </span>
          </div>
        )}
        {state.patient_chronic_conditions && (
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Medical History:</span>
            <span className="ml-2 text-gray-900">{state.patient_chronic_conditions}</span>
          </div>
        )}
        {state.symptoms && (
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Symptoms:</span>
            <span className="ml-2 text-gray-900">{state.symptoms}</span>
          </div>
        )}
        {state.symptom_duration && (
          <div>
            <span className="text-sm font-medium text-gray-700">Duration:</span>
            <span className="ml-2 text-gray-900">{state.symptom_duration}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientDataCard

