import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.email}
        </p>
        {user?.patient_id && (
          <p className="text-sm text-gray-500 mt-1">
            Patient ID: {user.patient_id}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Start New Diagnostic</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Begin a new diagnostic session to get AI-powered medical assistance.
            Chat with our AI assistant and get personalized diagnosis and treatment recommendations.
          </p>
          <Link to="/diagnostic" className="btn-primary inline-block">
            Start Diagnostic
          </Link>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-medical-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">View History</h2>
          </div>
          <p className="text-gray-600 mb-4">
            View your previous visits and medical history. Track your progress over time.
          </p>
          <Link to="/history" className="btn-secondary inline-block">
            View History
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

