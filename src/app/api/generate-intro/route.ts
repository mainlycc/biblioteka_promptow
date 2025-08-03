import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicjalizacja klienta Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

/**
 * Generuje wstęp do promptu w stylu posta blogowego
 */
async function generateIntroduction(title: string, content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

         const prompt = `
Na podstawie podanego tytułu i treści promptu, wygeneruj atrakcyjny wstęp w stylu posta blogowego.

STRUKTURA WSTĘPU:
1. Emoji + tytuł (np. 🏃‍♂️ Stwórz swój plan biegowy z AI)
2. 2-3 zdania opisujące problem i korzyści z użycia AI
3. Zdanie zachęcające do użycia promptu

WYMAGANIA JĘZYKOWE:
- CAŁY WSTĘP MUSI BYĆ NAPISANY PO POLSKU
- Użyj polskich słów i zwrotów
- Nawet jeśli tytuł lub treść promptu są po angielsku, wstęp opisz po polsku

POZOSTAŁE WYMAGANIA:
- Użyj odpowiedniego emoji na początku
- Ton przyjazny i zachęcający
- Podkreśl szybkość i efektywność AI
- NIE DODAWAJ sekcji "💡 Prompt:" ani oryginalnej treści promptu
- NIE DODAWAJ żadnych dodatkowych komentarzy
- Wstęp ma być samodzielny i kompletny

DANE WEJŚCIOWE:
Tytuł: ${title}
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
    const { title, content } = body
    
    console.log('🔄 Generate-intro API otrzymał:', { title, content })
    
    if (!title || !content || typeof title !== 'string' || typeof content !== 'string') {
      console.log('❌ Brak tytułu lub treści')
      return NextResponse.json(
        { error: "Tytuł i treść są wymagane" },
        { status: 400 }
      )
    }

    console.log('🤖 Generuję wstęp z Gemini...')
    const introduction = await generateIntroduction(title, content)
    console.log('✅ Wygenerowany wstęp:', introduction.substring(0, 100) + '...')

    return NextResponse.json({ 
      introduction,
      title,
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