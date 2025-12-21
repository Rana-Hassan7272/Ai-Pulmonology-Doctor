import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { diagnosticService } from '../services/diagnostic'
import { Message, DiagnosticResponse, DiagnosticState } from '../services/types'
import ChatWindow from '../components/chat/ChatWindow'
import PatientDataCard from '../components/patient/PatientDataCard'
import PatientConfirmation from '../components/patient/PatientConfirmation'
import TestResults from '../components/tests/TestResults'
import TreatmentPlan from '../components/treatment/TreatmentPlan'
import TreatmentApproval from '../components/treatment/TreatmentApproval'
import FinalReport from '../components/report/FinalReport'
import ProgressIndicator from '../components/workflow/ProgressIndicator'
import SpirometryForm, { SpirometryData } from '../components/tests/SpirometryForm'
import CBCForm, { CBCData } from '../components/tests/CBCForm'
import toast from 'react-hot-toast'

const Diagnostic = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [visitId, setVisitId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [emergencyFlag, setEmergencyFlag] = useState(false)
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showTreatmentApproval, setShowTreatmentApproval] = useState(false)
  const [showSpirometryForm, setShowSpirometryForm] = useState(false)
  const [showCBCForm, setShowCBCForm] = useState(false)
  const [showReport, setShowReport] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Start diagnostic session on mount
  useEffect(() => {
    if (isAuthenticated) {
      startSession()
    }
  }, [isAuthenticated])

  const startSession = async () => {
    setSessionLoading(true)
    try {
      const response: DiagnosticResponse = await diagnosticService.start()
      
      if (response.visit_id) {
        setVisitId(response.visit_id)
      }

      if (response.current_step) {
        setCurrentStep(response.current_step)
      }

      if (response.emergency_flag) {
        setEmergencyFlag(true)
        toast.error('Emergency detected! Please seek immediate medical attention.')
      }

      // Update diagnostic state
      if (response.state) {
        setDiagnosticState(response.state)
      }

      // Add initial AI message
      if (response.message) {
        setMessages([
          {
            role: 'assistant',
            content: response.message,
            timestamp: new Date(),
          },
        ])
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to start diagnostic session')
      console.error('Error starting session:', error)
    } finally {
      setSessionLoading(false)
    }
  }

  const handleSend = async (message: string, file?: File) => {
    if (!visitId) {
      toast.error('Session not initialized. Please refresh the page.')
      return
    }

    // Add user message immediately
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Add thinking indicator
    const thinkingMessage: Message = {
      role: 'assistant',
      content: 'Processing...',
      timestamp: new Date(),
      isThinking: true
    }
    setMessages((prev) => [...prev, thinkingMessage])

    setLoading(true)

    try {
      const response: DiagnosticResponse = await diagnosticService.chat(
        message,
        visitId,
        file
      )

      // Update state
      if (response.current_step) {
        setCurrentStep(response.current_step)
      }

      if (response.emergency_flag) {
        setEmergencyFlag(true)
        toast.error(
          response.emergency_reason ||
            'Emergency detected! Please seek immediate medical attention.'
        )
      }

      // Update diagnostic state
      if (response.state) {
        setDiagnosticState(response.state)
        
        // Check if we need to show confirmation modal
        const needsConfirmation =
          response.current_step === 'patient_intake_awaiting_confirmation' ||
          (response.state.patient_data_confirmed === false &&
            response.state.patient_name &&
            !showConfirmation)
        
        if (needsConfirmation) {
          setShowConfirmation(true)
        }

        // Check if we need to show treatment approval
        // Also check for show_treatment_approval flag from backend
        const needsTreatmentApproval =
          (response.current_step === 'treatment_approval' ||
            response.current_step === 'rag_specialist_awaiting_approval' ||
            response.state.show_treatment_approval) &&
          response.state.treatment_plan &&
          response.state.treatment_plan.length > 0 &&
          !response.state.treatment_approved &&
          !showTreatmentApproval

        if (needsTreatmentApproval) {
          setShowTreatmentApproval(true)
        }

        // Check if we need to show forms as modals (sequential)
        // New backend uses show_spirometry_form_modal and show_cbc_form_modal flags
        // Priority: Show forms when backend explicitly requests them
        if (response.state.show_spirometry_form_modal && !showSpirometryForm && !showCBCForm) {
          setShowSpirometryForm(true)
        } else if (response.state.show_cbc_form_modal && !showCBCForm && !showSpirometryForm) {
          setShowCBCForm(true)
        }
        
        // Also check for direct form requests in message
        const messageLower = response.message?.toLowerCase() || ''
        if (messageLower.includes('spirometry form') && !showSpirometryForm && !showCBCForm) {
          setShowSpirometryForm(true)
        } else if (messageLower.includes('cbc form') && !showCBCForm && !showSpirometryForm) {
          setShowCBCForm(true)
        }

        // Check if session is complete (after treatment approval and report generation)
        // New workflow: treatment_approval → supervisor → dosage_calculator → supervisor → report_generator → supervisor → history_saver → supervisor → followup_agent → END
        // Check for final_report in state or if we're at the end of the workflow
        const isFinalStep = response.current_step === 'end' || 
            response.current_step === 'followup_agent' ||
            response.current_step === 'history_saver' ||
            response.current_step === 'report_generator'
        
        const hasFinalReport = response.state?.final_report || 
            (response.state?.treatment_approved && 
             response.state?.calculated_dosages &&
             (isFinalStep || response.current_step === 'dosage_calculator'))
        
        if (isFinalStep || hasFinalReport) {
          // Report is ready - close chat and show report
          setShowReport(true)
          setShowConfirmation(false)
          setShowTreatmentApproval(false)
          setShowSpirometryForm(false)
          setShowCBCForm(false)
        }
      }

      // Remove thinking message
      setMessages((prev) => prev.filter(msg => !msg.isThinking))

      // Add AI response
      if (response.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }

      // Check if session ended or report is ready
      const isSessionComplete = response.current_step === 'end' || 
          response.current_step === 'followup_agent' ||
          response.current_step === 'history_saver' ||
          (response.state?.final_report && response.current_step !== 'treatment_approval') ||
          response.emergency_flag
      
      if (isSessionComplete) {
        if (response.current_step === 'followup_agent' || response.current_step === 'end' || response.state?.final_report) {
          toast.success('Diagnostic session completed. Report is ready.')
        }
        setShowConfirmation(false)
        setShowTreatmentApproval(false)
        setShowSpirometryForm(false)
        setShowCBCForm(false)
        if (response.state && (response.state.final_report || response.current_step === 'end' || response.current_step === 'followup_agent')) {
          setShowReport(true)
        }
      }
      
      // After form submission, check if next form should be shown
      if (response.state) {
        // Check for next form in sequence
        if (response.state.show_spirometry_form_modal && !showSpirometryForm && !showCBCForm) {
          setShowSpirometryForm(true)
        } else if (response.state.show_cbc_form_modal && !showCBCForm && !showSpirometryForm) {
          setShowCBCForm(true)
        }

        // If patient data has been confirmed in this response (even if the user typed "yes" in chat
        // instead of using the confirmation modal buttons), ensure the confirmation modal is closed.
        if (response.state.patient_data_confirmed) {
          setShowConfirmation(false)
        }
      }
    } catch (error: any) {
      // Remove thinking message on error
      setMessages((prev) => prev.filter(msg => !msg.isThinking))
      
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to send message. Please try again.'
      
      // Check if it's a rate limit error
      if (errorMessage.toLowerCase().includes('rate limit') || 
          errorMessage.toLowerCase().includes('429') ||
          errorMessage.toLowerCase().includes('quota') ||
          errorMessage.toLowerCase().includes('processing')) {
        // Show thinking message instead of error
        const thinkingMessage: Message = {
          role: 'assistant',
          content: 'The system is processing your request. Please wait a moment...',
          timestamp: new Date(),
          isThinking: true
        }
        setMessages((prev) => [...prev, thinkingMessage])
        toast('Rate limit reached. The system is processing your request. Please wait...', { icon: '⏳' })
        
        // Retry after a delay
        setTimeout(async () => {
          try {
            setMessages((prev) => prev.filter(msg => !msg.isThinking))
            const retryResponse = await diagnosticService.chat(message, visitId, file)
            
            // Process retry response same as normal response
            if (retryResponse.current_step) {
              setCurrentStep(retryResponse.current_step)
            }
            if (retryResponse.state) {
              setDiagnosticState(retryResponse.state)
            }
            if (retryResponse.message) {
              const aiMessage: Message = {
                role: 'assistant',
                content: retryResponse.message,
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, aiMessage])
            }
          } catch (retryError: any) {
            setMessages((prev) => prev.filter(msg => !msg.isThinking))
            toast.error('Still processing. Please try again in a moment.')
          } finally {
            setLoading(false)
          }
        }, 3000)
        return
      }
      
      toast.error(errorMessage)
      console.error('Error sending message:', error)
      // Remove user message on error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Starting diagnostic session...</p>
        </div>
      </div>
    )
  }

  const handleConfirm = async () => {
    if (!visitId) return
    
    // Close confirmation modal and show thinking state in chat
    setShowConfirmation(false)

    // Add user confirmation message to chat
    const userMessage: Message = {
      role: 'user',
      content: 'Yes, that is correct',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Add thinking indicator
    const thinkingMessage: Message = {
      role: 'assistant',
      content: 'Processing...',
      timestamp: new Date(),
      isThinking: true,
    }
    setMessages((prev) => [...prev, thinkingMessage])

    setLoading(true)

    try {
      const response = await diagnosticService.chat('Yes, that is correct', visitId)
      
      // Remove thinking message
      setMessages((prev) => prev.filter((msg) => !msg.isThinking))

      if (response.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
      
      if (response.state) {
        setDiagnosticState(response.state)
        // After confirmation, never show confirmation modal again for this session
        if (response.state.patient_data_confirmed) {
          setShowConfirmation(false)
        }
      }
      
      if (response.current_step) {
        setCurrentStep(response.current_step)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to confirm. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (corrections: string) => {
    if (!visitId) return
    
    setShowConfirmation(false)
    setLoading(true)
    
    try {
      const message = corrections || 'No, that is not correct. ' + corrections
      const response = await diagnosticService.chat(message, visitId)
      
      if (response.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
      
      if (response.state) {
        setDiagnosticState(response.state)
      }
      
      if (response.current_step) {
        setCurrentStep(response.current_step)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit corrections. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTreatmentApprove = async () => {
    if (!visitId) return
    
    setShowTreatmentApproval(false)
    setLoading(true)
    
    try {
      const response = await diagnosticService.chat('approve', visitId)
      
      if (response.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
      
      if (response.state) {
        setDiagnosticState(response.state)
      }
      
      if (response.current_step) {
        setCurrentStep(response.current_step)
      }
      
      // Check if report is ready (after approval, workflow continues: dosage_calculator → report_generator → history_saver → followup_agent)
      // With supervisor, the workflow may take a moment to complete
      if (response.state?.final_report || 
          response.current_step === 'followup_agent' || 
          response.current_step === 'end' ||
          response.current_step === 'history_saver' ||
          response.current_step === 'report_generator') {
        // Report is ready
        setShowReport(true)
        setShowTreatmentApproval(false)
        setShowConfirmation(false)
        setShowSpirometryForm(false)
        setShowCBCForm(false)
        toast.success('Treatment plan approved. Final report generated.')
      } else {
        // Still processing - workflow will continue via supervisor
        toast.success('Treatment plan approved. Generating final report...')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to approve treatment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTreatmentReject = async (modifications: string) => {
    if (!visitId) return
    
    setShowTreatmentApproval(false)
    setLoading(true)
    
    try {
      const message = modifications || 'I would like to modify the treatment plan: ' + modifications
      const response = await diagnosticService.chat(message, visitId)
      
      if (response.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
      
      if (response.state) {
        setDiagnosticState(response.state)
      }
      
      if (response.current_step) {
        setCurrentStep(response.current_step)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit modifications. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTreatmentQuestion = async (question: string) => {
    if (!visitId) return
    
    setLoading(true)
    
    try {
      const response = await diagnosticService.chat(question, visitId)
      
      if (response.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
      
      if (response.state) {
        setDiagnosticState(response.state)
      }
      
      if (response.current_step) {
        setCurrentStep(response.current_step)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to send question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSpirometrySubmit = async (data: SpirometryData) => {
    if (!visitId) return
    
    setShowSpirometryForm(false)
    setLoading(true)
    
    // Format data for backend extraction
    const message = `Spirometry test results submitted: FEV1=${data.fev1}L, FVC=${data.fvc}L, FEV1/FVC=${data.fev1_fvc}%`
    
    try {
      const response = await diagnosticService.chat(message, visitId)
      
      if (response.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
      
      if (response.state) {
        setDiagnosticState(response.state)
        
        // Check if next form should be shown (CBC)
        if (response.state.show_cbc_form_modal && !showCBCForm) {
          setShowCBCForm(true)
        }
      }
      
      toast.success('Spirometry results submitted')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCBCSubmit = async (data: CBCData) => {
    if (!visitId) return
    
    setShowCBCForm(false)
    setLoading(true)
    
    // Format data for backend extraction - map to backend field names
    const fieldMapping: Record<string, string> = {
      wbc: 'WBC',
      rbc: 'RBC',
      hemoglobin: 'HGB',
      hematocrit: 'HCT',
      platelets: 'PLT',
      mcv: 'MCV',
      mch: 'MCH',
      mchc: 'MCHC',
    }
    
    const values = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${fieldMapping[key] || key}=${value}`)
      .join(', ')
    const message = `CBC test results submitted: ${values}`
    
    try {
      const response = await diagnosticService.chat(message, visitId)
      
      if (response.message) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
      
      if (response.state) {
        setDiagnosticState(response.state)
      }
      
      toast.success('CBC results submitted')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show final report if session is complete
  if (showReport && diagnosticState) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FinalReport state={diagnosticState} />
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Patient Data Card */}
      {diagnosticState && !showConfirmation && (
        <PatientDataCard state={diagnosticState} />
      )}

      {/* Test Results */}
      {diagnosticState && (
        <TestResults state={diagnosticState} />
      )}

      {/* Treatment Plan */}
      {diagnosticState && diagnosticState.treatment_plan && !showTreatmentApproval && (
        <TreatmentPlan state={diagnosticState} />
      )}

      {/* Confirmation Modal */}
      {showConfirmation && diagnosticState && (
        <PatientConfirmation
          state={diagnosticState}
          onConfirm={handleConfirm}
          onReject={handleReject}
          onClose={() => setShowConfirmation(false)}
        />
      )}

      {/* Treatment Approval Modal */}
      {showTreatmentApproval && diagnosticState && (
        <TreatmentApproval
          state={diagnosticState}
          onApprove={handleTreatmentApprove}
          onReject={handleTreatmentReject}
          onQuestion={handleTreatmentQuestion}
          onClose={() => setShowTreatmentApproval(false)}
        />
      )}

      {/* Spirometry Form Modal */}
      {showSpirometryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Spirometry Test Results</h2>
              <button
                onClick={() => setShowSpirometryForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SpirometryForm
              onSubmit={handleSpirometrySubmit}
              onCancel={() => setShowSpirometryForm(false)}
            />
          </div>
        </div>
      )}

      {/* CBC Form Modal */}
      {showCBCForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">CBC Blood Test Results</h2>
              <button
                onClick={() => setShowCBCForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CBCForm
              onSubmit={handleCBCSubmit}
              onCancel={() => setShowCBCForm(false)}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diagnostic Session</h1>
            <p className="text-gray-600 mt-1">
              {user?.email} • Patient ID: {user?.patient_id || 'N/A'}
            </p>
          </div>
          {visitId && (
            <div className="text-sm text-gray-500">
              Visit ID: <span className="font-mono">{visitId.slice(0, 8)}...</span>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        {currentStep && (
          <div className="mt-4">
            <ProgressIndicator currentStep={currentStep} />
          </div>
        )}

        {/* Emergency Alert */}
        {emergencyFlag && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-red-800 font-medium">
                Emergency Alert: Please seek immediate medical attention!
              </p>
            </div>
          </div>
        )}
      </div>


      {/* Chat Window */}
      <div className="card p-0 h-[600px] flex flex-col">
        <ChatWindow
          messages={messages}
          onSend={handleSend}
          loading={loading}
          disabled={emergencyFlag}
        />
      </div>

      {/* Session Info */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>
          Your conversation is being saved. You can close this page and return later using the
          same session.
        </p>
      </div>
    </div>
  )
}

export default Diagnostic

