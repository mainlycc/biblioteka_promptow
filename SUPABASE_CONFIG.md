# Konfiguracja Supabase

Aby strona bloga działała poprawnie, musisz skonfigurować połączenie z bazą danych Supabase.

## Kroki konfiguracji:

1. **Utwórz projekt w Supabase:**
   - Idź na https://supabase.com
   - Zaloguj się i utwórz nowy projekt
   - Wybierz region (np. Europe West)

2. **Skonfiguruj bazę danych:**
   - W Supabase Dashboard przejdź do SQL Editor
   - Skopiuj i uruchom zawartość pliku `supabase-blog-setup.sql`
   - To utworzy tabelę `blog_posts` z przykładowymi danymi

3. **Pobierz klucze API:**
   - W Supabase Dashboard przejdź do Settings > API
   - Skopiuj:
     - Project URL
     - anon/public key

4. **Utwórz plik .env.local:**
   ```bash
   # W folderze tutaj/ utwórz plik .env.local z zawartością:
   NEXT_PUBLIC_SUPABASE_URL=twoj_url_z_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_klucz_z_supabase
   ```

5. **Uruchom aplikację:**
   ```bash
   npm run dev
   ```

## Przykład pliku .env.local:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rozwiązywanie problemów:

- **Błąd "Invalid API key"** - sprawdź czy klucze są poprawne
- **Błąd "Failed to fetch"** - sprawdź czy URL jest poprawny
- **Brak danych** - sprawdź czy tabela `blog_posts` istnieje i ma dane
- **Błąd RLS** - w Supabase wyłącz Row Level Security dla tabeli `blog_posts` lub skonfiguruj odpowiednie polityki
