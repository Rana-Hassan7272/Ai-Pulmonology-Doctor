import { useState } from 'react'
import { DiagnosticState } from '../../services/types'

interface TreatmentApprovalProps {
  state: DiagnosticState
  onApprove: () => void
  onReject: (modifications: string) => void
  onQuestion: (question: string) => void
  onClose?: () => void
}

const TreatmentApproval: React.FC<TreatmentApprovalProps> = ({
  state,
  onApprove,
  onReject,
  onQuestion,
  onClose,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [modifications, setModifications] = useState('')
  const [question, setQuestion] = useState('')

  const handleApprove = () => {
    onApprove()
    if (onClose) onClose()
  }

  const handleReject = () => {
    if (modifications.trim()) {
      onReject(modifications)
      setModifications('')
      setShowRejectForm(false)
      if (onClose) onClose()
    }
  }

  const handleQuestion = () => {
    if (question.trim()) {
      onQuestion(question)
      setQuestion('')
      setShowQuestionForm(false)
    }
  }

  if (!state.treatment_plan || state.treatment_plan.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-medical-600 text-white px-6 py-4 rounded-t-lg">
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
              Review & Approve Treatment Plan
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
            Please review the treatment plan below. You can approve it, ask questions, or request
            modifications.
          </p>

          {state.diagnosis && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Diagnosis</h3>
              <p className="text-gray-800">{state.diagnosis}</p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Treatment Plan</h3>
            <div className="space-y-2">
              {state.treatment_plan.map((treatment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-medical-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <p className="text-gray-800 flex-1">{treatment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Question Form */}
          {showQuestionForm && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to know?
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about medications, dosages, side effects, etc..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleQuestion}
                  disabled={!question.trim()}
                  className="btn-primary text-sm disabled:opacity-50"
                >
                  Ask Question
                </button>
                <button
                  onClick={() => {
                    setShowQuestionForm(false)
                    setQuestion('')
                  }}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What modifications would you like?
              </label>
              <textarea
                value={modifications}
                onChange={(e) => setModifications(e.target.value)}
                placeholder="Describe the changes you'd like to make..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleReject}
                  disabled={!modifications.trim()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                >
                  Submit Modifications
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false)
                    setModifications('')
                  }}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showQuestionForm && !showRejectForm && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApprove}
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
                Approve Treatment Plan
              </button>
              <button
                onClick={() => setShowQuestionForm(true)}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Ask Question
              </button>
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Request Modification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TreatmentApproval

