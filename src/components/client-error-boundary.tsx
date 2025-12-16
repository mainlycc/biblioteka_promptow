'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ClientErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ClientErrorBoundaryProps {
  children: ReactNode
}

/**
 * ErrorBoundary dla użycia w Server Components.
 * Jest to komponent kliencki, który przechwytuje błędy React.
 */
export class ClientErrorBoundary extends Component<ClientErrorBoundaryProps, ClientErrorBoundaryState> {
  constructor(props: ClientErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ClientErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ClientErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
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

