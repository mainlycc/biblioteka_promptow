"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Save, 
  Check, 
  AlertCircle, 
  Hash, 
  User, 
  Calendar, 
  Clock,
  Image as ImageIcon,
  Sparkles,
  Eye,
  Plus,
  X
} from "lucide-react"
import { createBlogPost } from "@/lib/blog"
import { BlogContent } from "@/components/blog-content"

interface BlogPostData {
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
}

export function BlogGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [newTag, setNewTag] = useState("")
  const [previewMode, setPreviewMode] = useState(false)

  const [blogData, setBlogData] = useState<BlogPostData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Zespół Biblioteki",
    category: "Podstawy",
    read_time: 5,
    featured_image: "",
    meta_title: "",
    meta_description: "",
    tags: [],
    is_published: true
  })

  // Automatyczne generowanie slug z tytułu
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[ąćęłńóśźż]/g, (match) => {
        const map: { [key: string]: string } = {
          'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
          'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
        }
        return map[match] || match
      })
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setBlogData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      meta_title: title + " - Biblioteka Promptów"
    }))
  }

  const handleExcerptChange = (excerpt: string) => {
    setBlogData(prev => ({
      ...prev,
      excerpt,
      meta_description: excerpt
    }))
  }

  // Generowanie wstępu AI
  const handleGenerateIntro = async () => {
    if (!blogData.title && !blogData.content) {
      setMessage({ type: 'error', text: 'Wprowadź tytuł lub treść artykułu, aby wygenerować wstęp' })
      return
    }

    setIsGeneratingIntro(true)
    setMessage(null)

    try {
      const response = await fetch('/api/generate-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blogData.title,
          description: blogData.content
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setBlogData(prev => ({ ...prev, excerpt: data.introduction }))
      setMessage({ type: 'success', text: 'Wstęp został wygenerowany!' })
    } catch (error) {
      setMessage({ type: 'error', text: `Błąd podczas generowania wstępu: ${error instanceof Error ? error.message : 'Nieznany błąd'}` })
    } finally {
      setIsGeneratingIntro(false)
    }
  }

  // Generowanie tagów AI
  const handleGenerateTags = async () => {
    if (!blogData.title && !blogData.content) {
      setMessage({ type: 'error', text: 'Wprowadź tytuł lub treść artykułu, aby wygenerować tagi' })
      return
    }

    setIsGeneratingTags(true)
    setMessage(null)

    try {
      const response = await fetch('/api/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blogData.title,
          description: blogData.content
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Dodaj wygenerowane tagi do istniejących (bez duplikatów)
      const existingTags = blogData.tags || []
      const newTags = data.tags.filter((tag: string) => !existingTags.includes(tag))
      const allTags = [...existingTags, ...newTags]

      setBlogData(prev => ({ ...prev, tags: allTags }))
      setMessage({ type: 'success', text: `Wygenerowano ${newTags.length} nowych tagów!` })
    } catch (error) {
      setMessage({ type: 'error', text: `Błąd podczas generowania tagów: ${error instanceof Error ? error.message : 'Nieznany błąd'}` })
    } finally {
      setIsGeneratingTags(false)
    }
  }

  // Dodawanie tagu
  const addTag = () => {
    if (newTag.trim() && !blogData.tags.includes(newTag.trim())) {
      setBlogData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  // Usuwanie tagu
  const removeTag = (tagToRemove: string) => {
    setBlogData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Zapisywanie posta bloga
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Walidacja
      if (!blogData.title.trim()) {
        throw new Error('Tytuł jest wymagany')
      }
      if (!blogData.content.trim()) {
        throw new Error('Treść artykułu jest wymagana')
      }
      if (!blogData.slug.trim()) {
        throw new Error('Slug jest wymagany')
      }

      // Zapisz do bazy danych używając funkcji z blog.ts
      await createBlogPost({
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        author: blogData.author,
        category: blogData.category,
        read_time: blogData.read_time,
        featured_image: blogData.featured_image,
        meta_title: blogData.meta_title,
        meta_description: blogData.meta_description,
        tags: blogData.tags,
        is_published: blogData.is_published
      })

      setMessage({ type: 'success', text: 'Artykuł bloga został zapisany pomyślnie!' })
      
      // Reset formularza
      setBlogData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Zespół Biblioteki",
        category: "Podstawy",
        read_time: 5,
        featured_image: "",
        meta_title: "",
        meta_description: "",
        tags: [],
        is_published: true
      })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Nieznany błąd' })
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ["Podstawy", "Zaawansowane", "Praktyka", "Biznes", "Narzędzia", "Trendy"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-orange-600" />
        <h2 className="text-2xl font-bold">Generator Bloga</h2>
      </div>

      {/* Message */}
      {message && (
        <Alert className={`${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formularz */}
        <Card className="border-[color:var(--main-orange)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dane artykułu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tytuł */}
              <div className="space-y-2">
                <Label htmlFor="blog-title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tytuł artykułu *
                </Label>
                <Input
                  id="blog-title"
                  value={blogData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Wprowadź tytuł artykułu..."
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="blog-slug" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Slug (URL) *
                </Label>
                <Input
                  id="blog-slug"
                  value={blogData.slug}
                  onChange={(e) => setBlogData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-wersja-tytulu"
                  required
                />
              </div>

              {/* Excerpt/Wstęp */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="blog-excerpt" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Wstęp/Opis *
                  </Label>
                  <Button
                    type="button"
                    onClick={handleGenerateIntro}
                    disabled={isGeneratingIntro || (!blogData.title && !blogData.content)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isGeneratingIntro ? (
                      "Generowanie..."
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generuj AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="blog-excerpt"
                  value={blogData.excerpt}
                  onChange={(e) => handleExcerptChange(e.target.value)}
                  placeholder="Krótki opis artykułu, który pojawi się w podglądzie..."
                  rows={3}
                  required
                />
              </div>

              {/* Treść */}
              <div className="space-y-2">
                <Label htmlFor="blog-content" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Treść artykułu (Markdown) *
                </Label>
                <Textarea
                  id="blog-content"
                  value={blogData.content}
                  onChange={(e) => setBlogData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="# Wprowadzenie

Twój artykuł napisany w **Markdown**!

## Podtytuł

- Lista punktowa
- Kolejny punkt

```javascript
// Przykład kodu
function hello() {
  console.log('Hello, World!');
}
```

> **Tip**  
> To jest cytat z ważną informacją.

## Podsumowanie

Tekst podsumowujący..."
                  rows={12}
                  required
                />
              </div>

              {/* Autor i kategoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-author" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Autor
                  </Label>
                  <Input
                    id="blog-author"
                    value={blogData.author}
                    onChange={(e) => setBlogData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Wprowadź nazwę autora..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blog-category" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Kategoria
                  </Label>
                  <select
                    id="blog-category"
                    value={blogData.category}
                    onChange={(e) => setBlogData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Czas czytania i obrazek */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-read-time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Czas czytania (min)
                  </Label>
                  <Input
                    id="blog-read-time"
                    type="number"
                    value={blogData.read_time}
                    onChange={(e) => setBlogData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 5 }))}
                    min="1"
                    max="60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blog-image" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Obrazek główny
                  </Label>
                  <Input
                    id="blog-image"
                    value={blogData.featured_image}
                    onChange={(e) => setBlogData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Tagi */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Tagi
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Dodaj tag i naciśnij Enter..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addTag}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleGenerateTags}
                    disabled={isGeneratingTags || (!blogData.title && !blogData.content)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isGeneratingTags ? (
                      "Generowanie..."
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generuj AI
                      </>
                    )}
                  </Button>
                </div>
                {blogData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {blogData.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Meta dane */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Meta dane SEO</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="blog-meta-title">Meta tytuł</Label>
                  <Input
                    id="blog-meta-title"
                    value={blogData.meta_title}
                    onChange={(e) => setBlogData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="Tytuł SEO (domyślnie tytuł artykułu)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blog-meta-description">Meta opis</Label>
                  <Textarea
                    id="blog-meta-description"
                    value={blogData.meta_description}
                    onChange={(e) => setBlogData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="Opis SEO (domyślnie wstęp artykułu)"
                    rows={2}
                  />
                </div>
              </div>

              {/* Przycisk zapisu */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  "Zapisywanie..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz artykuł bloga
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Podgląd */}
        <Card className="border-[color:var(--main-orange)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Podgląd artykułu
              </CardTitle>
              <Button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                variant="outline"
                size="sm"
              >
                {previewMode ? "Ukryj podgląd" : "Pokaż podgląd"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {previewMode && blogData.content ? (
              <div className="space-y-4">
                {/* Nagłówek artykułu */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{blogData.category}</Badge>
                    {blogData.tags.length > 0 && (
                      <>
                        <span className="text-sm text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-xs">
                          {blogData.tags[0]}
                        </Badge>
                      </>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{blogData.title || "Brak tytułu"}</h1>
                  <p className="text-muted-foreground text-sm mb-2">{blogData.excerpt || "Brak opisu"}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{blogData.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{blogData.read_time} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date().toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                </div>

                {/* Treść artykułu */}
                <BlogContent content={blogData.content} />
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Wprowadź treść artykułu, aby zobaczyć podgląd</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
