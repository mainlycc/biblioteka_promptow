# Instrukcja dodania kategorii do promptów

## Krok 1: Dodanie kolumny do bazy danych

Uruchom następujące zapytanie SQL w Supabase Dashboard (SQL Editor):

```sql
-- Dodanie kolumny category do tabeli prompts
ALTER TABLE prompts 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Inne';

-- Utworzenie indeksu dla lepszej wydajności filtrowania
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
```

Lub użyj pliku: `supabase-add-category-column.sql`

## Krok 2: Kategoryzacja istniejących promptów

Po dodaniu kolumny do bazy danych, uruchom endpoint API aby automatycznie przypisać kategorie do istniejących promptów:

1. Uruchom aplikację w trybie deweloperskim
2. Otwórz w przeglądarce: `http://localhost:3000/api/categorize-prompts`
3. Endpoint automatycznie:
   - Pobierze wszystkie prompty tekstowe
   - Przypisze kategorie na podstawie tagów
   - Zaktualizuje bazę danych

Alternatywnie możesz użyć curl:
```bash
curl http://localhost:3000/api/categorize-prompts
```

## Kategorie

System używa następujących kategorii:
1. Marketing i sprzedaż
2. Copywriting i treści
3. Programowanie i technologia
4. Biznes i zarządzanie
5. Edukacja
6. Kreatywne
7. Analiza i badania
8. Inne (domyślna)

## Funkcjonalności

### Nawigacja
- Po najechaniu na "Prompty tekstowe" w nawigacji pojawia się dropdown z kategoriami
- Każda kategoria linkuje do dedykowanej podstrony `/prompty/[kategoria-slug]`
- Przykłady URL-i:
  - `/prompty/biznes-i-zarzadzanie`
  - `/prompty/marketing-i-sprzedaz`
  - `/prompty/copywriting-i-tresci`

### Dedykowane podstrony kategorii (SEO)
- Każda kategoria ma własną podstronę z unikalnym URL-em
- Każda podstrona ma dedykowane meta tagi (title, description, keywords)
- Podstrony są automatycznie dodawane do sitemap.xml
- Lepsze indeksowanie przez Google dzięki dedykowanym URL-om

### Kompatybilność wsteczna
- Stare linki z parametrem `?category=...` są automatycznie przekierowywane na dedykowane podstrony
- Wsparcie dla zarówno slugów jak i pełnych nazw kategorii w parametrach

### Panel admina
- Pole wyboru kategorii przy tworzeniu/edytowaniu promptu
- Automatyczne sugerowanie kategorii na podstawie tagów
- Kategoria jest automatycznie przypisywana przy dodawaniu tagów

### Wyświetlanie
- Kategoria wyświetlana jako badge na kartach promptów (pomarańczowy kolor)
- Kategoria wyświetlana na stronie szczegółów promptu (przed tagami)

## Mapowanie tagów na kategorie

Funkcja `mapTagsToCategory` w `lib/category-mapper.ts` automatycznie przypisuje kategorie na podstawie słów kluczowych w tagach:

- **Marketing i sprzedaż**: marketing, sprzedaż, sales, lead, campaign, advertising, etc.
- **Copywriting i treści**: copywriting, treści, content, article, blog, text, etc.
- **Programowanie i technologia**: code, programming, developer, tech, technical, api, etc.
- **Biznes i zarządzanie**: biznes, business, strategy, plan, management, hr, etc.
- **Edukacja**: education, edukacja, learn, teaching, course, tutorial, etc.
- **Kreatywne**: creative, design, story, writing, art, inspiration, etc.
- **Analiza i badania**: analysis, analiza, data, research, report, seo, etc.
- **Inne**: domyślna kategoria dla promptów, które nie pasują do powyższych

## Weryfikacja

Po uruchomieniu migracji sprawdź:
1. Czy kolumna `category` istnieje w tabeli `prompts` w Supabase
2. Czy istniejące prompty mają przypisane kategorie (nie wszystkie powinny mieć "Inne")
3. Czy dropdown w nawigacji działa poprawnie
4. Czy filtrowanie po kategorii działa na `/prompty?category=...`
5. Czy nowe prompty automatycznie otrzymują kategorię w panelu admina
