/**
 * Mapuje tagi promptów na kategorie
 */

export const CATEGORIES = [
  'Marketing i sprzedaż',
  'Copywriting i treści',
  'Programowanie i technologia',
  'Biznes i zarządzanie',
  'Edukacja',
  'Kreatywne',
  'Analiza i badania',
  'Inne'
] as const;

export type Category = typeof CATEGORIES[number];

// Mapowanie słów kluczowych na kategorie
const categoryKeywords: Record<Category, string[]> = {
  'Marketing i sprzedaż': [
    'marketing', 'sprzedaż', 'sales', 'lead', 'campaign', 'advertising',
    'advert', 'promocja', 'promotion', 'brand', 'marka', 'klient', 'customer',
    'sprzedawca', 'seller', 'reklama', 'ad', 'social media', 'socialmedia',
    'facebook', 'instagram', 'linkedin', 'twitter', 'x', 'tiktok'
  ],
  'Copywriting i treści': [
    'copywriting', 'treści', 'content', 'article', 'blog', 'text', 'tekst',
    'pisanie', 'writing', 'post', 'wpis', 'artykuł', 'opis', 'description',
    'storytelling', 'story', 'narratywa', 'narrative', 'headline', 'nagłówek'
  ],
  'Programowanie i technologia': [
    'code', 'programming', 'developer', 'tech', 'technical', 'api', 'kod',
    'programowanie', 'programista', 'software', 'app', 'aplikacja', 'web',
    'website', 'strona', 'frontend', 'backend', 'fullstack', 'javascript',
    'typescript', 'python', 'react', 'next', 'node', 'database', 'baza danych'
  ],
  'Biznes i zarządzanie': [
    'biznes', 'business', 'strategy', 'plan', 'management', 'hr', 'zarządzanie',
    'strategia', 'planowanie', 'plan', 'firma', 'company', 'startup', 'przedsiębiorstwo',
    'projekt', 'project', 'team', 'zespół', 'meeting', 'spotkanie', 'raport', 'report'
  ],
  'Edukacja': [
    'education', 'edukacja', 'learn', 'teaching', 'course', 'tutorial', 'nauka',
    'uczenie', 'szkolenie', 'training', 'lekcja', 'lesson', 'materiał', 'material',
    'podręcznik', 'textbook', 'student', 'uczeń', 'nauczyciel', 'teacher'
  ],
  'Kreatywne': [
    'creative', 'design', 'story', 'writing', 'art', 'inspiration', 'kreatywne',
    'kreatywność', 'design', 'projektowanie', 'grafika', 'graphic', 'ilustracja',
    'illustration', 'pomysł', 'idea', 'koncepcja', 'concept', 'twórcze'
  ],
  'Analiza i badania': [
    'analysis', 'analiza', 'data', 'research', 'report', 'seo', 'badania',
    'raport', 'dane', 'statystyka', 'statistics', 'metrics', 'metryki',
    'analytics', 'analityka', 'badanie', 'study', 'wyniki', 'results'
  ],
  'Inne': []
};

/**
 * Mapuje tablicę tagów na kategorię na podstawie słów kluczowych
 * @param tags - Tablica tagów promptu
 * @returns Nazwa kategorii
 */
export function mapTagsToCategory(tags: string[]): Category {
  if (!tags || tags.length === 0) {
    return 'Inne';
  }

  // Konwertuj wszystkie tagi na małe litery dla porównania
  const lowerTags = tags.map(tag => tag.toLowerCase().trim());

  // Sprawdź każdą kategorię (oprócz 'Inne')
  const categoriesToCheck: Category[] = [
    'Marketing i sprzedaż',
    'Copywriting i treści',
    'Programowanie i technologia',
    'Biznes i zarządzanie',
    'Edukacja',
    'Kreatywne',
    'Analiza i badania'
  ];

  // Znajdź pierwszą kategorię, której słowa kluczowe pasują do tagów
  for (const category of categoriesToCheck) {
    const keywords = categoryKeywords[category];
    const hasMatch = keywords.some(keyword => 
      lowerTags.some(tag => tag.includes(keyword) || keyword.includes(tag))
    );
    
    if (hasMatch) {
      return category;
    }
  }

  // Jeśli żadna kategoria nie pasuje, zwróć 'Inne'
  return 'Inne';
}
