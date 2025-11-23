import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const App = React.lazy(() => import('./app'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for now
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: '#111', minHeight: '100vh' }}>
          <h2 style={{ color: '#fff' }}>An error occurred while rendering the app</h2>
          <pre style={{ color: '#f88', whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
          <p style={{ color: '#ddd' }}>Check the browser console for a full stack trace.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div style={{ color: '#fff', padding: 24 }}>Loading app...</div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
)