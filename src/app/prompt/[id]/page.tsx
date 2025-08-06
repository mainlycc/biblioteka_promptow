"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Copy, Share2, Check, Calendar, User, Code, Image as ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PromptSchema, BreadcrumbSchema } from "@/components/json-ld-schema"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { trackPromptCopy, trackPromptShare } from "@/components/google-analytics"

interface Prompt {
  id: string;
  title: string;
  title_pl?: string;
  description: string;
  content_pl?: string;
  introduction?: string;
  tags: string[];
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
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Funkcja do formatowania tekstu wstępu
const formatIntroductionText = (text: string): string => {
  if (!text) {
    return ''
  }
  
  // Jeśli tekst nie ma podwójnych nowych linii, podziel na pojedyncze
  let paragraphs
  if (text.includes('\n\n')) {
    paragraphs = text.split('\n\n')
  } else if (text.includes('\n')) {
    paragraphs = text.split('\n')
  } else {
    // Jeśli nie ma żadnych nowych linii, traktuj całość jako jeden akapit
    paragraphs = [text]
  }
  
  const processedParagraphs = paragraphs.map((paragraph) => {
    const trimmedParagraph = paragraph.trim()
    if (!trimmedParagraph) return ''
    
    // Sprawdź czy to nagłówek
    if (trimmedParagraph.startsWith('### ')) {
      return `<h3 class="text-xl font-bold mt-6 mb-3 text-black">${trimmedParagraph.substring(4)}</h3>`
    }
    if (trimmedParagraph.startsWith('## ')) {
      return `<h2 class="text-2xl font-bold mt-8 mb-4 text-black">${trimmedParagraph.substring(3)}</h2>`
    }
    if (trimmedParagraph.startsWith('# ')) {
      return `<h1 class="text-3xl font-bold mt-10 mb-5 text-black">${trimmedParagraph.substring(2)}</h1>`
    }
    
    // Sprawdź czy to element listy
    if (trimmedParagraph.startsWith('- ')) {
      return `<li class="mb-1 text-black">${trimmedParagraph.substring(2)}</li>`
    }
    
    // Sprawdź czy to podtytuł (cały akapit w **pogrubieniu**)
    if (trimmedParagraph.match(/^\*\*.*\*\*$/)) {
      const content = trimmedParagraph.replace(/^\*\*(.*)\*\*$/, '$1')
      return `<h3 class="text-lg font-bold mt-6 mb-3 text-black">${content}</h3>`
    }
    
    // Sprawdź czy to podtytuł bez gwiazdek (np. "Co To Jest" lub "Do Czego Służy?")
    if (trimmedParagraph.match(/^(Co To Jest|Do Czego Służy\??|Jak To Działa\??|Przykłady|Wskazówki|Uwagi|Podsumowanie)$/i)) {
      return `<h3 class="text-lg font-bold mt-6 mb-3 text-black">${trimmedParagraph}</h3>`
    }
    
    // Formatowanie inline dla zwykłego tekstu
    let processedParagraph = trimmedParagraph
      // Formatowanie **pogrubienie**
      .replace(/\*\*(.*?)\*\*/g, (_, content) => {
        return `<strong class="text-black font-bold">${content}</strong>`
      })
      // Formatowanie *kursywa*
      .replace(/\*(.*?)\*/g, (_, content) => {
        return `<em class="text-black italic">${content}</em>`
      })
      // Formatowanie `kod`
      .replace(/`(.*?)`/g, (_, content) => {
        return `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-black">${content}</code>`
      })
      // Formatowanie linków [tekst](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
        return `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">${text}</a>`
      })
    
    // Opakuj w paragraf
    return `<p class="mb-4 leading-relaxed text-black">${processedParagraph}</p>`
  })
  
  // Połącz akapity
  let result = processedParagraphs.join('\n')
  
  // Opakuj elementy listy w <ul>
  result = result.replace(/<li[^>]*>.*?<\/li>/g, (match) => {
    return `<ul class="list-disc ml-6 mb-4">${match}</ul>`
  })
  
  return result
}

export default function Page({ params }: Props) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrompt()
  }, [])

  const fetchPrompt = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      
      setPrompt(data)
    } catch (error) {
      console.error('Błąd podczas pobierania promptu:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!prompt) return
    try {
      await navigator.clipboard.writeText(`${prompt.description}\n${prompt.tags.join(" ")}\nAutor: ${prompt.author}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      trackPromptCopy(prompt.title)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: prompt?.title,
          text: prompt?.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
      if (prompt) {
        trackPromptShare(prompt.title)
      }
    } catch (err) {
      console.error("Failed to share: ", err)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Ładowanie...</div>
  }

  if (!prompt) {
    return <div className="container mx-auto px-4 py-8">Nie znaleziono promptu</div>
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
            <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Biblioteka", href: "/" },
            { label: prompt.title }
          ]} 
        />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{prompt.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCopy} className="flex items-center gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Skopiowano!" : "Kopiuj prompt"}
            </Button>
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Udostępnij
            </Button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {prompt.author_profile_image ? (
              <img
                src={prompt.author_profile_image}
                alt={prompt.author}
                className="h-5 w-5 rounded-full object-cover border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <Avatar className={`h-5 w-5 ${prompt.author_profile_image ? 'hidden' : ''}`}>
              <AvatarFallback className="text-xs bg-orange-100 text-orange-800">
                {prompt.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
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
              {prompt.images?.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Zdjęcie ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl border shadow-sm"
                  style={{
                    gridColumn: (prompt.images?.length || 0) === 1 ? '1 / -1' : 'span 1',
                    gridRow: (prompt.images?.length || 0) === 1 ? '1 / -1' : (prompt.images?.length || 0) <= 2 ? '1 / -1' : index < 2 ? '1' : '2'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ))}
            </div>
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Introduction - najpierw wstęp */}
          {prompt.introduction && (
            <div className="mb-8">
              <div className="text-black">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: formatIntroductionText(prompt.introduction)
                  }}
                />
              </div>
            </div>
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
                  <Button onClick={handleCopy} size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Skopiowano!" : "Kopiuj prompt"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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

      {/* Notifications */}
      {copied && (
        <Alert className="fixed bottom-4 right-4 w-auto max-w-sm bg-green-50 border-green-200 text-green-800 shadow-lg animate-in slide-in-from-bottom-5">
          <Check className="h-4 w-4" />
          <AlertDescription>Prompt został skopiowany do schowka!</AlertDescription>
        </Alert>
      )}

      {shared && (
        <Alert className="fixed bottom-4 right-4 w-auto max-w-sm bg-blue-50 border-blue-200 text-blue-800 shadow-lg animate-in slide-in-from-bottom-5">
          <Share2 className="h-4 w-4" />
          <AlertDescription>Link został skopiowany do schowka!</AlertDescription>
        </Alert>
      )}
    </div>
    </>
  )
} 