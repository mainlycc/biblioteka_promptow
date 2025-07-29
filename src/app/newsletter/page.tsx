"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Check, Bell } from "lucide-react"
import Link from "next/link"

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Symulacja zapisania do newslettera
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setEmail("")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
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
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-full">
            <Bell className="h-6 w-6 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold">Zapisz się do newslettera</h1>
        </div>
        <p className="text-muted-foreground mb-4">
          Otrzymuj najlepsze prompty co tydzień prosto na swoją skrzynkę email
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
          <p className="font-medium mb-2">Co otrzymasz w każdym newsletterze:</p>
          <ul className="space-y-1">
            <li>• Najlepsze prompty tygodnia</li>
            <li>• Porady i wskazówki</li>
            <li>• Nowości ze świata AI</li>
            <li>• Ekskluzywne treści</li>
          </ul>
        </div>
      </div>

      {/* Newsletter Form */}
      <Card className="border-[color:var(--main-orange)] mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Zapisz się teraz
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4" />
              <AlertDescription>
                Dziękujemy za zapisanie się do newslettera! Pierwszy email otrzymasz już w przyszłym tygodniu.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adres email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                  className="text-base"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  "Zapisywanie..."
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Zapisz się do newslettera
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[color:var(--main-orange)]">
          <CardHeader>
            <CardTitle>Dlaczego warto?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Oszczędzasz czas - nie musisz szukać najlepszych promptów</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Zawsze na bieżąco z najnowszymi trendami</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Ekskluzywne treści tylko dla subskrybentów</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[color:var(--main-orange)]">
          <CardHeader>
            <CardTitle>Częstotliwość</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Newsletter wysyłamy co tydzień</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Możesz się wypisać w każdej chwili</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Nie spamujemy - tylko wartościowe treści</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 