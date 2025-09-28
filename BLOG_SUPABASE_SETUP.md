# Integracja bloga z Supabase

## Instrukcja konfiguracji

### 1. Konfiguracja Supabase

1. **Utwórz projekt w Supabase:**
   - Przejdź na [supabase.com](https://supabase.com)
   - Utwórz nowy projekt
   - Skopiuj URL projektu i klucz anonimowy

2. **Skonfiguruj zmienne środowiskowe:**
   Utwórz plik `.env.local` w głównym katalogu projektu z następującą zawartością:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=twoj_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_supabase_anon_key
   ```

   Przykład:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 2. Konfiguracja bazy danych

1. **Uruchom zapytania SQL:**
   - Przejdź do SQL Editor w dashboard Supabase
   - Skopiuj i uruchom zawartość pliku `supabase-blog-setup.sql`
   - To utworzy tabelę `blog_posts` z przykładowymi danymi

2. **Sprawdź uprawnienia (opcjonalnie):**
   - Jeśli chcesz ograniczyć dostęp, możesz włączyć Row Level Security (RLS)
   - Odkomentuj odpowiednie linie w pliku SQL

### 3. Struktura tabeli blog_posts

Tabela zawiera następujące pola:

- `id` - unikalny identyfikator (SERIAL PRIMARY KEY)
- `title` - tytuł artykułu (VARCHAR)
- `slug` - URL-friendly wersja tytułu (VARCHAR, UNIQUE)
- `excerpt` - krótki opis artykułu (TEXT)
- `content` - pełna zawartość artykułu (TEXT)
- `author` - autor artykułu (VARCHAR)
- `published_at` - data publikacji (TIMESTAMP)
- `updated_at` - data ostatniej aktualizacji (TIMESTAMP)
- `read_time` - szacowany czas czytania w minutach (INTEGER)
- `category` - kategoria artykułu (VARCHAR)
- `featured_image` - URL do obrazu głównego (VARCHAR)
- `is_published` - czy artykuł jest opublikowany (BOOLEAN)
- `meta_title` - tytuł SEO (VARCHAR)
- `meta_description` - opis SEO (TEXT)
- `tags` - tablica tagów (TEXT[])
- `view_count` - licznik wyświetleń (INTEGER)
- `created_at` - data utworzenia (TIMESTAMP)

### 4. Nowe funkcjonalności

#### Dostępne funkcje w `/src/lib/blog.ts`:

- `getBlogPosts(filters)` - pobiera listę postów z opcjonalnymi filtrami
- `getBlogPostBySlug(slug)` - pobiera pojedynczy post po slug
- `getBlogPostById(id)` - pobiera pojedynczy post po ID
- `getRelatedBlogPosts()` - pobiera powiązane posty
- `getBlogStats()` - pobiera statystyki bloga
- `incrementBlogPostViews(id)` - zwiększa licznik wyświetleń
- `getBlogCategories()` - pobiera wszystkie kategorie
- `getBlogTags()` - pobiera wszystkie tagi

#### Nowe komponenty:

- `BlogLoadingSkeleton` - skeleton loading dla listy postów
- `BlogPostLoadingSkeleton` - skeleton loading dla pojedynczego posta
- `BlogError` - komponent błędu dla bloga
- `BlogNotFoundError` - błąd 404 dla nieistniejących postów

### 5. Nowa struktura routingu

- `/blog` - lista wszystkich postów
- `/blog/[slug]` - pojedynczy post (używa slug zamiast ID)

### 6. Dodawanie nowych postów

Aby dodać nowy post, możesz:

1. **Użyć SQL:**
   ```sql
   INSERT INTO blog_posts (title, slug, excerpt, content, author, category, tags)
   VALUES (
     'Tytuł artykułu',
     'tytul-artykulu',
     'Krótki opis...',
     'Pełna zawartość artykułu...',
     'Autor',
     'Kategoria',
     ARRAY['tag1', 'tag2']
   );
   ```

2. **Użyć Supabase Dashboard:**
   - Przejdź do Table Editor
   - Wybierz tabelę `blog_posts`
   - Dodaj nowy rekord

3. **Utworzyć panel administracyjny** (możliwy przyszły rozwój)

### 7. SEO i Meta dane

Każdy post może mieć własne meta dane:
- `meta_title` - tytuł SEO
- `meta_description` - opis SEO
- `tags` - słowa kluczowe

### 8. Filtrowanie i wyszukiwanie

Funkcja `getBlogPosts()` obsługuje następujące filtry:
- `category` - filtrowanie po kategorii
- `tag` - filtrowanie po tagu
- `search` - wyszukiwanie w tytule i opisie
- `limit` - ograniczenie liczby wyników
- `offset` - paginacja

### 9. Rozwiązywanie problemów

#### Błąd: "Nie udało się pobrać postów bloga"
- Sprawdź czy zmienne środowiskowe są poprawnie ustawione
- Sprawdź czy tabela `blog_posts` istnieje w Supabase
- Sprawdź czy masz odpowiednie uprawnienia do bazy danych

#### Błąd: "Post nie znaleziony"
- Sprawdź czy slug w URL jest poprawny
- Sprawdź czy post jest oznaczony jako `is_published = true`

#### Problemy z ładowaniem
- Sprawdź połączenie internetowe
- Sprawdź czy Supabase jest dostępne
- Sprawdź logi w konsoli przeglądarki

### 10. Formatowanie tekstu (Markdown)

Blog obsługuje pełne formatowanie Markdown, w tym:

#### Podstawowe elementy:
- **Nagłówki** (H1-H6)
- **Tekst** (pogrubienie, kursywa, przekreślenie)
- **Listy** (uporządkowane i nieuporządkowane)
- **Linki i obrazy**
- **Cytaty**
- **Kod** (inline i bloki z podświetlaniem składni)
- **Tabele**
- **Linie poziome**

#### Zaawansowane funkcje:
- **Podświetlanie składni** dla 20+ języków programowania
- **Tabele z wyrównaniem**
- **Listy zadań** (checklist)
- **Przypisy**
- **Bloki informacyjne** (info, warning, success, error)

#### Przykład użycia:

```markdown
# Tytuł artykułu

## Wprowadzenie

**Pogrubiony tekst** i *tekst kursywą*.

### Kod JavaScript

```javascript
function hello() {
  console.log("Hello, World!");
}
```

### Tabela porównawcza

| Funkcja | Opis | Status |
|---------|------|--------|
| Markdown | Pełne wsparcie | ✅ |
| SEO | Optymalizacja | ✅ |

> **Info**  
> Więcej informacji znajdziesz w przewodniku Markdown.
```

Szczegółowy przewodnik: [BLOG_MARKDOWN_GUIDE.md](./BLOG_MARKDOWN_GUIDE.md)

### 11. Następne kroki

Możliwe rozszerzenia:
- Panel administracyjny do zarządzania postami
- System komentarzy
- Wyszukiwarka z zaawansowanymi filtrami
- System kategorii i tagów z dedykowanymi stronami
- RSS feed
- System newslettera związanego z blogiem
- Analiza statystyk czytelnictwa
- Edytor Markdown z podglądem na żywo
