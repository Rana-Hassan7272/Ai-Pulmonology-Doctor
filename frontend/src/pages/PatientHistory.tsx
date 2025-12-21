import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

interface Visit {
  id: number
  visit_id: string
  symptoms: string
  created_at: string
  diagnosis?: {
    diagnosis: string
    treatment_plan: string | string[]  // Can be JSON string or array
    followup_instruction: string
  }
}

const PatientHistory = () => {
  const { user } = useAuth()
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)

  useEffect(() => {
    if (user?.patient_id) {
      fetchVisits()
    }
  }, [user])

  const fetchVisits = async () => {
    if (!user?.patient_id) return

    setLoading(true)
    try {
      const response = await api.get(`/visits/by_patient/${user.patient_id}`)
      setVisits(response.data || [])
    } catch (error: any) {
      toast.error('Failed to load visit history')
      console.error('Error fetching visits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visit History</h1>
        <p className="text-gray-600">
          View your previous diagnostic sessions and medical history
        </p>
      </div>

      {visits.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-600 text-lg">No previous visits found</p>
          <p className="text-gray-500 mt-2">Start a new diagnostic session to create your first visit</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Visits List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Visits</h2>
            {visits.map((visit) => (
              <div
                key={visit.id}
                className={`card cursor-pointer transition-all ${
                  selectedVisit?.id === visit.id
                    ? 'border-2 border-primary-500 bg-primary-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedVisit(visit)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Visit #{visit.id}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(visit.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {visit.symptoms || 'No symptoms recorded'}
                </p>
                {visit.diagnosis && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Diagnosis: </span>
                    <span className="text-xs font-medium text-gray-700">
                      {visit.diagnosis.diagnosis}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Visit Details */}
          <div>
            {selectedVisit ? (
              <div className="card sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Visit Details</h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Visit ID:</span>
                    <p className="text-gray-900 font-mono text-sm">{selectedVisit.visit_id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Date:</span>
                    <p className="text-gray-900">
                      {new Date(selectedVisit.created_at).toLocaleString()}
                    </p>
                  </div>
                  {selectedVisit.symptoms && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Symptoms:</span>
                      <p className="text-gray-900">{selectedVisit.symptoms}</p>
                    </div>
                  )}
                  {selectedVisit.diagnosis && (
                    <>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Diagnosis:</span>
                        <p className="text-gray-900">{selectedVisit.diagnosis.diagnosis}</p>
                      </div>
                      {selectedVisit.diagnosis.treatment_plan && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Treatment Plan:</span>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            {(() => {
                              const treatmentPlan = typeof selectedVisit.diagnosis.treatment_plan === 'string'
                                ? JSON.parse(selectedVisit.diagnosis.treatment_plan) as string[]
                                : selectedVisit.diagnosis.treatment_plan
                              return treatmentPlan.map(
                                (treatment: string, index: number) => (
                                  <li key={index} className="text-gray-900">
                                    {treatment}
                                  </li>
                                )
                              )
                            })()}
                          </ul>
                        </div>
                      )}
                      {selectedVisit.diagnosis.followup_instruction && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Follow-up Instructions:
                          </span>
                          <p className="text-gray-900">
                            {selectedVisit.diagnosis.followup_instruction}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-500">Select a visit to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientHistory

