import { DiagnosticState } from '../../services/types'
import TestResultCard from './TestResultCard'

interface TestResultsProps {
  state: DiagnosticState
}

const TestResults: React.FC<TestResultsProps> = ({ state }) => {
  const hasResults =
    (state.xray_available && state.xray_result) ||
    (state.spirometry_available && state.spirometry_result) ||
    (state.cbc_available && state.cbc_result)

  if (!hasResults) {
    return null
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Results</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {state.xray_available && state.xray_result && (
          <TestResultCard testType="xray" result={state.xray_result} state={state} />
        )}
        {state.spirometry_available && state.spirometry_result && (
          <TestResultCard
            testType="spirometry"
            result={state.spirometry_result}
            state={state}
          />
        )}
        {state.cbc_available && state.cbc_result && (
          <TestResultCard testType="cbc" result={state.cbc_result} state={state} />
        )}
      </div>
    </div>
  )
}

export default TestResults

