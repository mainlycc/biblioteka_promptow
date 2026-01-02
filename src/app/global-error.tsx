"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Loguj błąd do zewnętrznego serwisu monitoringu (np. Sentry)
    console.error("Krytyczny błąd aplikacji:", error)
  }, [error])

  return (
    <html lang="pl">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
          <div className="max-w-2xl w-full space-y-8">
            {/* Główna sekcja błędu */}
            <div className="text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-red-600 mx-auto" />
              <h1 className="text-3xl md:text-4xl font-bold">Krytyczny błąd aplikacji</h1>
              <p className="text-lg text-muted-foreground">
                Wystąpił poważny błąd, który uniemożliwił załadowanie aplikacji.
              </p>
            </div>

            {/* Linki do głównych sekcji */}
            <Card>
              <CardHeader>
                <CardTitle>Co możesz zrobić?</CardTitle>
                <CardDescription>
                  Spróbuj odświeżyć stronę lub wróć do strony głównej:
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
              </CardContent>
            </Card>

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
      </body>
    </html>
  )
}

