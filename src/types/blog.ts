export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  author: string
  published_at: string
  updated_at: string
  read_time: number
  category: string
  featured_image: string | null
  is_published: boolean
  meta_title: string | null
  meta_description: string | null
  tags: string[]
  created_at: string
}

export interface BlogPostPreview {
  id: number
  title: string
  slug: string
  excerpt: string | null
  author: string
  published_at: string
  read_time: number
  category: string
  featured_image: string | null
  tags: string[]
}

export interface BlogFilters {
  category?: string
  tag?: string
  search?: string
  limit?: number
  offset?: number
}

export interface BlogStats {
  totalPosts: number
  categories: Array<{
    category: string
    count: number
  }>
  popularPosts: BlogPostPreview[]
}
