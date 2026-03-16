import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep this for debugging; it prints in the browser console.
    console.error('UI crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>UI crashed</h1>
          <p style={{ marginBottom: 16, color: '#444' }}>
            A runtime error occurred while rendering the app. The message below should point to the exact file.
          </p>
          <pre
            style={{
              background: '#111827',
              color: '#e5e7eb',
              padding: 16,
              borderRadius: 12,
              overflow: 'auto',
              maxWidth: '100%',
            }}
          >
            {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

