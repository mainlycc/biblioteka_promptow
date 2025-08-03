import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicjalizacja klienta Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

/**
 * Tłumaczy tekst na język polski używając Gemini API
 * @param text - Tekst do przetłumaczenia
 * @returns Przetłumaczony tekst w języku polskim
 */
export async function translateToPolish(text: string): Promise<string> {
  try {
    if (!text || text.trim().length === 0) {
      return text;
    }

    // Jeśli tekst jest już po polsku (zawiera polskie znaki), zwróć go bez zmian
    const polishChars = /[ąćęłńóśźż]/i;
    if (polishChars.test(text)) {
      return text;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Przetłumacz następujący tekst na język polski. 
Jeśli tekst jest już po polsku, zwróć go bez zmian.
Jeśli to jest prompt dla AI, zachowaj jego strukturę i format, ale przetłumacz opisy i instrukcje.
Nie dodawaj żadnych dodatkowych komentarzy, zwróć tylko przetłumaczony tekst.

Tekst do przetłumaczenia:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    return translatedText.trim();
  } catch (error) {
    console.error('Błąd podczas tłumaczenia z Gemini:', error);
    // Fallback - zwróć oryginalny tekst z prefiksem [PL]
    return `[PL] ${text}`;
  }
}

/**
 * Funkcja pomocnicza dla zachowania kompatybilności z istniejącym kodem
 * @param text - Tekst do przetłumaczenia
 * @returns Przetłumaczony tekst
 */
export async function translateText(text: string): Promise<string> {
  return translateToPolish(text);
}