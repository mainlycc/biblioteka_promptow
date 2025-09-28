import { getBlogPosts } from "@/lib/blog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Eye, EyeOff, Calendar, User } from "lucide-react"
import { revalidateBlogPage } from "@/lib/blog"

export const revalidate = 0 // Zawsze odświeżaj tę stronę

export default async function BlogDebugPage() {
  let allPosts: any[] = []
  let publishedPosts: any[] = []
  let error: string | null = null

  try {
    // Pobierz wszystkie posty (bez filtrowania)
    const { data: allData, error: allError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (allError) {
      throw new Error(`Błąd podczas pobierania wszystkich postów: ${allError.message}`)
    }

    allPosts = allData || []

    // Pobierz opublikowane posty (z filtrowaniem)
    publishedPosts = await getBlogPosts({})

  } catch (err: any) {
    console.error('Błąd podczas pobierania postów:', err)
    error = err.message
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Błąd debugowania</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-black">Debug Bloga</h1>
            <p className="text-muted-foreground">
              Strona do debugowania problemów z wyświetlaniem artykułów na blogu.
            </p>
          </div>
          <form action={async () => {
            'use server'
            await revalidateBlogPage()
          }}>
            <Button type="submit" variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Odśwież cache
            </Button>
          </form>
        </div>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Wszystkie artykuły</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allPosts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Opublikowane</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedPosts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Nieopublikowane</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {allPosts.length - publishedPosts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista wszystkich artykułów */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-black">Wszystkie artykuły w bazie</h2>
        {allPosts.map((post) => {
          const isPublished = post.is_published
          const publishedAt = new Date(post.published_at)
          const now = new Date()
          const isFuture = publishedAt > now
          const isVisible = isPublished && !isFuture

          return (
            <Card key={post.id} className={isVisible ? "border-green-200" : "border-red-200"}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={isPublished ? "default" : "secondary"}>
                        {isPublished ? "Opublikowany" : "Szkic"}
                      </Badge>
                      {isFuture && (
                        <Badge variant="outline" className="text-orange-600">
                          Przyszła data
                        </Badge>
                      )}
                      <Badge variant={isVisible ? "default" : "destructive"}>
                        {isVisible ? "Widoczny" : "Ukryty"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isVisible ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">ID</div>
                    <div>{post.id}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Slug</div>
                    <div className="font-mono text-xs">{post.slug}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Data publikacji</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {publishedAt.toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Autor</div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                  </div>
                </div>
                
                {!isVisible && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-800">
                      <strong>Powód ukrycia:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {!isPublished && <li>Artykuł nie jest opublikowany (is_published = false)</li>}
                        {isFuture && <li>Data publikacji jest w przyszłości ({publishedAt.toLocaleString('pl-PL')})</li>}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Instrukcje */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Jak naprawić problemy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Artykuł nie pojawia się na stronie bloga:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Sprawdź czy <code>is_published = true</code> w Supabase</li>
            <li>Sprawdź czy <code>published_at</code> nie jest w przyszłości</li>
            <li>Odczekaj do 60 sekund (cache się odświeża co minutę)</li>
            <li>Odśwież stronę bloga (F5)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
