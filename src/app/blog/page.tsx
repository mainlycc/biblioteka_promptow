import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { BreadcrumbSchema } from "@/components/json-ld-schema"
import { getAllPosts } from "@/lib/blog"
import { getMDXPosts } from "@/lib/mdx-posts"
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
    console.log('🔍 Próba pobrania postów bloga z Supabase i plików MDX...')
    
    // Pobierz posty z obu źródeł równolegle
    const [supabasePosts, mdxPosts] = await Promise.all([
      getAllPosts().catch(() => []),
      getMDXPosts().catch(() => []),
    ]);

    console.log('📊 Pobrano postów z Supabase:', supabasePosts.length);
    console.log('📊 Pobrano postów MDX:', mdxPosts.length);
    
    // Połącz posty i posortuj według daty publikacji
    const allPosts = [
      ...supabasePosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        author: post.author,
        category: post.category,
        tags: post.tags || [],
        published_at: post.published_at,
        read_time: post.read_time,
        featured_image: post.featured_image,
        featured_image_alt: post.featured_image_alt,
        date: post.published_at,
        source: 'supabase' as const,
      })),
      ...mdxPosts.map((post) => ({
        id: `mdx-${post.slug}`,
        slug: post.slug,
        title: post.title,
        excerpt: '',
        author: 'Autor',
        category: 'MDX',
        tags: [],
        published_at: null,
        read_time: null,
        featured_image: null,
        date: null,
        source: 'mdx' as const,
      })),
    ].sort((a, b) => {
      // Sortuj według daty - najnowsze pierwsze
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });

    blogPosts = allPosts;
    
    // Jeśli jest więcej niż 12 postów, pokaż tylko pierwsze 12
    if (blogPosts.length > 12) {
      blogPosts = blogPosts.slice(0, 12);
      console.log('📝 Ograniczono do 12 postów z', allPosts.length, 'dostępnych');
    }
  } catch (err: any) {
    console.error('❌ Błąd podczas pobierania postów bloga:', err);
    error = `Nie udało się załadować postów bloga: ${err.message || 'Nieznany błąd'}`;
    blogPosts = [];
  }

  if (error) {
    return <BlogError message={error} />
  }

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: "Strona główna", url: "https://bibliotekapromptow.pl" },
          { name: "Blog", url: "https://bibliotekapromptow.pl/blog" }
        ]} 
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Blog" }
          ]} 
        />

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-black">Blog o AI i Prompt Engineering</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Porady, poradniki i najlepsze praktyki w dziedzinie prompt engineering, ChatGPT, Claude i sztucznej inteligencji. Dowiedz się, jak pisać skuteczne prompty i efektywnie korzystać z AI.
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
                  {post.tags && post.tags.length > 0 && (
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
                {post.excerpt && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  {post.read_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.read_time} min</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  {post.published_at && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.published_at).toLocaleDateString('pl-PL')}</span>
                    </div>
                  )}
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
    </>
  )
} 