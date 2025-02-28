import React from "react";


interface ErrorBoundaryProps {
  children: React.ReactNode; // Children components to be wrapped
  fallback?: React.ReactNode; // Optional custom fallback UI
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render(): React.ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return (
        fallback || (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Something went wrong.</h1>
            <p>{error && error.toString()}</p>
            <details style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
              <summary>Error Details</summary>
              <p>{errorInfo && errorInfo.componentStack}</p>
            </details>
          </div>
        )
      );
    }

    return children;
  }
}

export default ErrorBoundary;