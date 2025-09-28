"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Download, FileText, Image as ImageIcon, Check, AlertCircle, Lock, X, Link as LinkIcon, User, Calendar, Hash, Sparkles, Eye, Languages, BookOpen, EyeOff } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { PromptPreview } from "@/components/PromptPreview"
import { PromptGridPreview } from "@/components/PromptGridPreview"
import { BlogGenerator } from "@/components/blog-generator"

interface PromptData {
  title: string
  title_pl: string
  description: string
  description_pl: string
  introduction?: string
  type: 'text' | 'image' | 'video'
  tweet_url?: string
  image_url?: string
  images?: string[]
  author?: string
  author_username?: string
  author_profile_image?: string
  tweet_id?: string
  created_at?: string
  tags?: string[]
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [promptType, setPromptType] = useState<"manual" | "x">("manual")
  const [previewType, setPreviewType] = useState<"detailed" | "grid">("detailed")
  const [activeTab, setActiveTab] = useState<"prompts" | "blog">("prompts")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Test połączenia z Supabase przy ładowaniu
  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        const { error } = await supabase
          .from('prompts')
          .select('count')
          .limit(1)
        
        if (error) {
          console.error('❌ Błąd połączenia z Supabase:', error)
        } else {
          console.log('✅ Połączenie z Supabase działa poprawnie')
        }
      } catch (error) {
        console.error('❌ Błąd podczas testowania połączenia z Supabase:', error)
      }
    }
    
    testSupabaseConnection()
  }, [])

  // Dane promptu
  const [promptData, setPromptData] = useState<PromptData>({
    title: "",
    title_pl: "",
    description: "",
    description_pl: "",
    introduction: "",
    type: "text",
    author: "",
    tags: [],
    images: []
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    if (loginData.username === "admin" && loginData.password === "prompty2024") {
      setIsAuthenticated(true)
    } else {
      setLoginError("Nieprawidłowy login lub hasło")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setLoginData({ username: "", password: "" })
    setLoginError("")
    setShowPassword(false)
  }

  // Pobieranie danych z X
  const handleFetchFromX = async () => {
    if (!promptData.tweet_url) {
      setMessage({ type: 'error', text: 'Wprowadź URL tweeta' })
      return
    }

    setIsFetching(true)
    setMessage(null)

    try {
      const tweetId = extractTweetId(promptData.tweet_url)
      if (!tweetId) {
        throw new Error('Nieprawidłowy URL tweeta')
      }

      // Resetujemy stare dane przed pobraniem nowych
      setPromptData(prev => ({
        ...prev,
        title: "",
        title_pl: "",
        description: "",
        description_pl: "",
        introduction: "",
        images: [],
        author: "",
        author_username: "",
        author_profile_image: "",
        tags: [],
        type: "text"
      }))

      const tweetData = await fetchTweetData(tweetId)
      
              // Automatyczne wypełnienie pól
        const autoTitle = tweetData.description.split('\n')[0].slice(0, 50) + (tweetData.description.split('\n')[0].length > 50 ? '...' : '')
        const updatedData = {
          ...promptData,
          title: autoTitle, // Zawsze używamy nowego tytułu
          title_pl: "", // Resetujemy tłumaczenie tytułu
          description: tweetData.description,
          description_pl: tweetData.description_pl,
          image_url: tweetData.image_url,
          images: tweetData.images || [], // Dodajemy wszystkie zdjęcia z tweeta
          author: tweetData.author || promptData.author,
          author_username: tweetData.author_username,
          author_profile_image: tweetData.author_profile_image,
          tweet_id: tweetData.tweet_id,
          created_at: tweetData.created_at,
          tags: tweetData.hashtags || extractTags(tweetData.description),
          type: (tweetData.images && tweetData.images.length > 0) ? 'image' : 'text' as 'text' | 'image' | 'video'
        }
      
              console.log('📥 Otrzymane dane z API tweet:', {
          imagesCount: tweetData.images?.length || 0,
          images: tweetData.images,
          type: updatedData.type
        })
        
                setPromptData(updatedData)
        
        // Automatyczne tłumaczenie tytułu po pobraniu danych z X
        if (updatedData.title) {
          try {
            console.log('🔄 Automatyczne tłumaczenie tytułu po pobraniu z X...')
            const response = await fetch('/api/translate-title', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: updatedData.title })
            })
            if (response.ok) {
              const data = await response.json()
              console.log('✅ Tytuł przetłumaczony automatycznie')
              setPromptData(prev => ({ ...prev, title_pl: data.translatedText }))
            }
          } catch (error) {
            console.warn('⚠️ Nie udało się przetłumaczyć tytułu automatycznie:', error)
          }
        }
        
        // Automatyczne generowanie wstępu po pobraniu danych z X
        if (updatedData.title && updatedData.description && !updatedData.introduction) {
          try {
            console.log('🔄 Automatyczne generowanie wstępu po pobraniu z X...')
            const response = await fetch('/api/generate-intro', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: updatedData.title,
                description: updatedData.description
              })
            })
            if (response.ok) {
              const data = await response.json()
              console.log('✅ Wstęp wygenerowany automatycznie')
              setPromptData(prev => ({ ...prev, introduction: data.introduction }))
            }
          } catch (error) {
            console.warn('⚠️ Nie udało się wygenerować wstępu automatycznie:', error)
          }
        }
      
      setMessage({ type: 'success', text: 'Dane z X zostały pobrane i wypełnione!' })
    } catch (error) {
      setMessage({ type: 'error', text: `Błąd podczas pobierania danych: ${error instanceof Error ? error.message : 'Nieznany błąd'}` })
    } finally {
      setIsFetching(false)
    }
  }

  // Zapisywanie promptu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Jeśli to prompt ręczny i nie ma tłumaczenia, użyj API endpoint do tłumaczenia
      let finalPromptData = promptData
      
      // Tłumaczenie treści
      if (promptType === "manual" && !promptData.description_pl && promptData.description) {
        try {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: promptData.description })
          })
          if (response.ok) {
            const data = await response.json()
            finalPromptData = { ...finalPromptData, description_pl: data.translatedText }
          }
        } catch (error) {
          console.warn('Błąd podczas tłumaczenia treści:', error)
          // Kontynuuj bez tłumaczenia
        }
      }

      // Tłumaczenie tytułu
      if (promptType === "manual" && !promptData.title_pl && promptData.title) {
        console.log('🔄 Rozpoczynam tłumaczenie tytułu:', promptData.title)
        try {
          const response = await fetch('/api/translate-title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: promptData.title })
          })
          console.log('📡 Response status:', response.status)
          if (response.ok) {
            const data = await response.json()
            console.log('✅ Otrzymane tłumaczenie tytułu:', data.translatedText)
            finalPromptData = { ...finalPromptData, title_pl: data.translatedText }
          } else {
            const errorData = await response.json()
            console.error('❌ Błąd API response:', errorData)
          }
        } catch (error) {
          console.warn('❌ Błąd podczas tłumaczenia tytułu:', error)
          // Kontynuuj bez tłumaczenia
        }
      } else {
        console.log('⏭️ Pomijam tłumaczenie tytułu - warunki:', {
          promptType,
          hasTitlePl: !!promptData.title_pl,
          hasTitle: !!promptData.title
        })
      }

      setPromptData(finalPromptData)

      await savePrompt(finalPromptData)
      
      setMessage({ type: 'success', text: 'Prompt został zapisany!' })
      
      // Reset formularza
              setPromptData({
          title: "",
          title_pl: "",
          description: "",
          description_pl: "",
          introduction: "",
          type: "text",
          author: "",
          tags: [],
          images: []
        })
      setPromptType("manual")
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas zapisywania promptu' })
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generowanie tagów AI
  const handleGenerateTags = async () => {
    if (!promptData.title && !promptData.description) {
      setMessage({ type: 'error', text: 'Wprowadź tytuł lub treść promptu aby wygenerować tagi' })
      return
    }

    setIsGeneratingTags(true)
    setMessage(null)

    try {
      const response = await fetch('/api/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: promptData.title,
          description: promptData.description
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Sprawdź czy to błąd rate limit
        if (response.status === 429) {
          throw new Error(`${errorData.error}\n\n${errorData.details || ''}`)
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Dodaj wygenerowane tagi do istniejących (bez duplikatów)
      const existingTags = promptData.tags || []
      const newTags = data.tags.filter((tag: string) => !existingTags.includes(tag))
      const allTags = [...existingTags, ...newTags]

      setPromptData(prev => ({ ...prev, tags: allTags }))
      setMessage({ type: 'success', text: `Wygenerowano ${newTags.length} nowych tagów!` })
    } catch (error) {
      setMessage({ type: 'error', text: `Błąd podczas generowania tagów: ${error instanceof Error ? error.message : 'Nieznany błąd'}` })
    } finally {
      setIsGeneratingTags(false)
    }
  }

  // Generowanie wstępu AI
  const handleGenerateIntro = async () => {
    if (!promptData.description && !promptData.title) {
      setMessage({ type: 'error', text: 'Wprowadź treść promptu lub tytuł, aby wygenerować wstęp' })
      return
    }

    setIsGeneratingIntro(true)
    setMessage(null)

    try {
      const response = await fetch('/api/generate-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: promptData.title,
          description: promptData.description
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Sprawdź czy to błąd rate limit
        if (response.status === 429) {
          throw new Error(`${errorData.error}\n\n${errorData.details || ''}`)
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setPromptData(prev => ({ ...prev, introduction: data.introduction }))
      setMessage({ type: 'success', text: 'Wstęp został wygenerowany!' })
    } catch (error) {
      setMessage({ type: 'error', text: `Błąd podczas generowania wstępu: ${error instanceof Error ? error.message : 'Nieznany błąd'}` })
    } finally {
      setIsGeneratingIntro(false)
    }
  }

  // Tłumaczenie treści promptu
  const handleTranslateDescription = async () => {
    if (!promptData.description) {
      setMessage({ type: 'error', text: 'Wprowadź treść promptu aby przetłumaczyć' })
      return
    }

    setIsTranslating(true)
    setMessage(null)

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: promptData.description
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Sprawdź czy to błąd rate limit
        if (response.status === 429) {
          throw new Error(`${errorData.error}\n\n${errorData.details || ''}`)
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setPromptData(prev => ({ ...prev, description_pl: data.translatedText }))
      setMessage({ type: 'success', text: 'Treść promptu została przetłumaczona!' })
    } catch (error) {
      setMessage({ type: 'error', text: `Błąd podczas tłumaczenia: ${error instanceof Error ? error.message : 'Nieznany błąd'}` })
    } finally {
      setIsTranslating(false)
    }
  }

  // Funkcje pomocnicze

  const extractTweetId = (url: string): string | null => {
    const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/)
    return match ? match[1] : null
  }

  const fetchTweetData = async (tweetId: string) => {
    try {
      // Wywołujemy nasze API endpoint po stronie serwera
      const response = await fetch(`/api/tweet/${tweetId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const tweetData = await response.json()

      return {
        description: tweetData.content,
        description_pl: tweetData.content_pl, // Już przetłumaczone przez API endpoint
        image_url: tweetData.image_url,
        images: tweetData.images || [], // Dodajemy pole images
        author: tweetData.author,
        author_username: tweetData.author_username,
        author_profile_image: tweetData.author_profile_image,
        created_at: tweetData.created_at,
        tweet_id: tweetData.tweet_id,
        hashtags: tweetData.hashtags
      }
    } catch (error) {
      console.error('Error fetching tweet:', error)
      throw new Error(`Błąd podczas pobierania tweeta: ${error instanceof Error ? error.message : 'Nieznany błąd'}`)
    }
  }

  const extractTags = (content: string): string[] => {
    const hashtags = content.match(/#\w+/g) || []
    return hashtags.map(tag => tag.slice(1))
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !promptData.tags?.includes(tag.trim())) {
      setPromptData(prev => ({ 
        ...prev, 
        tags: [...(prev.tags || []), tag.trim()] 
      }))
    }
  }

    const removeTag = (tagToRemove: string) => {
    setPromptData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  // Funkcje do zarządzania zdjęciami
  const addImage = (imageUrl: string) => {
    if (imageUrl.trim() && !promptData.images?.includes(imageUrl.trim())) {
      setPromptData(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl.trim()]
      }))
    }
  }

  const removeImage = (imageUrlToRemove: string) => {
    setPromptData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img !== imageUrlToRemove) || []
    }))
  }

  const updateImage = (index: number, newUrl: string) => {
    setPromptData(prev => ({
      ...prev,
      images: prev.images?.map((img, i) => i === index ? newUrl : img) || []
    }))
  }

  const savePrompt = async (data: PromptData) => {
    console.log('💾 Zapisuję prompt do Supabase:', {
      title: data.title,
      title_pl: data.title_pl,
      description: data.description,
      description_pl: data.description_pl,
      introduction: data.introduction,
      type: data.type,
      images: data.images,
      author: data.author,
      tags: data.tags
    })

    // Sprawdzamy strukturę tabeli przed zapisem
    try {
      const { error: tableError } = await supabase
        .from('prompts')
        .select('*')
        .limit(0)
      
      if (tableError) {
        console.error('❌ Błąd struktury tabeli:', tableError)
        throw new Error(`Błąd struktury tabeli: ${tableError.message}`)
      }
      
      console.log('✅ Struktura tabeli jest poprawna')
    } catch (error) {
      console.error('❌ Błąd podczas sprawdzania struktury tabeli:', error)
      throw error
    }

    const { error } = await supabase
      .from('prompts')
      .insert([{
        title: data.title,
        title_pl: data.title_pl,
        description: data.description,
        description_pl: data.description_pl,
        introduction: data.introduction,
        type: data.type,
        tweet_url: data.tweet_url,
        image_url: data.image_url,
        images: data.images,
        author: data.author || 'Admin',
        author_username: data.author_username,
        author_profile_image: data.author_profile_image,
        tweet_id: data.tweet_id,
        tags: data.tags || [],
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('❌ Błąd podczas zapisywania do Supabase:', error)
      console.error('❌ Szczegóły błędu:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw error
    }
    
    console.log('✅ Prompt został zapisany do Supabase')
  }

  // Jeśli nie jest zalogowany, pokaż formularz logowania
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Powrót do strony głównej
          </Link>
        </div>

        <Card className="border-[color:var(--main-orange)]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Lock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <CardTitle>Panel Administratora</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Login</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="Wprowadź login"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Wprowadź hasło"
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Zaloguj się
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Powrót do strony głównej
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Panel Administratora</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Wyloguj się
          </Button>
        </div>
        <p className="text-muted-foreground">
          Zarządzaj promptami i artykułami bloga
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "prompts" | "blog")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg mb-6">
          <TabsTrigger 
            value="prompts" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm data-[state=active]:border-orange-200 data-[state=active]:border"
          >
            <FileText className="h-4 w-4" />
            Prompty
          </TabsTrigger>
          <TabsTrigger 
            value="blog" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm data-[state=active]:border-orange-200 data-[state=active]:border"
          >
            <BookOpen className="h-4 w-4" />
            Blog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompts">

      {/* Message */}
      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Main Card */}
      <Card className="border-[color:var(--main-orange)]">
        <CardHeader>
          <CardTitle>Dodaj nowy prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div className="space-y-4">
              <Label>Typ promptu</Label>
              <Tabs value={promptType} onValueChange={(value) => setPromptType(value as "manual" | "x")} defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="manual" 
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm data-[state=active]:border-orange-200 data-[state=active]:border"
                  >
                    <FileText className="h-4 w-4" />
                    Prompt ręczny
                  </TabsTrigger>
                  <TabsTrigger 
                    value="x" 
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm data-[state=active]:border-orange-200 data-[state=active]:border"
                  >
                    <X className="h-4 w-4" />
                    Z X (Twitter)
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual" className="mt-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-600">Wprowadź dane promptu ręcznie</p>
                    </div>
                    
                    {/* Form Fields */}
                    <div className="space-y-4 p-4 bg-white rounded-lg border">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Dane promptu
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Tytuł promptu *
                          </Label>
                          <Input
                            id="title"
                            value={promptData.title}
                            onChange={(e) => setPromptData({ ...promptData, title: e.target.value })}
                            placeholder="Wprowadź tytuł promptu..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title_pl" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Tłumaczenie tytułu (PL)
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="title_pl"
                              value={promptData.title_pl}
                              onChange={(e) => setPromptData({ ...promptData, title_pl: e.target.value })}
                              placeholder="Polskie tłumaczenie tytułu..."
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              onClick={async () => {
                                if (!promptData.title) {
                                  setMessage({ type: 'error', text: 'Wprowadź najpierw tytuł angielski' })
                                  return
                                }
                                try {
                                  console.log('🔄 Testowe tłumaczenie tytułu:', promptData.title)
                                  const response = await fetch('/api/translate-title', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ text: promptData.title })
                                  })
                                  if (response.ok) {
                                    const data = await response.json()
                                    console.log('✅ Testowe tłumaczenie otrzymane:', data.translatedText)
                                    setPromptData({ ...promptData, title_pl: data.translatedText })
                                    setMessage({ type: 'success', text: 'Tytuł został przetłumaczony!' })
                                  } else {
                                    const errorData = await response.json()
                                    console.error('❌ Błąd testowego tłumaczenia:', errorData)
                                    setMessage({ type: 'error', text: 'Błąd podczas tłumaczenia tytułu' })
                                  }
                                } catch (error) {
                                  console.error('❌ Błąd testowego tłumaczenia:', error)
                                  setMessage({ type: 'error', text: 'Błąd podczas tłumaczenia tytułu' })
                                }
                              }}
                              disabled={!promptData.title}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 whitespace-nowrap"
                            >
                              <Sparkles className="h-4 w-4" />
                              Przetłumacz
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="introduction" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Wstęp (styl bloga)
                        </Label>
                        <div className="flex flex-col gap-2">
                          <Textarea
                            id="introduction"
                            value={promptData.introduction || ""}
                            onChange={(e) => setPromptData({ ...promptData, introduction: e.target.value })}
                            placeholder="Wstęp w stylu posta blogowego (zostanie wygenerowany automatycznie jeśli pozostawisz puste)..."
                            rows={6}
                          />
                          <div className="flex justify-end">
                            <Button 
                              type="button" 
                              onClick={handleGenerateIntro}
                              disabled={isGeneratingIntro || (!promptData.description && !promptData.title)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              {isGeneratingIntro ? (
                                "Generowanie..."
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4" />
                                  Generuj wstęp AI
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                                               <div className="space-y-2">
                           <Label className="flex items-center gap-2">
                             <ImageIcon className="h-4 w-4" />
                             Typ promptu
                           </Label>
                           <RadioGroup 
                             value={promptData.type} 
                             onValueChange={(value: 'text' | 'image' | 'video') => setPromptData({ ...promptData, type: value })}
                             className="flex flex-row space-x-6"
                           >
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem 
                                 value="text" 
                                 id="text" 
                               />
                               <Label htmlFor="text" className="text-sm font-normal cursor-pointer">
                                 Tekstowy
                               </Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem 
                                 value="image" 
                                 id="image" 
                               />
                               <Label htmlFor="image" className="text-sm font-normal cursor-pointer">
                                 Graficzny
                               </Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem 
                                 value="video" 
                                 id="video" 
                               />
                               <Label htmlFor="video" className="text-sm font-normal cursor-pointer">
                                 Filmowy
                               </Label>
                             </div>
                           </RadioGroup>
                         </div>

                         {/* Zdjęcia dla promptów graficznych */}
                         {promptData.type === 'image' && (
                           <div className="space-y-2">
                             <Label className="flex items-center gap-2">
                               <ImageIcon className="h-4 w-4" />
                               Zdjęcia (1-4)
                             </Label>
                             <div className="space-y-3">
                               {/* Dodawanie nowego zdjęcia */}
                               <div className="flex gap-2">
                                 <Input
                                   placeholder="https://example.com/image.jpg"
                                   onKeyPress={(e) => {
                                     if (e.key === 'Enter') {
                                       e.preventDefault()
                                       const input = e.target as HTMLInputElement
                                       if (input.value.trim() && (promptData.images?.length || 0) < 4) {
                                         addImage(input.value)
                                         input.value = ''
                                       }
                                     }
                                   }}
                                   className="flex-1"
                                 />
                                 <Button
                                   type="button"
                                   onClick={() => {
                                     const input = document.querySelector('input[placeholder*="example.com"]') as HTMLInputElement
                                     if (input?.value.trim() && (promptData.images?.length || 0) < 4) {
                                       addImage(input.value)
                                       input.value = ''
                                     }
                                   }}
                                   disabled={(promptData.images?.length || 0) >= 4}
                                   size="sm"
                                   variant="outline"
                                 >
                                   Dodaj
                                 </Button>
                               </div>
                               
                               {/* Lista zdjęć */}
                               {promptData.images && promptData.images.length > 0 && (
                                 <div className="space-y-2">
                                   {promptData.images.map((imageUrl, index) => (
                                     <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                                       <img
                                         src={imageUrl}
                                         alt={`Zdjęcie ${index + 1}`}
                                         className="w-12 h-12 object-cover rounded border"
                                         onError={(e) => {
                                           e.currentTarget.style.display = 'none'
                                         }}
                                       />
                                       <Input
                                         value={imageUrl}
                                         onChange={(e) => updateImage(index, e.target.value)}
                                         className="flex-1"
                                       />
                                       <Button
                                         type="button"
                                         onClick={() => removeImage(imageUrl)}
                                         size="sm"
                                         variant="outline"
                                         className="text-red-600 hover:text-red-700"
                                       >
                                         Usuń
                                       </Button>
                                     </div>
                                   ))}
                                 </div>
                               )}
                               
                               <div className="text-xs text-gray-500">
                                 Maksymalnie 4 zdjęcia. Układ będzie automatycznie dostosowany do liczby zdjęć.
                               </div>
                             </div>
                           </div>
                         )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="content" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Treść promptu (do kopiowania) *
                          </Label>
                          <Button
                            type="button"
                            onClick={handleTranslateDescription}
                            disabled={isTranslating || !promptData.description}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Languages className="h-4 w-4" />
                            {isTranslating ? 'Tłumaczę...' : 'Tłumacz'}
                          </Button>
                        </div>
                        <Textarea
                          id="content"
                          value={promptData.description}
                          onChange={(e) => setPromptData({ ...promptData, description: e.target.value })}
                          placeholder="Wprowadź treść promptu, która będzie kopiowana..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description_pl" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Tłumaczenie (PL)
                        </Label>
                        <Textarea
                          id="description_pl"
                          value={promptData.description_pl}
                          onChange={(e) => setPromptData({ ...promptData, description_pl: e.target.value })}
                          placeholder="Polskie tłumaczenie promptu..."
                          rows={4}
                        />
                      </div>

                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="author" className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Autor
                            </Label>
                            <Input
                              id="author"
                              value={promptData.author}
                              onChange={(e) => setPromptData({ ...promptData, author: e.target.value })}
                              placeholder="Wprowadź nazwę autora..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="author_username" className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Username autora
                            </Label>
                            <Input
                              id="author_username"
                              value={promptData.author_username || ""}
                              onChange={(e) => setPromptData({ ...promptData, author_username: e.target.value })}
                              placeholder="@username"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="author_profile_image" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Zdjęcie profilowe autora
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="author_profile_image"
                              value={promptData.author_profile_image || ""}
                              onChange={(e) => setPromptData({ ...promptData, author_profile_image: e.target.value })}
                              placeholder="https://example.com/profile-image.jpg"
                              className="flex-1"
                            />
                            {promptData.author_profile_image && (
                              <div className="flex items-center gap-2">
                                <img 
                                  src={promptData.author_profile_image} 
                                  alt="Zdjęcie profilowe" 
                                  className="h-8 w-8 rounded-full object-cover border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags" className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Tagi
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="tags"
                            placeholder="Dodaj tag i naciśnij Enter..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addTag(e.currentTarget.value)
                                e.currentTarget.value = ''
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            onClick={() => {
                              const input = document.getElementById('tags') as HTMLInputElement
                              if (input) {
                                addTag(input.value)
                                input.value = ''
                              }
                            }}
                          >
                            Dodaj
                          </Button>
                          <Button 
                            type="button" 
                            onClick={handleGenerateTags}
                            disabled={isGeneratingTags || (!promptData.title && !promptData.description)}
                            variant="outline"
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
                        {promptData.tags && promptData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {promptData.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                                onClick={() => removeTag(tag)}
                              >
                                {tag} ×
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="x" className="mt-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="space-y-2">
                        <Label htmlFor="tweet_url" className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          URL tweeta z X
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="tweet_url"
                            type="url"
                            value={promptData.tweet_url || ""}
                            onChange={(e) => setPromptData({ ...promptData, tweet_url: e.target.value })}
                            placeholder="https://x.com/user/status/123456789"
                            className="flex-1"
                          />
                          <Button 
                            type="button"
                            onClick={handleFetchFromX}
                            disabled={isFetching || !promptData.tweet_url}
                            className="flex items-center gap-2"
                          >
                            {isFetching ? (
                              "Pobieranie..."
                            ) : (
                              <>
                                <Download className="h-4 w-4" />
                                Pobierz
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* X-specific fields */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-semibold flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Informacje z X
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tweet_id" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Tweet ID
                          </Label>
                          <Input
                            id="tweet_id"
                            value={promptData.tweet_id || ""}
                            onChange={(e) => setPromptData({ ...promptData, tweet_id: e.target.value })}
                            placeholder="ID tweeta"
                            readOnly
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="created_at" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Data utworzenia
                          </Label>
                          <Input
                            id="created_at"
                            value={promptData.created_at ? new Date(promptData.created_at).toLocaleString('pl-PL') : ""}
                            placeholder="Data utworzenia tweeta"
                            readOnly
                          />
                        </div>
                      </div>

                      {promptData.image_url && (
                        <div className="space-y-2">
                          <Label>Obrazek z tweeta</Label>
                          <div className="flex items-center gap-4">
                            <img 
                              src={promptData.image_url} 
                              alt="Obrazek z tweeta" 
                              className="h-20 w-20 object-cover rounded border"
                            />
                            <Input
                              value={promptData.image_url}
                              onChange={(e) => setPromptData({ ...promptData, image_url: e.target.value })}
                              placeholder="URL obrazka"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 p-4 bg-white rounded-lg border">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Dane promptu
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title-x" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Tytuł promptu *
                          </Label>
                          <Input
                            id="title-x"
                            value={promptData.title}
                            onChange={(e) => setPromptData({ ...promptData, title: e.target.value })}
                            placeholder="Wprowadź tytuł promptu..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title_pl-x" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Tłumaczenie tytułu (PL)
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="title_pl-x"
                              value={promptData.title_pl}
                              onChange={(e) => setPromptData({ ...promptData, title_pl: e.target.value })}
                              placeholder="Polskie tłumaczenie tytułu..."
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              onClick={async () => {
                                if (!promptData.title) {
                                  setMessage({ type: 'error', text: 'Wprowadź najpierw tytuł angielski' })
                                  return
                                }
                                try {
                                  console.log('🔄 Testowe tłumaczenie tytułu:', promptData.title)
                                  const response = await fetch('/api/translate-title', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ text: promptData.title })
                                  })
                                  if (response.ok) {
                                    const data = await response.json()
                                    console.log('✅ Testowe tłumaczenie otrzymane:', data.translatedText)
                                    setPromptData({ ...promptData, title_pl: data.translatedText })
                                    setMessage({ type: 'success', text: 'Tytuł został przetłumaczony!' })
                                  } else {
                                    const errorData = await response.json()
                                    console.error('❌ Błąd testowego tłumaczenia:', errorData)
                                    setMessage({ type: 'error', text: 'Błąd podczas tłumaczenia tytułu' })
                                  }
                                } catch (error) {
                                  console.error('❌ Błąd testowego tłumaczenia:', error)
                                  setMessage({ type: 'error', text: 'Błąd podczas tłumaczenia tytułu' })
                                }
                              }}
                              disabled={!promptData.title}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 whitespace-nowrap"
                            >
                              <Sparkles className="h-4 w-4" />
                              Przetłumacz
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="introduction-x" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Wstęp (styl bloga)
                        </Label>
                        <div className="flex flex-col gap-2">
                          <Textarea
                            id="introduction-x"
                            value={promptData.introduction || ""}
                            onChange={(e) => setPromptData({ ...promptData, introduction: e.target.value })}
                            placeholder="Wstęp w stylu posta blogowego (zostanie wygenerowany automatycznie jeśli pozostawisz puste)..."
                            rows={6}
                          />
                          <div className="flex justify-end">
                            <Button 
                              type="button" 
                              onClick={handleGenerateIntro}
                              disabled={isGeneratingIntro || (!promptData.description && !promptData.title)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              {isGeneratingIntro ? (
                                "Generowanie..."
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4" />
                                  Generuj wstęp AI
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                                               <div className="space-y-2">
                           <Label className="flex items-center gap-2">
                             <ImageIcon className="h-4 w-4" />
                             Typ promptu
                           </Label>
                           <RadioGroup 
                             value={promptData.type} 
                             onValueChange={(value: 'text' | 'image' | 'video') => setPromptData({ ...promptData, type: value })}
                             className="flex flex-row space-x-6"
                           >
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem 
                                 value="text" 
                                 id="text-x" 
                               />
                               <Label htmlFor="text-x" className="text-sm font-normal cursor-pointer">
                                 Tekstowy
                               </Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem 
                                 value="image" 
                                 id="image-x" 
                               />
                               <Label htmlFor="image-x" className="text-sm font-normal cursor-pointer">
                                 Graficzny
                               </Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <RadioGroupItem 
                                 value="video" 
                                 id="video-x" 
                               />
                               <Label htmlFor="video-x" className="text-sm font-normal cursor-pointer">
                                 Filmowy
                               </Label>
                             </div>
                           </RadioGroup>
                         </div>

                         {/* Zdjęcia dla promptów graficznych */}
                         {promptData.type === 'image' && (
                           <div className="space-y-2">
                             <Label className="flex items-center gap-2">
                               <ImageIcon className="h-4 w-4" />
                               Zdjęcia (1-4)
                             </Label>
                             <div className="space-y-3">
                               {/* Dodawanie nowego zdjęcia */}
                               <div className="flex gap-2">
                                 <Input
                                   placeholder="https://example.com/image.jpg"
                                   onKeyPress={(e) => {
                                     if (e.key === 'Enter') {
                                       e.preventDefault()
                                       const input = e.target as HTMLInputElement
                                       if (input.value.trim() && (promptData.images?.length || 0) < 4) {
                                         addImage(input.value)
                                         input.value = ''
                                       }
                                     }
                                   }}
                                   className="flex-1"
                                 />
                                 <Button
                                   type="button"
                                   onClick={() => {
                                     const input = document.querySelector('input[placeholder*="example.com"]') as HTMLInputElement
                                     if (input?.value.trim() && (promptData.images?.length || 0) < 4) {
                                       addImage(input.value)
                                       input.value = ''
                                     }
                                   }}
                                   disabled={(promptData.images?.length || 0) >= 4}
                                   size="sm"
                                   variant="outline"
                                 >
                                   Dodaj
                                 </Button>
                               </div>
                               
                               {/* Lista zdjęć */}
                               {promptData.images && promptData.images.length > 0 && (
                                 <div className="space-y-2">
                                   {promptData.images.map((imageUrl, index) => (
                                     <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                                       <img
                                         src={imageUrl}
                                         alt={`Zdjęcie ${index + 1}`}
                                         className="w-12 h-12 object-cover rounded border"
                                         onError={(e) => {
                                           e.currentTarget.style.display = 'none'
                                         }}
                                       />
                                       <Input
                                         value={imageUrl}
                                         onChange={(e) => updateImage(index, e.target.value)}
                                         className="flex-1"
                                       />
                                       <Button
                                         type="button"
                                         onClick={() => removeImage(imageUrl)}
                                         size="sm"
                                         variant="outline"
                                         className="text-red-600 hover:text-red-700"
                                       >
                                         Usuń
                                       </Button>
                                     </div>
                                   ))}
                                 </div>
                               )}
                               
                               <div className="text-xs text-gray-500">
                                 Maksymalnie 4 zdjęcia. Układ będzie automatycznie dostosowany do liczby zdjęć.
                               </div>
                             </div>
                           </div>
                         )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="content-x" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Treść promptu (do kopiowania) *
                          </Label>
                          <Button
                            type="button"
                            onClick={handleTranslateDescription}
                            disabled={isTranslating || !promptData.description}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Languages className="h-4 w-4" />
                            {isTranslating ? 'Tłumaczę...' : 'Tłumacz'}
                          </Button>
                        </div>
                        <Textarea
                          id="content-x"
                          value={promptData.description}
                          onChange={(e) => setPromptData({ ...promptData, description: e.target.value })}
                          placeholder="Wprowadź treść promptu, która będzie kopiowana..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description_pl-x" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Tłumaczenie (PL)
                        </Label>
                        <Textarea
                          id="description_pl-x"
                          value={promptData.description_pl}
                          onChange={(e) => setPromptData({ ...promptData, description_pl: e.target.value })}
                          placeholder="Polskie tłumaczenie promptu..."
                          rows={4}
                        />
                      </div>

                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="author-x" className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Autor
                            </Label>
                            <Input
                              id="author-x"
                              value={promptData.author}
                              onChange={(e) => setPromptData({ ...promptData, author: e.target.value })}
                              placeholder="Wprowadź nazwę autora..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="author_username-x" className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Username autora
                            </Label>
                            <Input
                              id="author_username-x"
                              value={promptData.author_username || ""}
                              onChange={(e) => setPromptData({ ...promptData, author_username: e.target.value })}
                              placeholder="@username"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="author_profile_image-x" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Zdjęcie profilowe autora
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="author_profile_image-x"
                              value={promptData.author_profile_image || ""}
                              onChange={(e) => setPromptData({ ...promptData, author_profile_image: e.target.value })}
                              placeholder="https://example.com/profile-image.jpg"
                              className="flex-1"
                            />
                            {promptData.author_profile_image && (
                              <div className="flex items-center gap-2">
                                <img 
                                  src={promptData.author_profile_image} 
                                  alt="Zdjęcie profilowe" 
                                  className="h-8 w-8 rounded-full object-cover border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags-x" className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Tagi
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="tags-x"
                            placeholder="Dodaj tag i naciśnij Enter..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addTag(e.currentTarget.value)
                                e.currentTarget.value = ''
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            onClick={() => {
                              const input = document.getElementById('tags-x') as HTMLInputElement
                              if (input) {
                                addTag(input.value)
                                input.value = ''
                              }
                            }}
                          >
                            Dodaj
                          </Button>
                          <Button 
                            type="button" 
                            onClick={handleGenerateTags}
                            disabled={isGeneratingTags || (!promptData.title && !promptData.description)}
                            variant="outline"
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
                        {promptData.tags && promptData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {promptData.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                                onClick={() => removeTag(tag)}
                              >
                                {tag} ×
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Podgląd */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Podgląd:</Label>
                <Tabs value={previewType} onValueChange={(value) => setPreviewType(value as "detailed" | "grid")} className="w-auto">
                  <TabsList className="grid w-auto grid-cols-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="detailed" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm data-[state=active]:border-orange-200 data-[state=active]:border"
                    >
                      <Eye className="h-4 w-4" />
                      Szczegółowy
                    </TabsTrigger>
                    <TabsTrigger 
                      value="grid" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm data-[state=active]:border-orange-200 data-[state=active]:border"
                    >
                      <Eye className="h-4 w-4" />
                      Grid
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Card className="border-[color:var(--main-orange)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    {previewType === "detailed" ? "Podgląd Szczegółowy (strona promptu)" : "Podgląd Grid (strona główna)"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {previewType === "detailed" ? (
                    <PromptPreview promptData={promptData} />
                  ) : (
                    <PromptGridPreview promptData={promptData} />
                  )}
                </CardContent>
              </Card>
            </div>

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
                  Zapisz prompt
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="blog">
          <BlogGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
} 