import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Settings, Database } from "lucide-react"
import Link from "next/link"

interface BlogErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function BlogError({ 
  title = "Wystąpił błąd",
  message = "Nie udało się załadować treści bloga. Spróbuj ponownie później.",
  onRetry,
  showRetry = true
}: BlogErrorProps) {
  const isConfigError = message.includes('konfiguracji') || message.includes('Supabase') || message.includes('tabela')
  const isTableError = message.includes('tabela') || message.includes('blog_posts')
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className={`${isConfigError ? 'border-orange-200 bg-orange-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 p-3 rounded-full w-fit ${isConfigError ? 'bg-orange-100' : 'bg-red-100'}`}>
            {isConfigError ? (
              isTableError ? (
                <Database className="h-8 w-8 text-orange-600" />
              ) : (
                <Settings className="h-8 w-8 text-orange-600" />
              )
            ) : (
              <AlertTriangle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className={isConfigError ? 'text-orange-800' : 'text-red-800'}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className={`mb-6 ${isConfigError ? 'text-orange-700' : 'text-red-700'}`}>
            {message}
          </p>
          
          {isConfigError && (
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <h4 className="font-semibold mb-2">Jak naprawić ten problem:</h4>
              <div className="text-sm text-left space-y-2">
                {isTableError ? (
                  <>
                    <p>1. Otwórz Supabase Dashboard</p>
                    <p>2. Przejdź do SQL Editor</p>
                    <p>3. Uruchom skrypt z pliku <code className="bg-gray-100 px-1 rounded">supabase-blog-setup.sql</code></p>
                  </>
                ) : (
                  <>
                    <p>1. Utwórz plik <code className="bg-gray-100 px-1 rounded">.env.local</code> w folderze <code className="bg-gray-100 px-1 rounded">tutaj/</code></p>
                    <p>2. Dodaj klucze Supabase z Dashboard</p>
                    <p>3. Uruchom ponownie aplikację</p>
                  </>
                )}
                <p className="mt-2">
                  <Link href="/SUPABASE_CONFIG.md" className="text-blue-600 hover:underline">
                    📖 Zobacz szczegółowe instrukcje
                  </Link>
                </p>
              </div>
            </div>
          )}
          
          {showRetry && onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className={`gap-2 ${isConfigError ? 'border-orange-300 text-orange-700 hover:bg-orange-100' : 'border-red-300 text-red-700 hover:bg-red-100'}`}
            >
              <RefreshCw className="h-4 w-4" />
              Spróbuj ponownie
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface BlogPostErrorProps {
  onRetry?: () => void
}

export function BlogPostError({ onRetry }: BlogPostErrorProps) {
  return (
    <BlogError
      title="Nie udało się załadować artykułu"
      message="Artykuł, którego szukasz, może nie istnieć lub wystąpił problem z jego załadowaniem."
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  )
}

interface BlogNotFoundErrorProps {
  onRetry?: () => void
}

export function BlogNotFoundError({ onRetry }: BlogNotFoundErrorProps) {
  return (
    <BlogError
      title="Artykuł nie został znaleziony"
      message="Przepraszamy, ale artykuł, którego szukasz, nie istnieje lub został usunięty."
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  )
}
