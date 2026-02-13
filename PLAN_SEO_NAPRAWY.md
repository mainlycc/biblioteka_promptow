# Plan naprawy SEO - Biblioteka Promptów

## Kontekst problemu
Strona bibliotekapromptow.pl ma niski ruch organiczny z Google. Główna przyczyna: kluczowe strony z treścią (`/prompty`, `/prompts-graficzne`) renderują się po stronie klienta (CSR) - Googlebot widzi "Ładowanie..." zamiast właściwej treści. Dodatkowo brak metadanych na kilku stronach i sitemap zawiera strony zablokowane w robots.txt.

---

## KRYTYCZNE - Konwersja na SSR

### 1. Konwersja `/prompty` na Server-Side Rendering

**Obecny problem:** `PromptGrid` to komponent `"use client"` z `useEffect` do pobierania danych. Google nie widzi żadnych promptów.

**Plik:** `src/app/prompty/page.tsx`
- Zmienić na async server component
- Pobrać dane z Supabase po stronie serwera
- Dodać `export const revalidate = 60`
- Wyrenderować pełną listę promptów jako HTML na serwerze
- Dodać tekst wprowadzający (H1 + opis) dla rozwiązania "thin content"
- Dodać BreadcrumbSchema

**Nowy plik:** `src/components/prompt-grid-client.tsx`
- Wyodrębnić interaktywne elementy (filtrowanie, paginacja, kopiowanie)
- Dane przekazywane jako props z serwera (bez useEffect)

### 2. Konwersja `/prompts-graficzne` na SSR + dodanie metadata

**Obecny problem:** Cały plik to `"use client"` z `useEffect`. Brak jakichkolwiek metadanych.

**Plik:** `src/app/prompts-graficzne/page.tsx`
- Przerobić na async server component (wzorzec jak `/prompty`)
- Dodać pełne metadane: title, description, keywords, OG, canonical
- Dodać tekst wprowadzający + BreadcrumbSchema
- Dane pobierane server-side

---

## WAŻNE - Metadata i Sitemap

### 3. Naprawa `/filmowe`

**Obecny problem:** Strona-placeholder ("Wkrótce dostępne...") jest w sitemap z priorytetem 0.8.

**Plik:** `src/app/filmowe/page.tsx`
- Dodać metadata z `robots: { index: false, follow: false }`

### 4. Czyszczenie Sitemap

**Plik:** `src/app/sitemap.ts`
- Usunąć `/filmowe` (placeholder bez treści)
- Usunąć `/dashboard` (zablokowany w robots.txt)
- Usunąć `/login` (zablokowany w robots.txt)

### 5. Dodanie metadanych do `/newsletter`

**Obecny problem:** Strona `"use client"` bez żadnych metadanych SEO.

**Nowy plik:** `src/app/newsletter/layout.tsx`
- Dodać metadata: title, description, keywords, OG tags, canonical
- Wzorzec: istniejący `src/app/contact/layout.tsx`

---

## UZUPEŁNIAJĄCE - Content SEO

### 6. Tekst SEO na stronach kategorii

Na `/prompty` i `/prompts-graficzne` dodać nad siatką:
- H1 z opisową frazą kluczową
- 2-3 zdania opisu kategorii z naturalnymi słowami kluczowymi

---

## Pliki do modyfikacji
1. `src/app/prompty/page.tsx` - konwersja na SSR
2. `src/components/prompt-grid.tsx` → nowy `src/components/prompt-grid-client.tsx`
3. `src/app/prompts-graficzne/page.tsx` - konwersja na SSR + metadata
4. `src/app/filmowe/page.tsx` - noindex
5. `src/app/sitemap.ts` - czyszczenie
6. `src/app/newsletter/layout.tsx` - nowy plik z metadata

## Pliki referencyjne (wzorce do naśladowania)
- `src/app/blog/page.tsx` - wzorzec poprawnego SSR
- `src/app/prompt/[id]/page.tsx` - wzorzec SSR + dynamiczne metadata
- `src/app/contact/layout.tsx` - wzorzec layout z metadata
- `src/components/json-ld-schema.tsx` - dostępne komponenty schema
- `src/lib/supabase.ts` - klient Supabase

## Weryfikacja po wdrożeniu
1. `npm run build` - czy build przechodzi
2. `npm run dev` - czy strony działają lokalnie
3. Sprawdzenie źródła HTML `/prompty` - czy zawiera treść promptów (nie "Ładowanie...")
4. Sprawdzenie źródła HTML `/prompts-graficzne` - czy zawiera treść
5. Sprawdzenie `/sitemap.xml` - czy nie ma usuniętych stron
6. Sprawdzenie metadanych w źródle na `/newsletter`
