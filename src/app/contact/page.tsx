"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Send, Check, Mail, Clock, MessageSquare, MapPin } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { trackContactForm } from "@/components/google-analytics"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas wysyłania wiadomości')
      }

      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      trackContactForm()
    } catch (error) {
      console.error('Błąd wysyłania formularza:', error)
      alert(error instanceof Error ? error.message : 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: "Kontakt" }
        ]} 
      />

      {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
            <MessageSquare className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            Skontaktuj się z nami
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Masz pytania, sugestie lub chcesz współpracować? Jesteśmy tutaj, aby Ci pomóc!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                  <Mail className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-orange-600 font-semibold">bibliotekapromptow@gmail.com</p>
                <p className="text-sm text-gray-500 mt-2">Odpowiemy w ciągu 24 godzin</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Godziny pracy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-800 font-semibold">Poniedziałek - Piątek</p>
                <p className="text-orange-600 font-semibold">9:00 - 17:00</p>
                <p className="text-sm text-gray-500 mt-2">Weekendy: zamknięte</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Lokalizacja</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-800 font-semibold">Polska</p>
                <p className="text-sm text-gray-500 mt-2">Online - dostępne 24/7</p>
              </CardContent>
            </Card>
      </div>

      {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-orange-200 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Formularz kontaktowy</CardTitle>
                <p className="text-gray-600">Wypełnij formularz, a my skontaktujemy się z Tobą</p>
        </CardHeader>
              <CardContent className="p-8">
          {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-4">Wiadomość wysłana!</h3>
                    <p className="text-gray-600 text-lg">
                      Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                          Imię i nazwisko *
                        </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Wprowadź swoje imię i nazwisko"
                          className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                          Email *
                        </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="twoj@email.com"
                          className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
              
                    <div className="space-y-3">
                      <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">
                        Temat *
                      </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Temat wiadomości"
                        className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                        Wiadomość *
                      </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Napisz swoją wiadomość..."
                        rows={8}
                        className="border-orange-200 focus:border-orange-500 focus:ring-orange-500 resize-none"
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
                          Wysyłanie...
                        </div>
                ) : (
                  <>
                          <Send className="h-5 w-5 mr-3" />
                    Wyślij wiadomość
                  </>
                )}
              </Button>
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