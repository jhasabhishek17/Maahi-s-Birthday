import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Birthday World Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#1a0508',
          color: '#f4a0b0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif'
        }}>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Pacifico, cursive', color: '#c0384a', marginBottom: '16px' }}>
            Oops! Teddy stumble ho gaya 🧸🌹
          </h1>
          <p style={{ color: '#d4a0a8', marginBottom: '24px', maxWidth: '400px' }}>
            Ek chhota sa glitch aaya, par tension mat lo! Niche button pe click karke restart karein.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg,#c0384a,#a02a3a)',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(192,56,74,0.5)'
            }}
          >
            🔄 Refresh Birthday Surprise 🌹
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
