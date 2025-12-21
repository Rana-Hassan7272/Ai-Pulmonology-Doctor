// Authentication Types
export interface UserSignup {
  email: string
  password: string
  name?: string
  age?: number
  gender?: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  patient_id: number | null
  user_id: number
}

export interface UserResponse {
  id: number
  email: string
  patient_id: number | null
}

// Diagnostic Types
export interface DiagnosticResponse {
  message: string
  current_step?: string | null
  patient_id?: number | null
  visit_id?: string | null
  emergency_flag?: boolean
  emergency_reason?: string | null
  state?: Record<string, any>
}

export interface DiagnosticState {
  patient_id?: number | null
  patient_name?: string | null
  patient_age?: number | null
  patient_gender?: string | null
  visit_id?: string | null
  symptoms?: string | null
  diagnosis?: string | null
  treatment_plan?: string[] | null
  current_step?: string | null
  next_step?: string | null  // Set by supervisor
  message?: string | null
  // Test collection
  test_collection_complete?: boolean
  tests_recommended?: string[]
  missing_tests?: string[]
  // Form flags
  show_spirometry_form_modal?: boolean
  show_cbc_form_modal?: boolean
  show_spirometry_form?: boolean
  show_cbc_form?: boolean
  // Test results
  xray_result?: any
  xray_available?: boolean
  spirometry_result?: any
  spirometry_available?: boolean
  cbc_result?: any
  cbc_available?: boolean
  // Treatment
  treatment_approved?: boolean
  calculated_dosages?: any
  final_report?: string
  // History
  visit_summary?: string
  previous_visits?: any[]
  progress_summary?: string
  [key: string]: any
}

// Message Types
export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  isThinking?: boolean  // For showing "thinking" indicator during processing
}

// Workflow Steps
export type WorkflowStep =
  | 'patient_intake'
  | 'patient_intake_awaiting_confirmation'
  | 'patient_intake_waiting_input'
  | 'emergency_detector'
  | 'supervisor'
  | 'doctor_note_generator'
  | 'test_collector'
  | 'diagnostic_controller'
  | 'rag_specialist'
  | 'rag_treatment_planner'
  | 'treatment_approval'
  | 'dosage_calculator'
  | 'report_generator'
  | 'history_saver'
  | 'followup_agent'
  | 'end'

