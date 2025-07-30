"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Copy, Share2, Check, Calendar, User, Tag, Code } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PromptSchema, BreadcrumbSchema } from "@/components/json-ld-schema"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { trackPromptCopy, trackPromptShare } from "@/components/google-analytics"

interface Prompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  author_id?: string;
  created_at: string;
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
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
      await navigator.clipboard.writeText(`${prompt.title}\n${prompt.description}\n${prompt.tags.join(" ")}\nAutor: ${prompt.author}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      trackPromptCopy(prompt.id, prompt.title)
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
        trackPromptShare(prompt.id, prompt.title)
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
            <Avatar className="h-5 w-5">
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

      {/* Tags */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4" />
          <span className="font-medium">Tagi:</span>
        </div>
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
                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                  {`${prompt.title}\n${prompt.description}\n${prompt.tags.join(" ")}\nAutor: ${prompt.author}`}
                </pre>
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
        <div className="space-y-6">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Szybkie akcje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleCopy} className="w-full justify-start" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Kopiuj pełny prompt
              </Button>
              <Button onClick={handleShare} className="w-full justify-start" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Udostępnij prompt
              </Button>
              <Separator />
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