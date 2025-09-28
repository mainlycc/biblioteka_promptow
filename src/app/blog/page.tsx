import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { getBlogPosts, getBlogStats, testSupabaseConnection } from "@/lib/blog"
import { BlogError } from "@/components/blog-error"

// Ustawienia rewalidacji cache - strona będzie się odświeżać co 30 sekund
export const revalidate = 30

export const metadata: Metadata = {
  title: "Blog - Biblioteka Promptów",
  description: "Odkryj najnowsze trendy, porady i najlepsze praktyki w dziedzinie prompt engineering i sztucznej inteligencji. Eksperckie artykuły o AI.",
  keywords: ["blog AI", "prompt engineering", "artykuły AI", "trendy AI", "porady ChatGPT"],
  openGraph: {
    title: "Blog - Biblioteka Promptów",
    description: "Odkryj najnowsze trendy, porady i najlepsze praktyki w dziedzinie prompt engineering i sztucznej inteligencji.",
    url: "https://bibliotekapromptow.pl/blog",
    type: "website",
  },
  twitter: {
    title: "Blog - Biblioteka Promptów",
    description: "Odkryj najnowsze trendy, porady i najlepsze praktyki w dziedzinie prompt engineering i sztucznej inteligencji.",
  },
  alternates: {
    canonical: "/blog",
  },
}

export default async function BlogPage() {
  let blogPosts: any[] = []
  let error: string | null = null

  try {
    console.log('🔍 Próba pobrania postów bloga z Supabase...')
    
    // Test połączenia z Supabase
    const connectionTest = await testSupabaseConnection()
    console.log('🔗 Test połączenia:', connectionTest)
    
    if (!connectionTest.isConnected) {
      throw new Error(`Błąd połączenia z Supabase: ${connectionTest.error}`)
    }
    
    if (!connectionTest.tableExists) {
      throw new Error('Tabela blog_posts nie istnieje. Uruchom skrypt SQL z pliku supabase-blog-setup.sql')
    }
    
    // Pobierz statystyki bloga, aby zobaczyć ile postów jest w bazie
    const stats = await getBlogStats()
    console.log('📊 Statystyki bloga:', stats)
    
    // Pobierz wszystkie posty bez limitu, aby sprawdzić ile ich jest
    blogPosts = await getBlogPosts({})
    console.log('✅ Pobrano postów:', blogPosts.length, 'z', stats.totalPosts, 'dostępnych w bazie')
    
    // Jeśli jest więcej niż 12 postów, pokaż tylko pierwsze 12
    if (blogPosts.length > 12) {
      blogPosts = blogPosts.slice(0, 12)
      console.log('📝 Ograniczono do 12 postów z', blogPosts.length, 'dostępnych')
    }
  } catch (err: any) {
    console.error('❌ Błąd podczas pobierania postów bloga:', err)
    
    // Sprawdź czy to błąd konfiguracji Supabase
    if (err.message?.includes('Invalid API key') || err.message?.includes('Failed to fetch')) {
      error = 'Błąd konfiguracji bazy danych. Sprawdź ustawienia Supabase w pliku .env.local'
    } else if (err.message?.includes('relation "blog_posts" does not exist')) {
      error = 'Tabela blog_posts nie istnieje. Uruchom skrypt SQL z pliku supabase-blog-setup.sql'
    } else {
      error = `Nie udało się załadować postów bloga: ${err.message || 'Nieznany błąd'}`
    }
    blogPosts = []
  }

  if (error) {
    return <BlogError message={error} />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: "Blog" }
        ]} 
      />

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-black">Blog</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Odkryj najnowsze trendy, porady i najlepsze praktyki w dziedzinie prompt engineering i sztucznej inteligencji.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              Brak dostępnych artykułów. Sprawdź ponownie później.
            </p>
          </div>
        ) : (
          blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow border-[color:var(--main-orange)]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  {post.tags.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {post.tags[0]}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight text-black">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-[#d03801] transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.read_time} min</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.published_at).toLocaleDateString('pl-PL')}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link href={`/blog/${post.slug}`}>
                      Czytaj więcej
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Newsletter Signup */}
      <Card className="mt-12 border-[color:var(--main-orange)]">
        <CardHeader className="text-center">
          <CardTitle>Bądź na bieżąco</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Zapisz się do naszego newslettera, aby otrzymywać najnowsze artykuły i porady prosto na swoją skrzynkę.
          </p>
          <Button asChild>
            <Link href="/newsletter">
              Zapisz się do newslettera
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 