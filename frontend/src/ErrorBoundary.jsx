import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h1>Etwas ist schiefgelaufen</h1>
          <p>{this.state.error?.message || 'Unbekannter Fehler'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
