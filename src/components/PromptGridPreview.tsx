"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PromptImageCard } from "./PromptImageCard"

interface PromptGridPreviewProps {
  promptData: {
    title: string
    title_pl: string
    description: string
    description_pl: string
    introduction?: string
    type: 'text' | 'image' | 'video'
    author?: string
    author_profile_image?: string
    tags?: string[]
    images?: string[]
  }
}

export function PromptGridPreview({ promptData }: PromptGridPreviewProps) {
  const [copied, setCopied] = useState(false)

  // Używamy polskich wersji do wyświetlania
  const displayTitle = promptData.title_pl || promptData.title || "Tytuł promptu"
  const displayContent = promptData.description_pl || promptData.description || "Treść promptu"
  const displayAuthor = promptData.author || "Admin"
  const displayTags = promptData.tags || []

  const handleCopy = async () => {
    try {
      // Kopiujemy tylko treść promptu (bez tytułu, bo już jest w treści)
      await navigator.clipboard.writeText(`${promptData.description}\n${displayTags.join(" ")}\nAutor: ${displayAuthor}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Jeśli nie ma wystarczających danych, pokaż placeholder
  if (!promptData.title && !promptData.title_pl) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Wprowadź dane promptu, aby zobaczyć podgląd w grid</p>
        </CardContent>
      </Card>
    )
  }

  // Dla promptów graficznych używamy nowego komponentu PromptImageCard
  if (promptData.type === 'image') {
    return (
      <div className="flex justify-center">
        <div className="max-w-sm w-full">
          <PromptImageCard 
            prompt={{
              id: 'preview',
              title: promptData.title,
              title_pl: promptData.title_pl,
              type: promptData.type,
              author: promptData.author,
              author_profile_image: promptData.author_profile_image,
              images: promptData.images,
              description: promptData.description
            }}
          />
        </div>
      </div>
    )
  }

  // Dla promptów tekstowych używamy starego layoutu
  return (
    <div className="flex justify-center">
      <div className="max-w-sm w-full">
        <Card className="flex flex-col border-[color:var(--main-orange)] h-full min-h-[300px]">
          <div className="px-4 pt-2">
            <h3 className="font-semibold text-base text-black text-center">{displayTitle}</h3>
          </div>
          
          <CardContent className="flex flex-col flex-1 gap-2 pt-2 px-4 pb-0">
            <div className="text-sm text-muted-foreground leading-normal whitespace-pre-wrap break-words overflow-hidden line-clamp-6">
              {displayContent}
            </div>
            <div className="flex flex-wrap gap-1">
              {displayTags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <div className="flex justify-between items-center mt-auto px-4 py-2 border-t">
            <div className="flex items-center gap-1">
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
              <span className="text-sm text-muted-foreground">
                {displayAuthor}
              </span>
            </div>
            <Button
              onClick={handleCopy}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </Card>
      </div>

      {/* Notifications */}
      {copied && (
        <div className="fixed bottom-4 right-4 w-auto max-w-sm bg-green-50 border-green-200 text-green-800 shadow-lg animate-in slide-in-from-bottom-5 z-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span className="text-sm">Prompt został skopiowany do schowka!</span>
          </div>
        </div>
      )}
    </div>
  )
} 