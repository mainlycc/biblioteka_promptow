# Konfiguracja X API v2 dla Panelu Administracyjnego

## Wymagania

Aby panel administracyjny mógł pobierać dane z X (Twitter), potrzebujesz:

### 1. Konto X Developer
- Zarejestruj się na [developer.x.com](https://developer.x.com)
- Utwórz nową aplikację
- Wybierz plan dostępu (Free, Basic, Pro lub Enterprise)

### 2. Token Bearer
Po utworzeniu aplikacji otrzymasz:
- **Bearer Token** - używany do autoryzacji API

### 3. Konfiguracja środowiska

Dodaj do pliku `.env.local`:

```env
NEXT_PUBLIC_TWITTER_BEARER_TOKEN=twój_bearer_token_tutaj
```

## Plany dostępu X API v2

### Free Plan
- ✅ 500 postów na miesiąc (limit na poziomie aplikacji)
- ✅ Podstawowy dostęp do endpointów v2
- ✅ Idealny do testowania

### Basic Plan ($200/miesiąc)
- ✅ 3,000 postów na miesiąc (limit użytkownika)
- ✅ 50,000 postów na miesiąc (limit aplikacji)
- ✅ 10,000/miesiąc limit odczytu postów

### Pro Plan ($5,000/miesiąc)
- ✅ 1,000,000 postów na miesiąc (GET na poziomie aplikacji)
- ✅ 300,000 postów na miesiąc (limit postowania)
- ✅ Dostęp do search i filtered stream

## Endpointy używane

### Post Lookup
```
GET https://api.twitter.com/2/tweets/{id}
```

**Parametry:**
- `expansions=author_id,attachments.media_keys` - pobiera dane autora i media
- `user.fields=name,username,profile_image_url` - pola użytkownika
- `media.fields=url,preview_image_url,type` - pola mediów

## Funkcjonalności

### ✅ Obsługiwane URL-e
- `https://twitter.com/user/status/123456789`
- `https://x.com/user/status/123456789`

### ✅ Pobierane dane
- Treść tweeta
- Autor (nazwa + username)
- Obrazki (jeśli są)
- Data utworzenia
- Tweet ID
- Automatyczne tłumaczenie na polski

### ✅ Zapisywanie do Supabase
- Wszystkie dane są zapisywane w tabeli `prompts`
- Dodatkowe pola: `author_username`, `author_profile_image`, `tweet_id`

## Rozwiązywanie problemów

### Błąd 401 - Unauthorized
- Sprawdź czy Bearer Token jest poprawny
- Upewnij się, że aplikacja ma odpowiednie uprawnienia

### Błąd 404 - Tweet not found
- Sprawdź czy URL tweeta jest poprawny
- Tweet może być prywatny lub usunięty

### Błąd 429 - Rate limit exceeded
- Przekroczono limit zapytań
- Rozważ upgrade do wyższego planu

## Bezpieczeństwo

⚠️ **WAŻNE:** Nigdy nie udostępniaj Bearer Token w kodzie publicznym!
- Używaj zmiennych środowiskowych
- Token jest widoczny w przeglądarce (NEXT_PUBLIC_), więc nie jest w pełni bezpieczny
- Dla produkcji rozważ użycie API Routes

## Następne kroki

1. Zarejestruj się na developer.x.com
2. Utwórz aplikację i skopiuj Bearer Token
3. Dodaj token do `.env.local`
4. Przetestuj pobieranie tweetów w panelu admina 