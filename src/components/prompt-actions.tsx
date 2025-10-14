"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Share2, Check } from "lucide-react"
import { trackPromptCopy, trackPromptShare } from "@/components/google-analytics"

interface PromptActionsProps {
  prompt: {
    id: string
    title: string
    description: string
    tags: string[]
    author: string
  }
}

export function PromptActions({ prompt }: PromptActionsProps) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const handleCopy = async () => {
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
          title: prompt.title,
          text: prompt.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
      trackPromptShare(prompt.title)
    } catch (err) {
      console.error("Failed to share: ", err)
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleCopy} className="flex items-center justify-center gap-2 w-full sm:w-auto">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Skopiowano!" : "Kopiuj prompt"}
        </Button>
        <Button variant="outline" onClick={handleShare} className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <Share2 className="h-4 w-4" />
          Udostępnij
        </Button>
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
    </>
  )
}

interface CopyButtonProps {
  prompt: {
    id: string
    title: string
    description: string
    tags: string[]
    author: string
  }
}

export function CopyButton({ prompt }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.description)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      trackPromptCopy(prompt.title)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Button onClick={handleCopy} size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
      {copied ? "Skopiowano!" : "Kopiuj prompt"}
    </Button>
  )
}


