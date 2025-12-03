import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react"
import { getBlogPostBySlug, getRelatedBlogPosts, getAllPostSlugs } from "@/lib/blog"
import { BlogPostError } from "@/components/blog-error"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ArticleSchema, BreadcrumbSchema } from "@/components/json-ld-schema"
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'
import { ScrollToTop } from '@/components/scroll-to-top'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

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
    const post = await getBlogPostBySlug(slug)
    
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
      openGraph: {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt || "",
        url: `https://bibliotekapromptow.pl/blog/${post.slug}`,
        type: "article",
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt || "",
        card: "summary_large_image",
      },
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
    }
  } catch (error) {
    return {
      title: "Błąd - Biblioteka Promptów",
      description: "Wystąpił błąd podczas ładowania artykułu.",
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post: any = null
  let relatedPosts: any[] = []
  let error: string | null = null

  try {
    post = await getBlogPostBySlug(slug)
    
    if (!post) {
      notFound()
    }

    // Pobierz powiązane posty
    relatedPosts = await getRelatedBlogPosts(post.id, post.category, post.tags || [], 2)
    
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

  const components = useMDXComponents();

  return (
    <>
      <ArticleSchema article={post} />
      <BreadcrumbSchema 
        items={[
          { name: "Strona główna", url: "https://bibliotekapromptow.pl" },
          { name: "Blog", url: "https://bibliotekapromptow.pl/blog" },
          { name: post.title, url: `https://bibliotekapromptow.pl/blog/${post.slug}` }
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
            <span>{new Date(post.published_at).toLocaleDateString('pl-PL')}</span>
          </div>
          <span className="text-sm text-muted-foreground">•</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{post.read_time} min czytania</span>
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

      {/* Article Content */}
      <article className="blog-content">
        <MDXRemote source={post.content} components={components} />
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
