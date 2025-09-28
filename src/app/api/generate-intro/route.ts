import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicjalizacja klienta Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

/**
 * Generuje wstęp do promptu w stylu posta blogowego
 * Jeśli tytuł nie jest podany, model ma zaproponować krótki tytuł na podstawie treści.
 */
async function generateIntroduction(title: string | undefined, content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

         const prompt = `
Na podstawie podanego tytułu i treści promptu, wygeneruj atrakcyjny wstęp w stylu posta blogowego.

STRUKTURA WSTĘPU:
1. Emoji + tytuł (np. 🏃‍♂️ Stwórz swój plan biegowy z AI)
2. 2-3 zdania opisujące problem i korzyści z użycia promptu
3. Zdanie zachęcające do użycia promptu

WYMAGANIA JĘZYKOWE:
- CAŁY WSTĘP MUSI BYĆ NAPISANY PO POLSKU
- Użyj polskich słów i zwrotów
- Nawet jeśli tytuł lub treść promptu są po angielsku, wstęp opisz po polsku

POZOSTAŁE WYMAGANIA:
- Użyj odpowiedniego emoji na początku
- Ton przyjazny i zachęcający
- Podkreśl  efektywność promptu
- NIE DODAWAJ sekcji "💡 Prompt:" ani oryginalnej treści promptu
- NIE DODAWAJ żadnych dodatkowych komentarzy
- Wstęp ma być samodzielny i kompletny
 - Jeśli tytuł nie jest podany, samodzielnie zaproponuj krótki, zwięzły tytuł na podstawie treści

DANE WEJŚCIOWE:
Tytuł: ${title && title.trim().length > 0 ? title : '(brak — wygeneruj krótki tytuł na podstawie treści)'}
Treść promptu: ${content}

Wygeneruj tylko wstęp po polsku (bez tytułu ani promptu):
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const introduction = response.text();

    return introduction.trim();
  } catch (error) {
    console.error('Błąd podczas generowania wstępu z Gemini:', error);
    // Fallback - podstawowy wstęp
    return `🤖 ${title}

Skorzystaj z AI, aby szybko uzyskać spersonalizowane rozwiązanie. Poniższy prompt pomoże Ci osiągnąć pożądane rezultaty w kilka minut.

Wystarczy skopiować prompt poniżej i wkleić go do ChatGPT lub innego narzędzia AI.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Akceptujemy równoważne pola: content | description | prompt
    const title: string | undefined = typeof body.title === 'string' ? body.title : undefined
    const contentCandidates = [body.content, body.description, body.prompt]
    const content = contentCandidates.find((c: unknown) => typeof c === 'string' && c.trim().length > 0) as string | undefined
    
    console.log('🔄 Generate-intro API otrzymał:', { title, content })
    
    if (!content) {
      console.log('❌ Brak treści (content/description/prompt)')
      return NextResponse.json(
        { error: "Treść promptu jest wymagana (content/description/prompt)" },
        { status: 400 }
      )
    }

    console.log('🤖 Generuję wstęp z Gemini...')
    const introduction = await generateIntroduction(title, content)
    console.log('✅ Wygenerowany wstęp:', introduction.substring(0, 100) + '...')

    return NextResponse.json({ 
      introduction,
      title: title || null,
      content
    })
    
  } catch (error) {
    console.error('❌ Error generating introduction:', error)
    return NextResponse.json(
      { error: `Błąd podczas generowania wstępu: ${error instanceof Error ? error.message : 'Nieznany błąd'}` },
      { status: 500 }
    )
  }
}