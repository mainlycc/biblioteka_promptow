import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react"
import { getBlogPostBySlug, getRelatedBlogPosts, getAllPostSlugs } from "@/lib/blog"
import { BlogPostError } from "@/components/blog-error"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ArticleSchema, BreadcrumbSchema } from "@/components/json-ld-schema"
import { serialize } from 'next-mdx-remote/serialize'
import { MDXContent } from '@/components/mdx-content'
import { ScrollToTop } from '@/components/scroll-to-top'

const resolveFeaturedImageUrl = (featuredImage?: string | null) => {
  if (!featuredImage) return null
  if (featuredImage.startsWith('http')) return featuredImage

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return null

  const normalizedPath = featuredImage.replace(/^\/+/, '')
  return `${supabaseUrl}/storage/v1/object/public/${normalizedPath}`
}

/**
 * Dodaje timeout protection do operacji asynchronicznej
 * @param promise Promise do wykonania
 * @param timeoutMs Timeout w milisekundach (domyślnie 10 sekund)
 * @returns Promise z timeout protection
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operacja przekroczyła limit czasu (${timeoutMs}ms)`))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise])
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Używamy ISR (Incremental Static Regeneration) - revalidacja co godzinę
// UWAGA: Usunięto dynamic = 'force-dynamic' bo konfliktuje z revalidate
// force-dynamic wyłącza cache, więc revalidate jest ignorowany
export const revalidate = 3600 // Revalidacja co godzinę - strona będzie cache'owana przez godzinę

// Generowanie statycznych ścieżek (SSG) dla postów z bazy danych
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    // Pobierz post z timeout protection (10 sekund) dla generateMetadata
    const post = await withTimeout(getBlogPostBySlug(slug), 10000)
    const featuredImageUrl = resolveFeaturedImageUrl(post?.featured_image)
    
    if (!post) {
      return {
        title: "Artykuł nie znaleziony - Biblioteka Promptów",
        description: "Przepraszamy, ale artykuł, którego szukasz, nie istnieje.",
      }
    }

    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      keywords: post.tags,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt || "",
        url: `https://bibliotekapromptow.pl/blog/${post.slug}`,
        type: "article",
        images: featuredImageUrl ? [featuredImageUrl] : undefined,
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt || "",
        images: featuredImageUrl ? [featuredImageUrl] : undefined,
        card: "summary_large_image",
      },
      alternates: {
        canonical: `https://bibliotekapromptow.pl/blog/${post.slug}`,
      },
    }
  } catch (error) {
    // Zawsze zwracaj poprawny obiekt Metadata, nawet w przypadku błędu
    // To zapobiega błędom 5xx podczas generowania metadanych
    console.error('Błąd podczas generowania metadanych:', error)
    return {
      title: "Artykuł - Biblioteka Promptów",
      description: "Przeczytaj artykuł na naszej stronie.",
      robots: {
        index: true,
        follow: true,
      },
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post: any = null
  let relatedPosts: any[] = []
  let error: string | null = null

  console.log('📄 BlogPostPage - otrzymany slug:', {
    slug,
    slugEncoded: encodeURIComponent(slug),
    slugDecoded: decodeURIComponent(slug),
    slugLength: slug.length
  })

  try {
    // Pobierz post z timeout protection (15 sekund)
    try {
      post = await withTimeout(getBlogPostBySlug(slug), 15000)
    } catch (fetchError) {
      // Jeśli błąd podczas pobierania, loguj ale nie rzucaj błędu dalej
      console.error('⚠️ Błąd podczas pobierania posta (może być problem z bazą):', fetchError)
      post = null
    }
    
    if (!post) {
      console.log('❌ BlogPostPage - post nie znaleziony dla slug:', slug)
      notFound()
    }

    // Pobierz powiązane posty - nie blokuj renderowania jeśli się nie powiedzie
    // Używamy timeout 8 sekund - krótszy timeout, bo to dodatkowa funkcjonalność
    try {
      relatedPosts = await withTimeout(
        getRelatedBlogPosts(post.id, post.category, post.tags || [], 2),
        8000
      )
    } catch (relatedError) {
      console.error('⚠️ Błąd podczas pobierania powiązanych postów (kontynuowanie bez nich):', relatedError)
      // Nie ustawiamy error - kontynuujemy renderowanie bez powiązanych postów
      relatedPosts = []
    }
    
  } catch (err) {
    console.error('Błąd podczas pobierania posta bloga:', err)
    error = 'Nie udało się załadować artykułu'
  }

  if (error) {
    return <BlogPostError />
  }

  if (!post) {
    notFound()
  }

  const featuredImageUrl = resolveFeaturedImageUrl(post.featured_image)

  // Zserializuj zawartość MDX w Server Component z obsługą błędów i timeout
  let mdxSource: any = null
  let mdxError: Error | null = null
  
  try {
    // Serializacja MDX z timeout protection (12 sekund)
    mdxSource = await withTimeout(
      serialize(post.content, {
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
      }),
      12000
    )
  } catch (serializeErr: any) {
    console.error('❌ Błąd podczas serializacji MDX:', serializeErr)
    mdxError = serializeErr instanceof Error ? serializeErr : new Error(String(serializeErr))
    // Nie rzucamy błędu - kontynuujemy z fallback
  }

  // Przygotuj bezpieczne dane dla schematów JSON-LD
  const safeArticleData = {
    title: post.title || "Artykuł",
    excerpt: post.excerpt || "",
    slug: post.slug || "",
    author: post.author || "Autor",
    published_at: post.published_at || new Date().toISOString(),
    updated_at: post.updated_at || post.published_at || new Date().toISOString(),
    category: post.category || "",
    tags: Array.isArray(post.tags) ? post.tags : [],
    content: post.content || "",
    read_time: post.read_time || 1,
    image_url: featuredImageUrl || undefined
  }

  return (
    <>
      {safeArticleData.slug && <ArticleSchema article={safeArticleData} />}
      <BreadcrumbSchema 
        items={[
          { name: "Strona główna", url: "https://bibliotekapromptow.pl" },
          { name: "Blog", url: "https://bibliotekapromptow.pl/blog" },
          { name: safeArticleData.title, url: `https://bibliotekapromptow.pl/blog/${safeArticleData.slug}` }
        ]} 
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Powrót do bloga
          </Link>
        </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="text-sm text-muted-foreground">•</span>
              <Badge variant="outline" className="text-xs">
                {post.tags[0]}
              </Badge>
            </>
          )}
          <span className="text-sm text-muted-foreground">•</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {post.published_at 
                ? new Date(post.published_at).toLocaleDateString('pl-PL')
                : 'Brak daty'}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">•</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{post.read_time || 1} min czytania</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-black">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Udostępnij
          </Button>
        </div>
      </div>

      {featuredImageUrl && (
        <Card className="mb-10 overflow-hidden border bg-muted/30">
          <AspectRatio ratio={16 / 9}>
            <img
              src={featuredImageUrl}
              alt={post.featured_image_alt || `Ilustracja artykułu ${post.title}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </AspectRatio>
        </Card>
      )}

      {/* Article Content */}
      <article className="blog-content">
        {mdxError ? (
          // Fallback gdy serializacja MDX się nie powiedzie - wyświetl jako HTML/plain text
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : mdxSource ? (
          <MDXContent source={mdxSource} />
        ) : (
          // Ostateczny fallback - plain text
          <div className="prose prose-lg max-w-none whitespace-pre-wrap">
            {post.content}
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-xl font-bold mb-4 text-black">Powiązane artykuły</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPosts.map((relatedPost) => (
              <Link 
                key={relatedPost.id} 
                href={`/blog/${relatedPost.slug}`} 
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold mb-2">{relatedPost.title}</h4>
                <p className="text-sm text-muted-foreground">{relatedPost.excerpt}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {relatedPost.category}
                  </Badge>
                  <span>•</span>
                  <span>{relatedPost.read_time} min</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
      <ScrollToTop />
    </>
  )
}
