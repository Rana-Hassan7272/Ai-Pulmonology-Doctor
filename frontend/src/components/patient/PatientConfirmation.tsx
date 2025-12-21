import { useState } from 'react'
import { DiagnosticState } from '../../services/types'

interface PatientConfirmationProps {
  state: DiagnosticState
  onConfirm: () => void
  onReject: (corrections: string) => void
  onClose?: () => void
}

const PatientConfirmation: React.FC<PatientConfirmationProps> = ({
  state,
  onConfirm,
  onReject,
  onClose,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [corrections, setCorrections] = useState('')

  const handleConfirm = () => {
    onConfirm()
    if (onClose) onClose()
  }

  const handleReject = () => {
    if (corrections.trim()) {
      onReject(corrections)
      setCorrections('')
      setShowRejectForm(false)
      if (onClose) onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Confirm Your Information
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Please review the information we've extracted from your conversation. Is this
            correct?
          </p>

          {/* Patient Data Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid md:grid-cols-2 gap-4">
              {state.patient_name && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Name:</span>
                  <p className="text-lg text-gray-900 mt-1">{state.patient_name}</p>
                </div>
              )}
              {state.patient_age && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Age:</span>
                  <p className="text-lg text-gray-900 mt-1">{state.patient_age} years</p>
                </div>
              )}
              {state.patient_gender && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Gender:</span>
                  <p className="text-lg text-gray-900 mt-1 capitalize">
                    {state.patient_gender}
                  </p>
                </div>
              )}
              {state.patient_weight && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Weight:</span>
                  <p className="text-lg text-gray-900 mt-1">{state.patient_weight} kg</p>
                </div>
              )}
              {state.patient_smoker !== undefined && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Smoker:</span>
                  <p className="text-lg text-gray-900 mt-1">
                    {state.patient_smoker ? 'Yes' : 'No'}
                  </p>
                </div>
              )}
              {state.symptom_duration && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Symptom Duration:</span>
                  <p className="text-lg text-gray-900 mt-1">{state.symptom_duration}</p>
                </div>
              )}
              {state.patient_chronic_conditions && (
                <div className="md:col-span-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Medical History:
                  </span>
                  <p className="text-lg text-gray-900 mt-1">
                    {state.patient_chronic_conditions}
                  </p>
                </div>
              )}
              {state.symptoms && (
                <div className="md:col-span-2">
                  <span className="text-sm font-semibold text-gray-600">Symptoms:</span>
                  <p className="text-lg text-gray-900 mt-1">{state.symptoms}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reject Form */}
          {showRejectForm && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What needs to be corrected?
              </label>
              <textarea
                value={corrections}
                onChange={(e) => setCorrections(e.target.value)}
                placeholder="Please describe what information is incorrect..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 btn-primary py-3 flex items-center justify-center"
            >
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Yes, This is Correct
            </button>
            {!showRejectForm ? (
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex-1 btn-secondary py-3 flex items-center justify-center"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                No, Needs Correction
              </button>
            ) : (
              <>
                <button
                  onClick={handleReject}
                  disabled={!corrections.trim()}
                  className="flex-1 bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Corrections
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false)
                    setCorrections('')
                  }}
                  className="flex-1 btn-secondary py-3"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientConfirmation

