import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, BookOpen, Image as ImageIcon, Film, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-2xl w-full space-y-8">
        {/* Główna sekcja błędu */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-orange-600">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold">Strona nie została znaleziona</h2>
          <p className="text-lg text-muted-foreground">
            Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.
          </p>
        </div>

        {/* Linki do głównych sekcji */}
        <Card>
          <CardHeader>
            <CardTitle>Gdzie chcesz się udać?</CardTitle>
            <CardDescription>
              Oto najpopularniejsze sekcje naszej biblioteki promptów:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Strona główna
              </Button>
            </Link>
            
            <Link href="/prompty" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Prompty tekstowe
              </Button>
            </Link>
            
            <Link href="/prompts-graficzne" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ImageIcon className="h-4 w-4" />
                Prompty graficzne
              </Button>
            </Link>
            
            <Link href="/filmowe" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Film className="h-4 w-4" />
                Prompty filmowe
              </Button>
            </Link>
            
            <Link href="/blog" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Blog
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Przycisk powrotu */}
        <div className="flex justify-center">
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
            Jeśli uważasz, że to błąd, skontaktuj się z nami przez{" "}
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

