import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Caught by ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">Something went wrong</p>
          <p className="text-sm text-gray-500 mb-4">Try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary