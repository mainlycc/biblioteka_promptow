"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Funkcja do konwersji ścieżek Supabase Storage na pełne publiczne URL-e
const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return null
  // Jeśli już jest pełny URL (http/https), zwróć bez zmian
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // Konwertuj ścieżkę Supabase Storage na pełny URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return imageUrl
  
  // Usuń wiodące slashe i zbuduj pełny URL
  const normalizedPath = imageUrl.replace(/^\/+/, '')
  return `${supabaseUrl}/storage/v1/object/public/${normalizedPath}`
}

interface TwitterIconProps {
  className?: string;
  [key: string]: unknown;
}

const Verified = ({ className, ...props }: TwitterIconProps) => (
  <svg
    aria-label="Verified Account"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <g fill="currentColor">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </g>
  </svg>
);

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length - 3)}...`;
};

interface PromptImageCardProps {
  prompt: {
    id: string
    title: string
    title_pl?: string
    type: 'text' | 'image' | 'video'
    author?: string
    author_username?: string
    author_profile_image?: string
    images?: string[]
    description: string
  }
}

export function PromptImageCard({ prompt }: PromptImageCardProps) {
  const [copied, setCopied] = useState(false)

  // Używamy polskich wersji do wyświetlania
  const displayTitle = prompt.title_pl || prompt.title || "Tytuł promptu"
  const displayAuthor = (prompt.author || "Admin").replace(/\s*\([^)]*\)/g, '')
  const photos = prompt.images || []
  const photoCount = photos.length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.description)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Card className={cn(
      "relative flex size-full max-w-lg flex-col gap-1 overflow-hidden min-h-[280px] border-[color:var(--main-orange)]"
    )}>
      {/* Header - Tytuł */}
      <div className="flex flex-row justify-between tracking-tight px-4 pt-1">
        <div className="w-full">
          <h3 className="font-semibold text-base text-black text-center">{displayTitle}</h3>
        </div>
      </div>

      {/* Media - Zdjęcia */}
      {prompt.type === 'image' && photos.length > 0 && (
        <div className="px-4 pt-1">
          <div className="grid w-full aspect-square gap-1 grid-cols-2 grid-rows-2">
            {photos.map((photo, index) => {
              const imageUrl = resolveImageUrl(photo)
              if (!imageUrl) return null
              
              return (
                <img
                  key={photo}
                  src={imageUrl}
                  alt={displayTitle}
                  className="w-full h-full object-cover object-center rounded-xl border shadow-sm"
                  style={{
                    gridColumn: photoCount === 1 ? '1 / -1' : 
                               photoCount === 2 ? 'span 1' : 
                               photoCount === 3 ? (index === 0 ? '1 / 2' : '2 / 3') :
                               'span 1',
                    gridRow: photoCount === 1 ? '1 / -1' : 
                            photoCount === 2 ? '1 / -1' : 
                            photoCount === 3 ? (index === 0 ? '1 / -1' : (index === 1 ? '1 / 2' : '2 / 3')) :
                            index < 2 ? '1 / 2' : '2 / 3'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Footer - Autor i przycisk kopiowania */}
      <div className="flex flex-row items-center justify-between mt-auto px-4 py-0.5 border-t">
        <div className="flex items-center gap-1">
          {prompt.author_profile_image ? (
            <img
              title={`Profile picture of ${displayAuthor}`}
              alt={displayAuthor}
              height={20}
              width={20}
              src={prompt.author_profile_image}
              className="overflow-hidden rounded-full border border-transparent"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <Avatar className={`h-5 w-5 ${prompt.author_profile_image ? 'hidden' : ''}`}>
            <AvatarFallback className="text-xs bg-orange-100 text-orange-800">
              {displayAuthor.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center whitespace-nowrap font-semibold text-sm text-black">
              {truncate(displayAuthor, 20)}
              {/* Dodaj weryfikację jeśli autor ma username */}
              {prompt.author_username && (
                <Verified className="ml-1 inline size-3 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground transition-all duration-75">
                @{truncate(prompt.author_username || displayAuthor.toLowerCase().replace(/\s+/g, ''), 16)}
              </span>
            </div>
          </div>
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
  )
} 