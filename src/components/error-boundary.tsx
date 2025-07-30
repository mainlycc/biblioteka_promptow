'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Tutaj można dodać logowanie błędów do zewnętrznego serwisu
    // np. Sentry, LogRocket, etc.
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <h2 className="font-semibold mb-2">Wystąpił błąd</h2>
                <p className="text-sm mb-4">
                  Przepraszamy, coś poszło nie tak. Spróbuj odświeżyć stronę lub wróć do strony głównej.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={this.resetError} 
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Spróbuj ponownie
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/'} 
                    variant="outline" 
                    size="sm"
                  >
                    Strona główna
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook do obsługi błędów w komponentach funkcyjnych
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // Tutaj można dodać logowanie błędów
    // np. trackEvent('error', 'application', error.message)
  }

  return { handleError }
} 