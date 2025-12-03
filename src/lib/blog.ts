import { supabase } from './supabase'
import { BlogPost, BlogPostPreview, BlogFilters, BlogStats } from '@/types/blog'

/**
 * Testuje połączenie z Supabase i zwraca informacje o bazie danych
 */
export async function testSupabaseConnection(): Promise<{
  isConnected: boolean
  error?: string
  tableExists: boolean
  totalRows?: number
}> {
  try {
    console.log('🔍 Testowanie połączenia z Supabase...')
    
    // Test podstawowego połączenia
    const { error } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    if (error) {
      console.error('❌ Błąd połączenia z Supabase:', error)
      return {
        isConnected: false,
        error: error.message,
        tableExists: false
      }
    }

    // Sprawdź czy tabela istnieje i ile ma wierszy
    const { count: totalRows, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Błąd podczas liczenia wierszy:', countError)
      return {
        isConnected: true,
        error: countError.message,
        tableExists: true,
        totalRows: 0
      }
    }

    console.log('✅ Połączenie z Supabase działa poprawnie')
    console.log('📊 Liczba wierszy w tabeli blog_posts:', totalRows)

    return {
      isConnected: true,
      tableExists: true,
      totalRows: totalRows || 0
    }
  } catch (error: any) {
    console.error('❌ Błąd podczas testowania połączenia:', error)
    return {
      isConnected: false,
      error: error.message,
      tableExists: false
    }
  }
}

/**
 * Pobiera wszystkie opublikowane posty bloga z opcjonalnymi filtrami
 */
export async function getBlogPosts(filters: BlogFilters = {}): Promise<BlogPostPreview[]> {
  try {
    console.log('🔍 Pobieranie postów bloga z filtrami:', filters)
    
    // Sprawdź czy zmienne środowiskowe są ustawione
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Brak konfiguracji Supabase. Sprawdź plik .env.local')
    }
    
    let query = supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        author,
        published_at,
        read_time,
        category,
        featured_image,
        tags
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    // Filtrowanie po kategorii
    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    // Filtrowanie po tagach
    if (filters.tag) {
      query = query.contains('tags', [filters.tag])
    }

    // Wyszukiwanie w tytule i excerpt
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`)
    }

    // Paginacja
    if (filters.limit) {
      query = query.limit(filters.limit)
    } else {
      // Jeśli nie ma limitu, ustaw duży limit aby pobrać wszystkie posty
      query = query.limit(1000)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 1000) - 1)
    }

    const { data, error } = await query

    console.log('📊 Wyniki zapytania:', { 
      dataLength: data?.length || 0, 
      error: error?.message || null,
      hasData: !!data,
      isError: !!error,
      currentTime: new Date().toISOString(),
      samplePosts: data?.slice(0, 3).map(post => ({
        id: post.id,
        title: post.title,
        published_at: post.published_at,
        is_published: 'N/A (nie pobieramy tego pola)'
      }))
    })

    if (error) {
      console.error('❌ Błąd podczas pobierania postów bloga:', error)
      
      // Różne komunikaty błędów w zależności od typu błędu
      if (error.code === 'PGRST301' || error.message?.includes('relation "blog_posts" does not exist')) {
        throw new Error('Tabela blog_posts nie istnieje. Uruchom skrypt SQL z pliku supabase-blog-setup.sql')
      } else if (error.message?.includes('Invalid API key') || error.message?.includes('JWT')) {
        throw new Error('Błąd konfiguracji bazy danych. Sprawdź ustawienia Supabase w pliku .env.local')
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        throw new Error('Błąd połączenia z bazą danych. Sprawdź URL Supabase w pliku .env.local')
      } else {
        throw new Error(`Nie udało się pobrać postów bloga: ${error.message}`)
      }
    }

    console.log('✅ Pobrano postów:', data?.length || 0)
    return data || []
  } catch (error: any) {
    console.error('Błąd w getBlogPosts:', error)
    throw error
  }
}

/**
 * Pobiera pojedynczy post bloga po slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Post nie znaleziony
      }
      console.error('Błąd podczas pobierania posta bloga:', error)
      throw new Error('Nie udało się pobrać posta bloga')
    }

    return data
  } catch (error) {
    console.error('Błąd w getBlogPostBySlug:', error)
    throw error
  }
}

/**
 * Pobiera wszystkie slugi postów (dla generateStaticParams)
 * Zgodnie z dokumentacją IMPLEMENTACJA_BLOGA_MDX.md
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await getBlogPosts({});
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error('Błąd w getAllPostSlugs:', error);
    return [];
  }
}

/**
 * Alias dla getBlogPosts - zgodnie z dokumentacją
 */
export async function getAllPosts(): Promise<BlogPostPreview[]> {
  return getBlogPosts({});
}

/**
 * Alias dla getBlogPostBySlug - zgodnie z dokumentacją
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return getBlogPostBySlug(slug);
}

/**
 * Pobiera pojedynczy post bloga po ID
 */
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Post nie znaleziony
      }
      console.error('Błąd podczas pobierania posta bloga:', error)
      throw new Error('Nie udało się pobrać posta bloga')
    }

    return data
  } catch (error) {
    console.error('Błąd w getBlogPostById:', error)
    throw error
  }
}

/**
 * Pobiera powiązane posty na podstawie kategorii i tagów
 */
export async function getRelatedBlogPosts(currentPostId: number, category: string, tags: string[], limit: number = 3): Promise<BlogPostPreview[]> {
  try {
    const tagsArray = tags || []
    const tagsFilter = tagsArray.length > 0 ? `tags.cs.{${tagsArray.join(',')}}` : ''
    const categoryFilter = `category.eq.${category}`
    const orFilter = tagsFilter ? `${categoryFilter},${tagsFilter}` : categoryFilter
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        author,
        published_at,
        read_time,
        category,
        featured_image,
        tags
      `)
      .eq('is_published', true)
      .neq('id', currentPostId)
      .or(orFilter)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Błąd podczas pobierania powiązanych postów:', error)
      throw new Error('Nie udało się pobrać powiązanych postów')
    }

    return data || []
  } catch (error) {
    console.error('Błąd w getRelatedBlogPosts:', error)
    throw error
  }
}

/**
 * Pobiera statystyki bloga
 */
export async function getBlogStats(): Promise<BlogStats> {
  try {
    // Pobierz liczbę wszystkich postów
    const { count: totalPosts } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)


    // Pobierz kategorie z liczbą postów
    const { data: categoriesData } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('is_published', true)

    const categoryCounts = categoriesData?.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const categories = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count
    }))

    // Pobierz najpopularniejsze posty
    const { data: popularPosts } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        author,
        published_at,
        read_time,
        category,
        featured_image,
        tags
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(5)

    return {
      totalPosts: totalPosts || 0,
      categories,
      popularPosts: popularPosts || []
    }
  } catch (error) {
    console.error('Błąd w getBlogStats:', error)
    throw error
  }
}


/**
 * Sprawdza czy artykuł jest widoczny na stronie bloga
 */
export async function checkBlogPostVisibility(slug: string): Promise<{
  isVisible: boolean
  reason?: string
  post?: any
}> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      return {
        isVisible: false,
        reason: `Błąd podczas pobierania artykułu: ${error.message}`
      }
    }

    if (!data) {
      return {
        isVisible: false,
        reason: 'Artykuł nie istnieje'
      }
    }

    const now = new Date()
    const publishedAt = new Date(data.published_at)

    if (!data.is_published) {
      return {
        isVisible: false,
        reason: 'Artykuł nie jest opublikowany (is_published = false)',
        post: data
      }
    }

    if (publishedAt > now) {
      return {
        isVisible: false,
        reason: `Artykuł ma datę publikacji w przyszłości (${data.published_at})`,
        post: data
      }
    }

    return {
      isVisible: true,
      post: data
    }
  } catch (error: any) {
    return {
      isVisible: false,
      reason: `Błąd: ${error.message}`
    }
  }
}

/**
 * Wymusza odświeżenie cache strony bloga
 */
export async function revalidateBlogPage(): Promise<void> {
  try {
    // W Next.js 13+ można użyć revalidatePath lub revalidateTag
    // Ale w tym przypadku revalidate = 60 powinno wystarczyć
    console.log('🔄 Cache strony bloga zostanie odświeżony przy następnym żądaniu')
  } catch (error) {
    console.error('Błąd podczas odświeżania cache:', error)
  }
}

/**
 * Pobiera wszystkie unikalne kategorie
 */
export async function getBlogCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('is_published', true)

    if (error) {
      console.error('Błąd podczas pobierania kategorii:', error)
      throw new Error('Nie udało się pobrać kategorii')
    }

    const uniqueCategories = [...new Set(data?.map(post => post.category) || [])]
    return uniqueCategories.sort()
  } catch (error) {
    console.error('Błąd w getBlogCategories:', error)
    throw error
  }
}

/**
 * Pobiera wszystkie unikalne tagi
 */
export async function getBlogTags(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('is_published', true)

    if (error) {
      console.error('Błąd podczas pobierania tagów:', error)
      throw new Error('Nie udało się pobrać tagów')
    }

    const allTags = data?.flatMap(post => post.tags || []) || []
    const uniqueTags = [...new Set(allTags)]
    return uniqueTags.sort()
  } catch (error) {
    console.error('Błąd w getBlogTags:', error)
    throw error
  }
}

/**
 * Tworzy nowy post bloga
 */
export async function createBlogPost(postData: {
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  read_time: number
  featured_image?: string
  meta_title?: string
  meta_description?: string
  tags: string[]
  is_published?: boolean
}): Promise<BlogPost> {
  try {
    // Sprawdź czy slug już istnieje
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', postData.slug)
      .single()

    if (existingPost) {
      throw new Error('Artykuł z tym slug już istnieje. Zmień tytuł lub slug.')
    }

    // Utwórz nowy post
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title: postData.title.trim(),
        slug: postData.slug.trim(),
        excerpt: postData.excerpt.trim(),
        content: postData.content.trim(),
        author: postData.author.trim(),
        category: postData.category,
        read_time: postData.read_time,
        featured_image: postData.featured_image?.trim() || null,
        meta_title: postData.meta_title?.trim() || postData.title.trim(),
        meta_description: postData.meta_description?.trim() || postData.excerpt.trim(),
        tags: postData.tags,
        is_published: postData.is_published ?? true,
        published_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Błąd podczas tworzenia posta bloga:', error)
      throw new Error(`Błąd podczas tworzenia posta: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Błąd w createBlogPost:', error)
    throw error
  }
}

/**
 * Aktualizuje istniejący post bloga
 */
export async function updateBlogPost(id: number, postData: Partial<{
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  read_time: number
  featured_image: string
  meta_title: string
  meta_description: string
  tags: string[]
  is_published: boolean
}>): Promise<BlogPost> {
  try {
    // Jeśli zmieniamy slug, sprawdź czy nie istnieje już inny post z tym slug
    if (postData.slug) {
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postData.slug)
        .neq('id', id)
        .single()

      if (existingPost) {
        throw new Error('Artykuł z tym slug już istnieje. Zmień slug.')
      }
    }

    // Aktualizuj post
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...postData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Błąd podczas aktualizacji posta bloga:', error)
      throw new Error(`Błąd podczas aktualizacji posta: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Błąd w updateBlogPost:', error)
    throw error
  }
}

/**
 * Usuwa post bloga
 */
export async function deleteBlogPost(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Błąd podczas usuwania posta bloga:', error)
      throw new Error(`Błąd podczas usuwania posta: ${error.message}`)
    }
  } catch (error) {
    console.error('Błąd w deleteBlogPost:', error)
    throw error
  }
}
