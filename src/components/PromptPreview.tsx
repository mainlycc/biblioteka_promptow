"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Copy, Share2, Check, Calendar, User, Tag, Code, ArrowLeft, Image as ImageIcon } from "lucide-react"

interface PromptPreviewProps {
  promptData: {
    title: string
    title_pl: string
    content: string
    content_pl: string
    introduction?: string
    type: 'text' | 'image' | 'video'
    author?: string
    author_profile_image?: string
    tags?: string[]
    images?: string[]
  }
}

export function PromptPreview({ promptData }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  // Używamy polskich wersji do wyświetlania, angielskich do kopiowania
  const displayTitle = promptData.title_pl || promptData.title || "Tytuł promptu"
  const displayContent = promptData.content_pl || promptData.content || "Treść promptu"
  const copyContent = promptData.content || promptData.content_pl || "Treść promptu"
  const displayAuthor = promptData.author || "Admin"
  const displayTags = promptData.tags || []

  const handleCopy = async () => {
    try {
      // Kopiujemy tylko treść promptu (bez tytułu, bo już jest w treści)
      await navigator.clipboard.writeText(`${copyContent}\n${displayTags.join(" ")}\nAutor: ${displayAuthor}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: displayTitle,
          text: displayContent,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch (err) {
      console.error("Failed to share: ", err)
    }
  }

  // Jeśli nie ma wystarczających danych, pokaż placeholder
  if (!promptData.title && !promptData.title_pl) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Wprowadź dane promptu, aby zobaczyć podgląd</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{displayTitle}</h2>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCopy} size="sm" className="flex items-center gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Skopiowano!" : "Kopiuj prompt"}
            </Button>
            <Button variant="outline" onClick={handleShare} size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Udostępnij
            </Button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {promptData.author_profile_image ? (
              <img
                src={promptData.author_profile_image}
                alt={displayAuthor}
                className="h-5 w-5 rounded-full object-cover border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <Avatar className={`h-5 w-5 ${promptData.author_profile_image ? 'hidden' : ''}`}>
              <AvatarFallback className="text-xs bg-orange-100 text-orange-800">
                {displayAuthor.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span>{displayAuthor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString("pl-PL")}</span>
          </div>
          <Badge variant="outline" className="capitalize">
            {promptData.type === 'text' ? 'Tekstowy' : promptData.type === 'image' ? 'Graficzny' : 'Filmowy'}
          </Badge>
        </div>
      </div>

      {/* Introduction */}
      {promptData.introduction && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
              {promptData.introduction}
            </pre>
          </div>
        </div>
      )}

             {/* Zdjęcia dla promptów graficznych */}
       {promptData.type === 'image' && promptData.images && promptData.images.length > 0 && (
         <div>
           <div className="flex items-center gap-2 mb-3">
             <ImageIcon className="h-4 w-4" />
             <span className="font-medium">Zdjęcia:</span>
           </div>
           <div className="flex flex-1 items-center justify-center">
             <div className="grid w-full max-w-2xl aspect-square gap-2" style={{
               gridTemplateColumns: promptData.images.length === 1 ? '1fr' : '1fr 1fr',
               gridTemplateRows: promptData.images.length === 1 ? '1fr' : promptData.images.length <= 2 ? '1fr' : '1fr 1fr'
             }}>
               {promptData.images.map((imageUrl, index) => (
                 <img
                   key={index}
                   src={imageUrl}
                   alt={`Zdjęcie ${index + 1}`}
                   className="w-full h-full object-cover rounded-xl border shadow-sm"
                   style={{
                     gridColumn: promptData.images.length === 1 ? '1 / -1' : 'span 1',
                     gridRow: promptData.images.length === 1 ? '1 / -1' : promptData.images.length <= 2 ? '1 / -1' : index < 2 ? '1' : '2'
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
       {displayTags.length > 0 && (
         <div>
           <div className="flex items-center gap-2 mb-3">
             <Tag className="h-4 w-4" />
             <span className="font-medium">Tagi:</span>
           </div>
           <div className="flex flex-wrap gap-2">
             {displayTags.map((tag: string, i: number) => (
               <Badge key={i} variant="outline" className="hover:bg-orange-100 hover:border-orange-300">
                 #{tag}
               </Badge>
             ))}
           </div>
         </div>
       )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Full prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Pełny prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Wyświetlane (PL):</p>
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      {`${displayTitle}\n${displayContent}`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Do kopiowania (EN):</p>
                                         <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed bg-green-50 p-3 rounded border-l-4 border-green-400">
                       {`${copyContent}\n${displayTags.join(" ")}\nAutor: ${displayAuthor}`}
                     </pre>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleCopy} size="sm" variant="outline">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Skopiowano!" : "Kopiuj prompt"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Szybkie akcje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleCopy} className="w-full justify-start" variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Kopiuj pełny prompt
              </Button>
              <Button onClick={handleShare} className="w-full justify-start" variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Udostępnij prompt
              </Button>
              <Separator />
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Podgląd:</strong> Pokazuje jak prompt będzie wyglądał na stronie. Tytuł i opis w języku polskim, ale kopiowana treść w języku angielskim.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notifications */}
      {copied && (
        <Alert className="fixed bottom-4 right-4 w-auto max-w-sm bg-green-50 border-green-200 text-green-800 shadow-lg animate-in slide-in-from-bottom-5 z-50">
          <Check className="h-4 w-4" />
          <AlertDescription>Prompt został skopiowany do schowka!</AlertDescription>
        </Alert>
      )}

      {shared && (
        <Alert className="fixed bottom-4 right-4 w-auto max-w-sm bg-blue-50 border-blue-200 text-blue-800 shadow-lg animate-in slide-in-from-bottom-5 z-50">
          <Share2 className="h-4 w-4" />
          <AlertDescription>Link został skopiowany do schowka!</AlertDescription>
        </Alert>
      )}
    </div>
  )
}