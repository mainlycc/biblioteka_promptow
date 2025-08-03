import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content } = body
    
    if (!title && !content) {
      return NextResponse.json(
        { error: "Tytuł lub treść są wymagane" },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
Przeanalizuj następujący prompt AI i wygeneruj 4-6 tematycznych tagów w języku polskim.

Tytuł: ${title || 'Brak tytułu'}
Treść: ${content || 'Brak treści'}

ZASADY:
- Wygeneruj tylko polskie słowa/frazy jako tagi
- Bez znaku # na początku
- Tagi powinny odzwierciedlać główne tematy i kategorie
- Przykłady dobrych tagów: psychologia, ai, samodyscyplina, biznes, marketing, rozwój osobisty, technologia, kreatywność, produktywność, coaching, nauka, analiza
- Zwróć tylko listę tagów oddzielonych przecinkami
- Maksymalnie 6 tagów
- Używaj pojedynczych słów lub krótkich fraz (max 2 słowa)

Tagi:`;

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parsuj odpowiedź i wyczyść tagi
    const tags = text
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length < 30)
      .slice(0, 6) // Maksymalnie 6 tagów

    return NextResponse.json({ 
      tags,
      originalPrompt: { title, content }
    })
    
  } catch (error) {
    console.error('Error generating tags:', error)
    
    // Sprawdź czy to błąd rate limit (429)
    if (error instanceof Error && error.message.includes('429')) {
      return NextResponse.json(
        { 
          error: "Przekroczono dzienny limit zapytań do Google Gemini API. Spróbuj ponownie za godzinę lub sprawdź swój plan w Google AI Studio.",
          details: "Darmowy plan: 50 requestów/dzień. Możesz poczekać lub przejść na płatny plan.",
          retryAfter: 3600 // 1 godzina
        },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: `Błąd podczas generowania tagów: ${error instanceof Error ? error.message : 'Nieznany błąd'}` },
      { status: 500 }
    )
  }
}