import React, { Component, ReactNode } from "react";
import { Image } from "./helpers";
import Img from "@/assets/error.webp";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Optional: Send the error to a logging service like Sentry or Firebase
  }

  resetError = () => {
    window.location.reload();
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-100 dark:bg-gray-800 p-10 rounded-lg">
          <Image
            highResSrc={Img}
            lowResSrc={Img}
            className="h-36 w-56 object-cover rounded-lg"
          />
          <h2 className="text-xl font-semibold text-red-600">
            Something went wrong!
          </h2>
          <p className="text-[14px] text-gray-600 dark:text-gray-300">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={this.resetError}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
