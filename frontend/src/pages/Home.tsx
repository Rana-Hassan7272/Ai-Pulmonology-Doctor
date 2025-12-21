import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to PulmoAI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-Powered Pulmonologist Assistant
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Get intelligent diagnostic assistance, treatment recommendations, and comprehensive
          medical reports powered by advanced AI and machine learning.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">AI-Powered Diagnosis</h3>
          <p className="text-gray-600">
            Advanced AI analyzes symptoms and medical tests to provide accurate diagnoses.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-medical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Treatment Plans</h3>
          <p className="text-gray-600">
            Get personalized treatment recommendations with dosage calculations.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
          <p className="text-gray-600">
            Track your health progress and compare visits over time.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn-primary text-lg px-8 py-3 inline-block">
            Go to Dashboard
          </Link>
        ) : (
          <div className="space-x-4">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3 inline-block">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3 inline-block">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

