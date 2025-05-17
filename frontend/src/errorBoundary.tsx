import React, { Component, ReactNode } from "react";
import { Icons } from "./utils";

import { UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

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

  navigate = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full flex items-center justify-center">
          <div className=" flex w-full h-full max-w-xl items-center justify-center p-6">
            <div className=" w-full bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r flex flex-col items-center justify-center from-amber-500 to-orange-600 p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-white rounded-full p-4 shadow-md">
                    <UtensilsCrossed className="h-12 w-12 text-orange-600" />
                  </div>
                </div>
                <h2 className="text-white text-2xl font-bold text-center">
                  Oops! Our recipe didn't turn out right
                </h2>
              </div>

              <div className="p-6 w-full flex-col flex items-center justify-start">
                <p className=" text-center">
                  Something went wrong while preparing this content. Our
                  developers are looking into it!
                </p>

                {Error && (
                  <div className="rounded p-3  overflow-auto  text-sm">
                    <p className="font-mono text-destructive">
                      {this?.state?.error?.message ||
                        "Unexpected error occured!"}
                    </p>
                  </div>
                )}
                <div className="flex w-full items-center justify-start mt-4 gap-3">
                  <motion.button
                    onClick={() => this.resetError()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex justify-start items-center text-sm gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-all"
                  >
                    <Icons.redo className="size-5" />
                    Try Again
                  </motion.button>

                  <motion.button
                    onClick={() => this.navigate()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex text-white text-[14px] justify-start bg-[var(--primary-color)] px-4 py-2 rounded-lg items-center gap-2 shadow-md hover:bg-opacity-90 transition-all"
                  >
                    <Icons.home className="size-5" />
                    Back to Menu
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
