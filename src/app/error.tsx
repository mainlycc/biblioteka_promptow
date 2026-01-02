"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Home, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Loguj błąd do zewnętrznego serwisu monitoringu (np. Sentry)
    console.error("Błąd aplikacji:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-2xl w-full space-y-8">
        {/* Główna sekcja błędu */}
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-orange-600 mx-auto" />
          <h1 className="text-3xl md:text-4xl font-bold">Wystąpił błąd</h1>
          <p className="text-lg text-muted-foreground">
            Przepraszamy, coś poszło nie tak podczas ładowania strony.
          </p>
        </div>

        {/* Szczegóły błędu (tylko w trybie deweloperskim) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Szczegóły błędu (tylko w trybie deweloperskim)</AlertTitle>
            <AlertDescription className="mt-2">
              <code className="text-xs">{error.message}</code>
              {error.digest && (
                <div className="mt-2">
                  <span className="text-xs">Digest: </span>
                  <code className="text-xs">{error.digest}</code>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Linki do głównych sekcji */}
        <Card>
          <CardHeader>
            <CardTitle>Co możesz zrobić?</CardTitle>
            <CardDescription>
              Spróbuj odświeżyć stronę lub wróć do jednej z głównych sekcji:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={reset} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Spróbuj ponownie
            </Button>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Strona główna
              </Button>
            </Link>
            
            <Link href="/prompty" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                Prompty tekstowe
              </Button>
            </Link>
            
            <Link href="/blog" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                Blog
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Przycisk powrotu */}
        <div className="flex justify-center gap-3">
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Odśwież stronę
          </Button>
          <Link href="/">
            <Button size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Powrót do strony głównej
            </Button>
          </Link>
        </div>

        {/* Dodatkowe informacje */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Jeśli problem nadal występuje, skontaktuj się z nami przez{" "}
            <Link href="/contact" className="text-orange-600 hover:underline">
              formularz kontaktowy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

