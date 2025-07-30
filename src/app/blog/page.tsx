import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"

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

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Jak tworzyć skuteczne prompty dla AI",
      excerpt: "Poznaj podstawowe zasady tworzenia promptów, które przynoszą najlepsze rezultaty w pracy z modelami AI.",
      author: "Zespół Biblioteki",
      date: "2024-01-15",
      readTime: "5 min",
      category: "Podstawy",
      image: "/blog-1.jpg"
    },
    {
      id: 2,
      title: "Zaawansowane techniki prompt engineering",
      excerpt: "Odkryj zaawansowane metody tworzenia promptów, które pozwolą Ci uzyskać jeszcze lepsze wyniki.",
      author: "Ekspert AI",
      date: "2024-01-10",
      readTime: "8 min",
      category: "Zaawansowane",
      image: "/blog-2.jpg"
    },
    {
      id: 3,
      title: "Najlepsze praktyki w pracy z ChatGPT",
      excerpt: "Praktyczne wskazówki i triki, które pomogą Ci efektywniej korzystać z ChatGPT w codziennej pracy.",
      author: "Zespół Biblioteki",
      date: "2024-01-05",
      readTime: "6 min",
      category: "Praktyka",
      image: "/blog-3.jpg"
    },
    {
      id: 4,
      title: "Prompt engineering w biznesie",
      excerpt: "Jak wykorzystać prompt engineering do automatyzacji procesów biznesowych i zwiększenia produktywności.",
      author: "Konsultant Biznesowy",
      date: "2024-01-01",
      readTime: "10 min",
      category: "Biznes",
      image: "/blog-4.jpg"
    }
  ]

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
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Odkryj najnowsze trendy, porady i najlepsze praktyki w dziedzinie prompt engineering i sztucznej inteligencji.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow border-[color:var(--main-orange)]">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">
                <Link 
                  href={`/blog/${post.id}`}
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
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.date).toLocaleDateString('pl-PL')}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <Link href={`/blog/${post.id}`}>
                    Czytaj więcej
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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