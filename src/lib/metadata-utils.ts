/**
 * Funkcje pomocnicze do walidacji i formatowania metadanych SEO
 */

/**
 * Przycina tytuł do maksymalnej długości 60 znaków (optymalna długość dla SEO)
 * @param title - Tytuł do przycięcia
 * @param suffix - Opcjonalny sufiks (np. " - Biblioteka Promptów")
 * @returns Przycięty tytuł
 */
export function truncateTitle(title: string, suffix?: string): string {
  const maxLength = 60;
  const suffixLength = suffix ? suffix.length : 0;
  const availableLength = maxLength - suffixLength;
  
  if (title.length <= availableLength) {
    return suffix ? `${title}${suffix}` : title;
  }
  
  // Przycinamy tytuł i dodajemy "..."
  const truncated = title.substring(0, availableLength - 3).trim();
  return suffix ? `${truncated}...${suffix}` : `${truncated}...`;
}

/**
 * Formatuje meta description do optymalnej długości (120-160 znaków)
 * @param description - Opis do sformatowania
 * @param minLength - Minimalna długość (domyślnie 120)
 * @param maxLength - Maksymalna długość (domyślnie 160)
 * @returns Sformatowany opis
 */
export function formatMetaDescription(
  description: string,
  minLength: number = 120,
  maxLength: number = 160
): string {
  if (!description) {
    return '';
  }

  // Usuwamy białe znaki i nowe linie
  const cleaned = description.trim().replace(/\s+/g, ' ');

  // Jeśli opis jest za krótki, zwracamy go bez zmian (chyba że jest pusty)
  if (cleaned.length < minLength) {
    return cleaned || '';
  }

  // Jeśli opis jest w odpowiednim zakresie, zwracamy go
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Przycinamy do maxLength, ale staramy się nie przecinać słów
  const truncated = cleaned.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    // Jeśli ostatnia spacja jest w rozsądnej odległości, przecinamy tam
    return truncated.substring(0, lastSpace) + '...';
  }
  
  // W przeciwnym razie przecinamy na maxLength
  return truncated + '...';
}

/**
 * Sprawdza czy URL obrazu jest prawidłowy
 * @param imageUrl - URL obrazu do sprawdzenia
 * @returns true jeśli URL wygląda na prawidłowy
 */
export function isValidImageUrl(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) {
    return false;
  }

  // Sprawdzamy czy URL zaczyna się od http/https lub jest ścieżką względną
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      new URL(imageUrl);
      return true;
    } catch {
      return false;
    }
  }

  // Ścieżki względne są OK
  if (imageUrl.startsWith('/')) {
    return true;
  }

  return false;
}

/**
 * Tworzy bezpieczny alt text dla obrazu
 * @param promptTitle - Tytuł promptu
 * @param index - Indeks obrazu (opcjonalny)
 * @param defaultText - Domyślny tekst (opcjonalny)
 * @returns Alt text
 */
export function createImageAltText(
  promptTitle: string,
  index?: number,
  defaultText?: string
): string {
  if (defaultText) {
    return defaultText;
  }

  const titlePart = promptTitle.length > 50 
    ? promptTitle.substring(0, 50) + '...' 
    : promptTitle;

  if (index !== undefined) {
    return `${titlePart} - przykład ${index + 1}`;
  }

  return titlePart;
}

