# Przewodnik po Generatorze Bloga w Panelu Admin

## Wprowadzenie

Generator Bloga został zintegrowany z panelem administratora, umożliwiając łatwe tworzenie i zarządzanie artykułami bloga bezpośrednio z interfejsu webowego.

## Dostęp do Generatora

1. **Przejdź do panelu administratora**: `/admin`
2. **Zaloguj się** używając danych:
   - Login: `admin`
   - Hasło: `prompty2024`
3. **Wybierz zakładkę "Blog"** w głównym menu

## Funkcjonalności Generatora

### 📝 Tworzenie Artykułu

#### Podstawowe informacje:
- **Tytuł artykułu** - główny tytuł posta
- **Slug** - automatycznie generowany z tytułu (można edytować)
- **Wstęp/Opis** - krótki opis widoczny w podglądzie
- **Treść** - pełna treść artykułu w formacie Markdown

#### Automatyczne funkcje:
- **Auto-generowanie slug** z polskich znaków
- **AI Generator wstępu** - automatyczne tworzenie opisu na podstawie tytułu i treści
- **AI Generator tagów** - automatyczne sugerowanie tagów

### 🎨 Formatowanie Markdown

Generator obsługuje pełne formatowanie Markdown:

```markdown
# Nagłówek H1
## Nagłówek H2

**Pogrubiony tekst** i *tekst kursywą*

- Lista punktowa
- Kolejny punkt

```javascript
// Kod z podświetlaniem składni
function hello() {
  console.log("Hello, World!");
}
```

> **Cytat** z ważną informacją

| Tabela | Z danymi |
|--------|----------|
| Wiersz 1 | Wartość 1 |
```

### 📊 Metadane i SEO

- **Autor** - domyślnie "Zespół Biblioteki"
- **Kategoria** - wybór z listy (Podstawy, Zaawansowane, Praktyka, Biznes, Narzędzia, Trendy)
- **Czas czytania** - szacowany w minutach
- **Obrazek główny** - URL do obrazka featured
- **Meta tytuł** - tytuł SEO (domyślnie tytuł artykułu)
- **Meta opis** - opis SEO (domyślnie wstęp)

### 🏷️ Zarządzanie tagami

- **Dodawanie ręczne** - wpisz tag i naciśnij Enter
- **Generowanie AI** - automatyczne sugerowanie tagów
- **Usuwanie** - kliknij na tag z ikoną X

### 👁️ Podgląd na żywo

Generator oferuje podgląd artykułu w czasie rzeczywistym:
- **Podgląd Markdown** - renderowana treść z formatowaniem
- **Informacje o artykule** - nagłówek, autor, kategoria, tagi
- **Responsywny design** - podgląd jak na stronie

## Proces tworzenia artykułu

### 1. Podstawowe dane
```
Tytuł: "Jak używać ChatGPT do automatyzacji pracy"
Slug: "jak-uzywac-chatgpt-do-automatyzacji-pracy" (auto)
Wstęp: [Kliknij "Generuj AI" lub wpisz ręcznie]
```

### 2. Treść artykułu
```markdown
# Jak używać ChatGPT do automatyzacji pracy

W dzisiejszych czasach automatyzacja to klucz do efektywności...

## Praktyczne zastosowania

### 1. Automatyzacja e-maili

```javascript
const emailTemplate = `
Dziękuję za wiadomość...
`;
```

## Podsumowanie

ChatGPT może znacząco zwiększyć...
```

### 3. Metadane
```
Autor: Zespół Biblioteki
Kategoria: Automatyzacja
Czas czytania: 8 min
Obrazek: https://example.com/image.jpg
```

### 4. Tagi
```
[ChatGPT] [automatyzacja] [produktywność] [AI]
```

### 5. Zapisywanie
Kliknij **"Zapisz artykuł bloga"** - artykuł zostanie dodany do bazy danych i będzie widoczny na stronie `/blog`.

## Walidacja i błędy

### Sprawdzane elementy:
- ✅ Tytuł jest wymagany
- ✅ Treść artykułu jest wymagana  
- ✅ Slug jest wymagany i unikalny
- ✅ Wstęp jest wymagany

### Obsługa błędów:
- **Duplikat slug** - zmień tytuł lub slug
- **Błąd bazy danych** - sprawdź połączenie z Supabase
- **Błąd AI** - sprawdź API keys

## Integracja z blogiem

Po zapisaniu artykuł jest automatycznie:
- ✅ Dodawany do tabeli `blog_posts` w Supabase
- ✅ Widoczny na stronie `/blog`
- ✅ Dostępny pod URL `/blog/[slug]`
- ✅ Zindeksowany w wyszukiwarkach (SEO)

## Przykłady użycia

### Artykuł techniczny
```
Tytuł: "Wprowadzenie do React Hooks"
Kategoria: Narzędzia
Tagi: [React, Hooks, JavaScript, Frontend]
Czas: 12 min
```

### Artykuł biznesowy
```
Tytuł: "ROI z automatyzacji AI w firmie"
Kategoria: Biznes
Tagi: [AI, automatyzacja, ROI, biznes]
Czas: 10 min
```

### Artykuł praktyczny
```
Tytuł: "10 najlepszych promptów do ChatGPT"
Kategoria: Praktyka
Tagi: [ChatGPT, prompty, AI, praktyka]
Czas: 8 min
```

## Najlepsze praktyki

### 1. Struktura artykułu
- Używaj nagłówków H2, H3 do organizacji treści
- Dodawaj przykłady kodu dla lepszego zrozumienia
- Kończ artykuł podsumowaniem

### 2. SEO
- Tytuł powinien być chwytliwy i zawierać słowa kluczowe
- Meta opis powinien być zwięzły (150-160 znaków)
- Używaj tagów związanych z tematem

### 3. Formatowanie
- Używaj **pogrubienia** dla ważnych terminów
- Dodawaj listy punktowane dla lepszej czytelności
- Używaj cytatów dla kluczowych informacji

### 4. Obrazy
- Używaj wysokiej jakości obrazów
- Dodawaj tekst alternatywny w Markdown
- Optymalizuj rozmiar obrazów

## Rozwiązywanie problemów

### Artykuł nie pojawia się na stronie
1. Sprawdź czy `is_published` jest ustawione na `true`
2. Sprawdź czy slug jest poprawny
3. Sprawdź czy nie ma błędów w treści Markdown

### Błąd podczas zapisywania
1. Sprawdź połączenie z internetem
2. Sprawdź konfigurację Supabase
3. Sprawdź czy wszystkie wymagane pola są wypełnione

### Problemy z AI
1. Sprawdź czy API keys są skonfigurowane
2. Sprawdź limity API
3. Spróbuj ponownie za chwilę

## Rozszerzenia

### Możliwe przyszłe funkcje:
- **Edytor WYSIWYG** - wizualny edytor Markdown
- **Upload obrazów** - bezpośredni upload do Supabase Storage
- **Harmonogram publikacji** - publikacja w określonym czasie
- **Wersjonowanie** - historia zmian artykułów
- **Współpraca** - wiele autorów
- **Analytics** - statystyki czytelnictwa

## Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Sprawdź konfigurację Supabase
3. Skontaktuj się z zespołem developerskim

---

**Generator Bloga** to potężne narzędzie do tworzenia profesjonalnych artykułów bloga z pełnym wsparciem dla Markdown, AI i SEO. Używaj go do tworzenia wysokiej jakości treści dla swojej biblioteki promptów!
