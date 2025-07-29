"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Download, FileText, Image, Check, AlertCircle, Lock } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface PromptData {
  title: string
  content: string
  content_pl: string
  type: 'text' | 'image'
  tweet_url?: string
  image_url?: string
  local_image?: string
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
  
  const [activeTab, setActiveTab] = useState("text")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Tryb tekstowy
  const [textData, setTextData] = useState({
    title: "",
    content: "",
    type: "text" as 'text' | 'image',
    author: "",
    tags: [] as string[]
  })
  
  // Tryb Twitter
  const [twitterData, setTwitterData] = useState({
    tweet_url: "",
    type: "image" as const,
    title: "",
    author: ""
  })
  const [tweetInfo, setTweetInfo] = useState<{
    content: string
    content_pl: string
    image_url?: string
    author?: string
    author_username?: string
    author_profile_image?: string
    tweet_id?: string
    created_at?: string
  } | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    // Proste sprawdzenie loginu i hasła
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
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Wprowadź hasło"
                  required
                />
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

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Symulacja tłumaczenia API
      const content_pl = await translateText(textData.content)
      
      const promptData: PromptData = {
        title: textData.title,
        content: textData.content,
        content_pl,
        type: textData.type,
        author: textData.author,
        tags: textData.tags
      }

      await savePrompt(promptData)
      
      setMessage({ type: 'success', text: 'Prompt tekstowy został zapisany!' })
      setTextData({ title: "", content: "", type: "text", author: "", tags: [] })
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas zapisywania promptu' })
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwitterFetch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const tweetId = extractTweetId(twitterData.tweet_url)
      if (!tweetId) {
        throw new Error('Nieprawidłowy URL tweeta')
      }

      // Symulacja pobierania danych z Twittera
      const tweetData = await fetchTweetData(tweetId)
      setTweetInfo(tweetData)
      
      setMessage({ type: 'success', text: 'Dane z Twittera zostały pobrane!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas pobierania danych z Twittera' })
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwitterSubmit = async () => {
    if (!tweetInfo) return
    
    setIsLoading(true)
    setMessage(null)

    try {
      const promptData: PromptData = {
        title: twitterData.title || tweetInfo.content.slice(0, 100),
        content: tweetInfo.content,
        content_pl: tweetInfo.content_pl,
        type: twitterData.type,
        tweet_url: twitterData.tweet_url,
        image_url: tweetInfo.image_url,
        author: twitterData.author || tweetInfo.author,
        author_username: tweetInfo.author_username,
        author_profile_image: tweetInfo.author_profile_image,
        tweet_id: tweetInfo.tweet_id,
        created_at: tweetInfo.created_at,
        tags: extractTags(tweetInfo.content)
      }

      await savePrompt(promptData)
      
      setMessage({ type: 'success', text: 'Prompt z Twittera został zapisany!' })
      setTwitterData({ tweet_url: "", type: "image", title: "", author: "" })
      setTweetInfo(null)
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas zapisywania promptu' })
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Funkcje pomocnicze
  const translateText = async (text: string): Promise<string> => {
    // Symulacja tłumaczenia - w rzeczywistości użyj API tłumaczenia
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `[PL] ${text}`
  }

  const extractTweetId = (url: string): string | null => {
    // Obsługuje zarówno twitter.com jak i x.com
    const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/)
    return match ? match[1] : null
  }

  const fetchTweetData = async (tweetId: string) => {
    try {
      // X API v2 Post Lookup endpoint
      const response = await fetch(`https://api.twitter.com/2/tweets/${tweetId}?expansions=author_id,attachments.media_keys&user.fields=name,username,profile_image_url&media.fields=url,preview_image_url,type`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`X API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.data) {
        throw new Error('Tweet nie został znaleziony')
      }

      const tweet = data.data
      const users = data.includes?.users || []
      const media = data.includes?.media || []
      
      const author = users.find((user: any) => user.id === tweet.author_id)
      const images = media.filter((item: any) => item.type === 'photo')

      // Tłumaczenie treści
      const content_pl = await translateText(tweet.text)

      return {
        content: tweet.text,
        content_pl,
        image_url: images.length > 0 ? images[0].url : undefined,
        author: author ? `${author.name} (@${author.username})` : 'Nieznany autor',
        author_username: author?.username,
        author_profile_image: author?.profile_image_url,
        created_at: tweet.created_at,
        tweet_id: tweetId
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
    if (tag.trim() && !textData.tags.includes(tag.trim())) {
      setTextData({ ...textData, tags: [...textData.tags, tag.trim()] })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTextData({ ...textData, tags: textData.tags.filter(tag => tag !== tagToRemove) })
  }

  const savePrompt = async (data: PromptData) => {
    const { error } = await supabase
      .from('prompts')
      .insert([{
        title: data.title,
        description: data.content,
        content_pl: data.content_pl,
        type: data.type,
        tweet_url: data.tweet_url,
        image_url: data.image_url,
        author: data.author || 'Admin',
        author_username: data.author_username,
        author_profile_image: data.author_profile_image,
        tweet_id: data.tweet_id,
        tags: data.tags || [],
        created_at: new Date().toISOString()
      }])

    if (error) throw error
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
          Dodawaj nowe prompty do biblioteki
        </p>
      </div>

      {/* Message */}
      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="text" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm data-[state=active]:border-orange-200 data-[state=active]:border"
          >
            <FileText className="h-4 w-4" />
            Prompt tekstowy
          </TabsTrigger>
          <TabsTrigger 
            value="twitter" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm data-[state=active]:border-orange-200 data-[state=active]:border"
          >
            <Image className="h-4 w-4" />
            Z Twittera
          </TabsTrigger>
        </TabsList>

        {/* Tryb tekstowy */}
        <TabsContent value="text">
          <Card className="border-[color:var(--main-orange)]">
            <CardHeader>
              <CardTitle>Dodaj prompt tekstowy</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tytuł promptu *</Label>
                  <Input
                    id="title"
                    value={textData.title}
                    onChange={(e) => setTextData({ ...textData, title: e.target.value })}
                    placeholder="Wprowadź tytuł promptu..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Treść promptu (do kopiowania) *</Label>
                  <Textarea
                    id="content"
                    value={textData.content}
                    onChange={(e) => setTextData({ ...textData, content: e.target.value })}
                    placeholder="Wprowadź treść promptu, która będzie kopiowana..."
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={textData.author}
                    onChange={(e) => setTextData({ ...textData, author: e.target.value })}
                    placeholder="Wprowadź nazwę autora..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Typ</Label>
                  <Select value={textData.type} onValueChange={(value: 'text' | 'image') => setTextData({ ...textData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Tekstowy</SelectItem>
                      <SelectItem value="image">Graficzny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tagi</Label>
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
                  </div>
                  {textData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {textData.tags.map((tag, index) => (
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

        {/* Tryb Twitter */}
        <TabsContent value="twitter">
          <Card className="border-[color:var(--main-orange)]">
            <CardHeader>
              <CardTitle>Pobierz prompt z Twittera</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTwitterFetch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tweet_url">URL tweeta *</Label>
                  <Input
                    id="tweet_url"
                    type="url"
                    value={twitterData.tweet_url}
                    onChange={(e) => setTwitterData({ ...twitterData, tweet_url: e.target.value })}
                    placeholder="https://x.com/user/status/123456789 lub https://twitter.com/user/status/123456789"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Pobieranie..."
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Pobierz z Twittera
                    </>
                  )}
                </Button>
              </form>

              {/* Podgląd danych z Twittera */}
              {tweetInfo && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-semibold mb-3">Podgląd danych z X (Twitter):</h3>
                  
                  <div className="space-y-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter_title">Tytuł promptu</Label>
                      <Input
                        id="twitter_title"
                        value={twitterData.title}
                        onChange={(e) => setTwitterData({ ...twitterData, title: e.target.value })}
                        placeholder="Wprowadź tytuł promptu (opcjonalnie)..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter_author">Autor</Label>
                      <Input
                        id="twitter_author"
                        value={twitterData.author}
                        onChange={(e) => setTwitterData({ ...twitterData, author: e.target.value })}
                        placeholder="Wprowadź nazwę autora (opcjonalnie)..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p><strong>Treść:</strong> {tweetInfo.content}</p>
                    <p><strong>Tłumaczenie:</strong> {tweetInfo.content_pl}</p>
                    {tweetInfo.author && (
                      <p><strong>Autor z Twittera:</strong> {tweetInfo.author}</p>
                    )}
                    {tweetInfo.author_username && (
                      <p><strong>Username:</strong> @{tweetInfo.author_username}</p>
                    )}
                    {tweetInfo.tweet_id && (
                      <p><strong>Tweet ID:</strong> {tweetInfo.tweet_id}</p>
                    )}
                    {tweetInfo.created_at && (
                      <p><strong>Data utworzenia:</strong> {new Date(tweetInfo.created_at).toLocaleString('pl-PL')}</p>
                    )}
                    {tweetInfo.image_url && (
                      <div>
                        <p><strong>Obrazek:</strong></p>
                        <img 
                          src={tweetInfo.image_url} 
                          alt="Obrazek z tweeta" 
                          className="mt-2 max-w-full h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleTwitterSubmit}
                    className="mt-4 w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Zapisywanie..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Zapisz prompt z X (Twitter)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 