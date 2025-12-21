import { DiagnosticState } from '../../services/types'

interface TestResultCardProps {
  testType: 'xray' | 'spirometry' | 'cbc'
  result: any
  state?: DiagnosticState
}

const TestResultCard: React.FC<TestResultCardProps> = ({ testType, result }) => {
  if (!result) return null

  const getTestName = () => {
    switch (testType) {
      case 'xray':
        return 'X-ray Analysis'
      case 'spirometry':
        return 'Spirometry Test'
      case 'cbc':
        return 'CBC Blood Test'
      default:
        return 'Test Result'
    }
  }

  const getStatusColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-800'
    if (confidence >= 0.8) return 'bg-green-100 text-green-800'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const renderXRayResult = () => {
    const prediction = result.prediction || {}
    const diseaseName = prediction.disease_name || 'Unknown'
    const confidence = prediction.confidence || 0

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">Finding:</span>
          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(confidence)}`}>
            {diseaseName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Confidence:</span>
          <span className="text-sm font-medium">{(confidence * 100).toFixed(1)}%</span>
        </div>
        {result.probabilities && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Probabilities:</p>
            <div className="space-y-1">
              {Object.entries(result.probabilities).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-medium">{(value * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSpirometryResult = () => {
    const prediction = result.prediction || {}
    const pattern = result.pattern || prediction.pattern || 'Unknown'
    const severity = result.severity || prediction.severity || 'Unknown'
    const confidence = result.confidence || prediction.confidence || 0

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">Pattern:</span>
          <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800 capitalize">
            {pattern}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Severity:</span>
          <span className="px-2 py-1 rounded text-sm bg-orange-100 text-orange-800 capitalize">
            {severity}
          </span>
        </div>
        {confidence > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Confidence:</span>
            <span className="text-sm font-medium">{(confidence * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>
    )
  }

  const renderCBCResult = () => {
    const prediction = result.prediction || {}
    const diseaseName = typeof prediction === 'string' ? prediction : (prediction.disease_name || 'Unknown')
    const confidence = result.confidence || prediction.confidence || 0

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">Prediction:</span>
          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(confidence)}`}>
            {diseaseName}
          </span>
        </div>
        {confidence > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Confidence:</span>
            <span className="text-sm font-medium">{(confidence * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card border-l-4 border-l-primary-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{getTestName()}</h3>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
          Completed
        </span>
      </div>
      {testType === 'xray' && renderXRayResult()}
      {testType === 'spirometry' && renderSpirometryResult()}
      {testType === 'cbc' && renderCBCResult()}
    </div>
  )
}

export default TestResultCard

