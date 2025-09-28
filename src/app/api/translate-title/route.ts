import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicjalizacja klienta Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

/**
 * Specjalna funkcja do tłumaczenia tytułów - bardziej agresywna niż standardowa
 */
async function translateTitleToPolish(text: string): Promise<string> {
  try {
    if (!text || text.trim().length === 0) {
      return text;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Przetłumacz następujący tytuł promptu na język polski. 
ZAWSZE tłumacz, nawet jeśli tekst już zawiera polskie znaki.
Zachowaj krótką i zwięzłą formę tytułu.
Nie dodawaj żadnych dodatkowych komentarzy, zwróć tylko przetłumaczony tytuł.
Nie dawaj słów typu GPT-4 albo GPT 
Tytuł do przetłumaczenia:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    return translatedText.trim();
  } catch (error) {
    console.error('Błąd podczas tłumaczenia tytułu z Gemini:', error);
    // Fallback - zwróć oryginalny tekst z prefiksem [PL]
    return `[PL] ${text}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body
    
    console.log('🔄 Translate-title API otrzymał tekst:', text)
    
    if (!text || typeof text !== 'string') {
      console.log('❌ Brak tekstu lub nieprawidłowy typ')
      return NextResponse.json(
        { error: "Tekst jest wymagany" },
        { status: 400 }
      )
    }

    console.log('🤖 Wywołuję tłumaczenie z Gemini...')
    const translatedText = await translateTitleToPolish(text)
    console.log('✅ Otrzymane tłumaczenie:', translatedText)

    return NextResponse.json({ 
      translatedText,
      originalText: text 
    })
    
  } catch (error) {
    console.error('❌ Error translating title:', error)
    return NextResponse.json(
      { error: `Błąd podczas tłumaczenia: ${error instanceof Error ? error.message : 'Nieznany błąd'}` },
      { status: 500 }
    )
  }
}