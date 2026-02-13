import { CATEGORIES, Category } from './category-mapper';

/**
 * Konwertuje nazwę kategorii na slug URL
 * np. "Biznes i zarządzanie" → "biznes-i-zarzadzanie"
 */
export function categoryToSlug(category: Category): string {
  return category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Usuń znaki diakrytyczne
    .replace(/[^a-z0-9]+/g, '-') // Zamień wszystko co nie jest literą/cyfrą na myślnik
    .replace(/^-+|-+$/g, ''); // Usuń myślniki na początku i końcu
}

/**
 * Konwertuje slug URL na nazwę kategorii
 * np. "biznes-i-zarzadzanie" → "Biznes i zarządzanie"
 */
export function slugToCategory(slug: string): Category | null {
  const normalizedSlug = slug.toLowerCase().trim();
  
  // Znajdź kategorię która pasuje do slug
  for (const category of CATEGORIES) {
    if (categoryToSlug(category) === normalizedSlug) {
      return category;
    }
  }
  
  return null;
}

/**
 * Pobiera wszystkie slugi kategorii
 */
export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map(category => categoryToSlug(category));
}

/**
 * Opisy kategorii dla SEO
 */
export const categoryDescriptions: Record<Category, string> = {
  'Marketing i sprzedaż': 'Najlepsze prompty AI do marketingu i sprzedaży. Gotowe szablony promptów dla kampanii marketingowych, strategii sprzedażowych, lead generation i social media marketing.',
  'Copywriting i treści': 'Skuteczne prompty AI do copywritingu i tworzenia treści. Szablony promptów do artykułów, postów blogowych, opisów produktów i storytellingu.',
  'Programowanie i technologia': 'Profesjonalne prompty AI dla programistów. Gotowe szablony do kodowania, dokumentacji technicznej, rozwiązywania problemów i automatyzacji.',
  'Biznes i zarządzanie': 'Strategiczne prompty AI dla biznesu. Szablony do planowania, analiz biznesowych, zarządzania projektami i HR.',
  'Edukacja': 'Edukacyjne prompty AI dla nauczycieli i uczniów. Gotowe szablony do tworzenia materiałów edukacyjnych, planów lekcji i wyjaśnień.',
  'Kreatywne': 'Kreatywne prompty AI do designu i sztuki. Inspirujące szablony do generowania pomysłów, koncepcji designu i treści kreatywnych.',
  'Analiza i badania': 'Analityczne prompty AI do badań i analiz. Szablony do analizy danych, raportów, badań rynku i SEO.',
  'Inne': 'Różnorodne prompty AI do różnych zastosowań. Szablony promptów, które nie pasują do innych kategorii.'
};

/**
 * Słowa kluczowe dla SEO dla każdej kategorii
 */
export const categoryKeywords: Record<Category, string[]> = {
  'Marketing i sprzedaż': [
    'prompty marketing', 'prompty sprzedaż', 'prompty sales', 'prompty kampanie',
    'prompty social media', 'prompty reklama', 'prompty lead generation'
  ],
  'Copywriting i treści': [
    'prompty copywriting', 'prompty treści', 'prompty content', 'prompty artykuły',
    'prompty blog', 'prompty teksty', 'prompty storytelling'
  ],
  'Programowanie i technologia': [
    'prompty programowanie', 'prompty kod', 'prompty developer', 'prompty tech',
    'prompty api', 'prompty dokumentacja', 'prompty automatyzacja'
  ],
  'Biznes i zarządzanie': [
    'prompty biznes', 'prompty strategia', 'prompty zarządzanie', 'prompty planowanie',
    'prompty hr', 'prompty management', 'prompty projekt'
  ],
  'Edukacja': [
    'prompty edukacja', 'prompty nauka', 'prompty lekcje', 'prompty materiały',
    'prompty szkolenia', 'prompty tutorial', 'prompty nauczyciel'
  ],
  'Kreatywne': [
    'prompty kreatywne', 'prompty design', 'prompty sztuka', 'prompty inspiracje',
    'prompty pomysły', 'prompty koncepcje', 'prompty twórcze'
  ],
  'Analiza i badania': [
    'prompty analiza', 'prompty badania', 'prompty dane', 'prompty raporty',
    'prompty seo', 'prompty statystyki', 'prompty analytics'
  ],
  'Inne': [
    'prompty różne', 'prompty inne', 'prompty różnorodne'
  ]
};
