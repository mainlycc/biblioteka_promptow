import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, User, Code, Image as ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PromptSchema, BreadcrumbSchema } from "@/components/json-ld-schema"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PromptActions, CopyButton } from "@/components/prompt-actions"
import { PromptIntroduction } from "@/components/prompt-introduction"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { truncateTitle, formatMetaDescription, isValidImageUrl, createImageAltText } from "@/lib/metadata-utils"

interface Prompt {
  id: string;
  title: string;
  title_pl?: string;
  description: string;
  content_pl?: string;
  introduction?: string;
  tags: string[];
  category?: string;
  author: string;
  author_id?: string;
  author_username?: string;
  author_profile_image?: string;
  type: 'text' | 'image' | 'video';
  images?: string[];
  tweet_url?: string;
  image_url?: string;
  tweet_id?: string;
  created_at: string;
  updated_at?: string;
}

type Props = {
  params: Promise<{ id: string }>
}

// Funkcja pomocnicza do pobierania promptu
async function getPrompt(id: string): Promise<Prompt | null> {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Błąd podczas pobierania promptu:', error)
      return null
    }
    
    return data as Prompt
  } catch (error) {
    console.error('Błąd podczas pobierania promptu:', error)
    return null
  }
}

// Funkcja pomocnicza do pobierania powiązanych promptów
async function getRelatedPrompts(
  currentPromptId: string,
  tags: string[],
  type: 'text' | 'image' | 'video',
  limit: number = 3
): Promise<Prompt[]> {
  try {
    const tagsArray = tags || []
    
    // Buduj zapytanie - szukamy promptów z podobnymi tagami lub tego samego typu
    let query = supabase
      .from('prompts')
      .select('*')
      .neq('id', currentPromptId)
      .limit(limit * 2) // Pobierz więcej, żeby mieć z czego wybierać

    // Jeśli są tagi, filtruj po tagach
    if (tagsArray.length > 0) {
      // Supabase zawiera operator dla tablic
      query = query.contains('tags', tagsArray)
    } else {
      // Jeśli brak tagów, szukaj po typie
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Błąd podczas pobierania powiązanych promptów:', error)
      return []
    }

    // Sortuj i ogranicz do limitu
    const related = (data || []).slice(0, limit)
    return related as Prompt[]
  } catch (error) {
    console.error('Błąd w getRelatedPrompts:', error)
    return []
  }
}

// Generowanie metadanych dla SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const prompt = await getPrompt(id)
  
  if (!prompt) {
    return {
      title: "Prompt nie znaleziony - Biblioteka Promptów",
      description: "Przepraszamy, ale prompt, którego szukasz, nie istnieje.",
    }
  }

  const rawTitle = prompt.title_pl || prompt.title
  const rawDescription = prompt.introduction || prompt.description || ""
  
  // Walidacja i formatowanie tytułu (max 60 znaków)
  const title = truncateTitle(rawTitle, " - Biblioteka Promptów")
  
  // Walidacja i formatowanie meta description (120-160 znaków)
  const description = formatMetaDescription(rawDescription)

  // Walidacja obrazów - sprawdzamy czy pierwszy obraz jest prawidłowy
  const firstImage = prompt.images && prompt.images.length > 0 && isValidImageUrl(prompt.images[0])
    ? prompt.images[0]
    : null
  const imageAlt = firstImage ? createImageAltText(rawTitle) : 'Biblioteka Promptów'

  return {
    title,
    description,
    keywords: prompt.tags,
    openGraph: {
      title,
      description,
      url: `https://bibliotekapromptow.pl/prompt/${prompt.id}`,
      type: "article",
      publishedTime: prompt.created_at,
      modifiedTime: prompt.updated_at || prompt.created_at,
      authors: [prompt.author],
      tags: prompt.tags,
      images: firstImage 
        ? [{ url: firstImage, width: 1200, height: 630, alt: imageAlt }]
        : [{ url: '/logo.png', width: 1200, height: 630, alt: 'Biblioteka Promptów' }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: firstImage ? [firstImage] : ['/logo.png'],
    },
    alternates: {
      canonical: `/prompt/${prompt.id}`,
    },
  }
}

// Generowanie statycznych parametrów dla pre-renderingu (opcjonalne - dla najczęściej odwiedzanych)
export async function generateStaticParams() {
  try {
    const { data: prompts } = await supabase
      .from('prompts')
      .select('id')
      .limit(100) // Pre-renderuj 100 najpopularniejszych promptów
    
    if (!prompts) return []
    
    return prompts.map((prompt) => ({
      id: prompt.id,
    }))
  } catch (error) {
    console.error('Błąd podczas generowania statycznych parametrów:', error)
    return []
  }
}

// Dynamiczny rendering dla pozostałych promptów
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Rewalidacja co godzinę

export default async function Page({ params }: Props) {
  const { id } = await params
  const prompt = await getPrompt(id)

  if (!prompt) {
    notFound()
  }

  // Pobierz powiązane prompty (nie blokuj renderowania jeśli się nie powiedzie)
  let relatedPrompts: Prompt[] = []
  try {
    relatedPrompts = await getRelatedPrompts(prompt.id, prompt.tags || [], prompt.type, 3)
  } catch (error) {
    console.error('⚠️ Błąd podczas pobierania powiązanych promptów (kontynuowanie bez nich):', error)
    relatedPrompts = []
  }

  return (
    <>
      {prompt && (
        <>
          <PromptSchema prompt={prompt} />
          <BreadcrumbSchema 
            items={[
              { name: "Strona główna", url: "https://bibliotekapromptow.pl" },
              { name: "Biblioteka", url: "https://bibliotekapromptow.pl" },
              { name: prompt.title, url: `https://bibliotekapromptow.pl/prompt/${prompt.id}` }
            ]} 
          />
        </>
      )}
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Biblioteka", href: "/" },
            { label: prompt.title }
          ]} 
        />

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{prompt.title}</h1>
            </div>
            <PromptActions prompt={prompt} />
          </div>

          {/* Meta info */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {prompt.author_profile_image ? (
                <Image
                  src={prompt.author_profile_image}
                  alt={prompt.author}
                  width={20}
                  height={20}
                  className="rounded-full object-cover border"
                />
              ) : (
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-orange-100 text-orange-800">
                    {prompt.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              <span>{prompt.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(prompt.created_at).toLocaleDateString("pl-PL")}</span>
            </div>
          </div>
        </div>

        {/* Zdjęcia dla promptów graficznych */}
        {prompt.type === 'image' && prompt.images && prompt.images.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="h-4 w-4" />
              <span className="font-medium">Zdjęcia:</span>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="grid w-full max-w-2xl aspect-square gap-2" style={{
                gridTemplateColumns: (prompt.images?.length || 0) === 1 ? '1fr' : '1fr 1fr',
                gridTemplateRows: (prompt.images?.length || 0) === 1 ? '1fr' : (prompt.images?.length || 0) <= 2 ? '1fr' : '1fr 1fr'
              }}>
                {prompt.images
                  ?.filter((imageUrl) => isValidImageUrl(imageUrl))
                  .map((imageUrl, index) => {
                    const displayTitle = prompt.title_pl || prompt.title || "Prompt"
                    const altText = createImageAltText(displayTitle, index)
                    
                    return (
                      <Image
                        key={index}
                        src={imageUrl}
                        alt={altText}
                        width={800}
                        height={800}
                        className="w-full h-full object-cover rounded-xl border shadow-sm"
                        style={{
                          gridColumn: (prompt.images?.length || 0) === 1 ? '1 / -1' : 'span 1',
                          gridRow: (prompt.images?.length || 0) === 1 ? '1 / -1' : (prompt.images?.length || 0) <= 2 ? '1 / -1' : index < 2 ? '1' : '2'
                        }}
                        loading="lazy"
                        onError={(e) => {
                          // Ukryj zepsuty obraz - dla Next.js Image używamy inline style
                          const target = e.currentTarget as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    )
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Category */}
        {prompt.category && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Kategoria:</span>
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200">
                {prompt.category}
              </Badge>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag: string, i: number) => (
              <Badge key={i} variant="outline" className="hover:bg-orange-100 hover:border-orange-300">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Introduction - najpierw wstęp */}
            {prompt.introduction && (
              <PromptIntroduction introduction={prompt.introduction} />
            )}

            {/* Full prompt - potem pełny prompt */}
            <div className="mb-8">
              <Card className="border-2 border-orange-200 bg-orange-50/30 shadow-md">
                <CardHeader className="bg-orange-100/50 border-b border-orange-200">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Code className="h-5 w-5" />
                    Pełny prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 shadow-sm">
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-gray-800">
                      {prompt.description}
                    </pre>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <CopyButton prompt={prompt} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:block">
            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle>Szybkie akcje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/" className="block">
                  <Button className="w-full justify-start" variant="ghost">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Powrót do biblioteki
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Powiązane prompty */}
        {relatedPrompts.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Powiązane prompty</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPrompts.map((relatedPrompt) => (
                <Link 
                  key={relatedPrompt.id} 
                  href={`/prompt/${relatedPrompt.id}`}
                  className="block"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">
                        {relatedPrompt.title_pl || relatedPrompt.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {relatedPrompt.introduction || relatedPrompt.description.substring(0, 150)}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {relatedPrompt.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
