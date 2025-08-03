import { NextRequest, NextResponse } from "next/server"
import { translateText } from "@/lib/translate"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Tekst jest wymagany" },
        { status: 400 }
      )
    }

    const translatedText = await translateText(text)

    return NextResponse.json({ 
      translatedText,
      originalText: text 
    })
    
  } catch (error) {
    console.error('Error translating text:', error)
    
    // Sprawdź czy to błąd rate limit (429)
    if (error instanceof Error && error.message.includes('429')) {
      return NextResponse.json(
        { 
          error: "Przekroczono dzienny limit zapytań do Google Gemini API. Spróbuj ponownie za godzinę.",
          details: "Darmowy plan: 50 requestów/dzień.",
          retryAfter: 3600
        },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: `Błąd podczas tłumaczenia: ${error instanceof Error ? error.message : 'Nieznany błąd'}` },
      { status: 500 }
    )
  }
}