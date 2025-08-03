"use client"

import { useState, useEffect } from "react"
import { PromptImageCard } from "@/components/PromptImageCard"
import { supabase } from "@/lib/supabase"

interface Prompt {
  id: string
  title: string
  title_pl?: string
  type: 'text' | 'image' | 'video'
  author?: string
  author_username?: string
  author_profile_image?: string
  images?: string[]
  description: string
  created_at: string
}

export default function PromptyGraficznePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImagePrompts()
  }, [])

  const fetchImagePrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('type', 'image')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPrompts(data || [])
    } catch (error) {
      console.error('Błąd podczas pobierania promptów graficznych:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 p-8 pt-4">
        <h1 className="text-2xl font-bold mb-4">Prompty graficzne</h1>
        <div>Ładowanie...</div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-8 pt-4">
      <h1 className="text-2xl font-bold mb-4">Prompty graficzne</h1>
      <div className="text-muted-foreground mb-4">Znaleziono {prompts.length} promptów graficznych</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {prompts.map((prompt) => (
          <PromptImageCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </main>
  )
} 