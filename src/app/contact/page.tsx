"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Check } from "lucide-react"
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
    
    // Symulacja wysłania formularza
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    trackContactForm()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: "Kontakt" }
        ]} 
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Kontakt</h1>
        <p className="text-muted-foreground">
          Masz pytania lub sugestie? Skontaktuj się z nami!
        </p>
      </div>

      {/* Contact Form */}
      <Card className="border-[color:var(--main-orange)] mb-8">
        <CardHeader>
          <CardTitle>Formularz kontaktowy</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4" />
              <AlertDescription>
                Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Imię i nazwisko *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Wprowadź swoje imię i nazwisko"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="twoj@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Temat *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Temat wiadomości"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Wiadomość *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Napisz swoją wiadomość..."
                  rows={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Wysyłanie..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Wyślij wiadomość
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Additional Contact Info */}
      <Card className="border-[color:var(--main-orange)]">
        <CardHeader>
          <CardTitle>Informacje kontaktowe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Email:</strong> kontakt@bibliotekapromptow.pl</p>
          <p><strong>Godziny pracy:</strong> Pon-Pt 9:00-17:00</p>
          <p><strong>Odpowiedź:</strong> W ciągu 24 godzin</p>
        </CardContent>
      </Card>
    </div>
  )
} 