# Konfiguracja automatycznej aktualizacji sitemap

Gdy dodajesz nowe wpisy do Supabase (tabele `prompts` lub `blog_posts`) przez zewnętrzne narzędzie, sitemap automatycznie się aktualizuje dzięki webhookowi.

## Jak to działa

1. Zewnętrzne narzędzie dodaje wpis do Supabase (INSERT/UPDATE)
2. Supabase wywołuje webhook z informacją o zmianie
3. Webhook wywołuje endpoint `/api/revalidate-sitemap`
4. Endpoint wymusza regenerację sitemap w Next.js
5. Sitemap jest automatycznie zaktualizowany

## Konfiguracja webhooka w Supabase

### Krok 1: Przejdź do Database Webhooks w Supabase Dashboard

1. Zaloguj się do [Supabase Dashboard](https://app.supabase.com)
2. Wybierz swój projekt
3. Przejdź do **Database** → **Webhooks** w menu bocznym

### Krok 2: Utwórz webhook dla tabeli `prompts`

1. Kliknij **"Create a new webhook"** lub **"New webhook"**
2. Wypełnij formularz:
   - **Name**: `Revalidate Sitemap - Prompts`
   - **Table**: Wybierz `prompts`
   - **Events**: Zaznacz `INSERT` i `UPDATE`
   - **HTTP Request**: 
     - **Method**: `POST`
     - **URL**: `https://bibliotekapromptow.pl/api/revalidate-sitemap`
       - ⚠️ Jeśli używasz innej domeny, zmień URL na swoją domenę
       - ⚠️ Jeśli testujesz lokalnie, użyj: `http://localhost:3000/api/revalidate-sitemap`
     - **HTTP Headers**: (opcjonalnie) Możesz dodać nagłówek autoryzacyjny:
       ```
       Content-Type: application/json
       ```
     - **HTTP Request Body**: (możesz pozostawić puste)

3. Kliknij **"Save"** lub **"Create webhook"**

### Krok 3: Utwórz webhook dla tabeli `blog_posts`

1. Powtórz Krok 2, ale tym razem:
   - **Name**: `Revalidate Sitemap - Blog Posts`
   - **Table**: Wybierz `blog_posts`
   - **Events**: Zaznacz `INSERT` i `UPDATE`
   - **URL**: Taki sam jak powyżej: `https://bibliotekapromptow.pl/api/revalidate-sitemap`

2. Kliknij **"Save"**

## Opcjonalnie: Zabezpieczenie endpointu

Jeśli chcesz zabezpieczyć endpoint przed nieautoryzowanym dostępem, możesz dodać token autoryzacyjny:

### W pliku `.env.local`:

```env
SITEMAP_REVALIDATE_SECRET=twoj-sekretny-token
```

### W `tutaj/src/app/api/revalidate-sitemap/route.ts`:

```typescript
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.SITEMAP_REVALIDATE_SECRET
  
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // ... reszta kodu
}
```

### W webhooku Supabase:

Dodaj w **HTTP Headers**:
```
Authorization: Bearer twoj-sekretny-token
```

## Testowanie

### Krok 1: Przed dodaniem wpisu
1. Otwórz sitemap w przeglądarce: `https://bibliotekapromptow.pl/sitemap.xml`
2. Wyszukaj wszystkie `<url>` (Ctrl+F) i policz ile ich jest
3. Zapisz liczbę wpisów

### Krok 2: Dodaj testowy wpis
1. Dodaj testowy wpis do tabeli `prompts` lub `blog_posts` w Supabase (przez zewnętrzne narzędzie)
2. Zapisz ID nowego wpisu

### Krok 3: Sprawdź aktualizację (odczekaj 5-10 sekund)
1. Odśwież stronę sitemap: `https://bibliotekapromptow.pl/sitemap.xml`
2. Policz ponownie wpisy `<url>` - liczba powinna wzrosnąć o 1
3. Wyszukaj w sitemap ID nowego wpisu - powinien pojawić się wpis:
   ```xml
   <url>
     <loc>https://bibliotekapromptow.pl/prompt/[ID]</loc>
     <lastmod>2025-XX-XX</lastmod>
     ...
   </url>
   ```

### Krok 4: Weryfikacja webhooka
1. Przejdź do Supabase Dashboard → Database → Webhooks
2. Kliknij na skonfigurowany webhook
3. Sprawdź sekcję "Recent invocations" - powinien być widoczny wywołanie z statusem 200

### Test ręczny endpointu
Możesz też przetestować endpoint bezpośrednio:
```bash
curl -X POST https://bibliotekapromptow.pl/api/revalidate-sitemap
```

Odpowiedź powinna być:
```json
{
  "success": true,
  "message": "Cache sitemap został odświeżony",
  "timestamp": "2025-01-XX..."
}
```

## Rozwiązywanie problemów

- **Webhook nie działa**: Sprawdź czy URL jest poprawny i dostępny publicznie
- **Błąd 404**: Upewnij się, że endpoint `/api/revalidate-sitemap` istnieje
- **Błąd 500**: Sprawdź logi w Supabase Dashboard i w aplikacji Next.js
- **Sitemap się nie aktualizuje**: Sprawdź czy webhook został wywołany w logach Supabase

## Alternatywa: Wywołanie ręczne

Możesz też wywołać endpoint ręcznie, np. przez curl:

```bash
curl -X POST https://bibliotekapromptow.pl/api/revalidate-sitemap
```

Lub po dodaniu wpisu w zewnętrznym narzędziu, wywołać ten endpoint jako część procesu.

