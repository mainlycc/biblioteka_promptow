"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Check, Bell, Clock, Star, Zap, Shield, Users, TrendingUp } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Navigation */}
        <div className="mb-8">
        <Link
          href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Powrót do strony głównej
        </Link>
      </div>

      {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg">
            <Bell className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            Dołącz do naszego newslettera
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Otrzymuj najlepsze prompty co tydzień prosto na swoją skrzynkę email. 
            Bądź na bieżąco z najnowszymi trendami w świecie AI.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
              <div className="text-sm text-gray-600">Subskrybentów</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Promptów tygodniowo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
              <div className="text-sm text-gray-600">Ocena subskrybentów</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits Section */}
          <div className="space-y-8">
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Co otrzymasz w każdym newsletterze</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Najlepsze prompty tygodnia</h4>
                    <p className="text-sm text-gray-600">Sprawdzone i przetestowane prompty, które działają</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Porady i wskazówki</h4>
                    <p className="text-sm text-gray-600">Eksperckie porady jak pisać lepsze prompty</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Nowości ze świata AI</h4>
                    <p className="text-sm text-gray-600">Najnowsze informacje o narzędziach i trendach</p>
        </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Ekskluzywne treści</h4>
                    <p className="text-sm text-gray-600">Materiały dostępne tylko dla subskrybentów</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Dlaczego warto?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Oszczędzasz czas - nie musisz szukać najlepszych promptów</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Zawsze na bieżąco z najnowszymi trendami</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Newsletter wysyłamy co tydzień</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Możesz się wypisać w każdej chwili</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-700">Nie spamujemy - tylko wartościowe treści</p>
                </div>
              </CardContent>
            </Card>
      </div>

      {/* Newsletter Form */}
          <div className="lg:col-span-1">
            <Card className="border-orange-200 bg-white/90 backdrop-blur-sm shadow-xl sticky top-8">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Zapisz się teraz</CardTitle>
                <p className="text-gray-600">Dołącz do grona zadowolonych subskrybentów</p>
        </CardHeader>
              <CardContent className="p-8">
          {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-4">Zapisano pomyślnie!</h3>
                    <p className="text-gray-600 text-lg mb-4">
                      Dziękujemy za zapisanie się do newslettera!
                    </p>
                    <p className="text-sm text-gray-500">
                      Pierwszy email otrzymasz już w przyszłym tygodniu.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Adres email *
                      </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                        className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500 text-base"
                />
              </div>
              
              <Button 
                type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Zapisywanie...
                        </div>
                ) : (
                  <>
                          <Mail className="h-5 w-5 mr-3" />
                    Zapisz się do newslettera
                  </>
                )}
              </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Zapisz się i otrzymuj najlepsze prompty co tydzień. 
                      Możesz się wypisać w każdej chwili.
                    </p>
            </form>
          )}
        </CardContent>
      </Card>
            </div>
            </div>
      </div>
    </div>
  )
} 