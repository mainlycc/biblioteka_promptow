import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { getAllPosts } from '@/lib/blog'
import { getMDXPosts } from '@/lib/mdx-posts'
import { CATEGORIES } from '@/lib/category-mapper'
import { categoryToSlug } from '@/lib/category-utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bibliotekapromptow.pl'
  
  // Statyczne strony
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/prompts-graficzne`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/prompty`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Podstrony kategorii promptów
    ...CATEGORIES.map((category) => ({
      url: `${baseUrl}/prompty/${categoryToSlug(category)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/polityka-prywatnosci`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/regulamin`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Pobierz prompty z Supabase
  let promptPages: MetadataRoute.Sitemap = []
  try {
    const { data: prompts } = await supabase
      .from('prompts')
      .select('id, created_at, updated_at')
      .order('created_at', { ascending: false })
    
    if (prompts) {
      promptPages = prompts.map((prompt) => ({
        url: `${baseUrl}/prompt/${prompt.id}`,
        lastModified: new Date(prompt.updated_at || prompt.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Błąd podczas pobierania promptów dla sitemap:', error)
  }

  // Pobierz posty blogowe z Supabase i pliki MDX
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const [supabasePosts, mdxPosts] = await Promise.all([
      getAllPosts().catch(() => []),
      getMDXPosts().catch(() => []),
    ])

    // Posty z Supabase
    const supabaseBlogPages = supabasePosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Posty MDX
    const mdxBlogPages = mdxPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    blogPages = [...supabaseBlogPages, ...mdxBlogPages]
  } catch (error) {
    console.error('Błąd podczas pobierania postów blogowych dla sitemap:', error)
  }

  // Połącz wszystkie strony
  return [...staticPages, ...promptPages, ...blogPages]
}


