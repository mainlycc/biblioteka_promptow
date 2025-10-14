# Instrukcje generowania Favicon i ikon PWA

## Brakujące pliki (KRYTYCZNE dla SEO)

Strona wymaga następujących plików ikon w katalogu `public/`:

### 1. favicon.ico
- **Rozmiar:** 32x32px lub multi-size (16x16, 32x32, 48x48)
- **Format:** ICO
- **Lokalizacja:** `public/favicon.ico`

### 2. apple-touch-icon.png
- **Rozmiar:** 180x180px
- **Format:** PNG
- **Lokalizacja:** `public/apple-touch-icon.png`

### 3. favicon-32x32.png
- **Rozmiar:** 32x32px
- **Format:** PNG
- **Lokalizacja:** `public/favicon-32x32.png`

### 4. favicon-16x16.png
- **Rozmiar:** 16x16px
- **Format:** PNG
- **Lokalizacja:** `public/favicon-16x16.png`

### 5. android-chrome-192x192.png
- **Rozmiar:** 192x192px
- **Format:** PNG
- **Lokalizacja:** `public/android-chrome-192x192.png`

### 6. android-chrome-512x512.png
- **Rozmiar:** 512x512px
- **Format:** PNG
- **Lokalizacja:** `public/android-chrome-512x512.png`

## Opcja 1: Generowanie online (SZYBKIE)

### Użyj https://realfavicongenerator.net/

1. Wejdź na stronę: https://realfavicongenerator.net/
2. Upload `public/logo.png` jako źródłowy obraz
3. Skonfiguruj ustawienia:
   - **iOS:** Użyj oryginalnego koloru tła (#d03801)
   - **Android:** Theme color #d03801
   - **Windows:** Tile color #d03801
4. Kliknij "Generate your Favicons and HTML code"
5. Pobierz paczkę ZIP
6. Rozpakuj wszystkie pliki do katalogu `public/`

## Opcja 2: Użyj ImageMagick (dla zaawansowanych)

Jeśli masz ImageMagick zainstalowany:

```bash
# Z katalogu public/
convert logo.png -resize 16x16 favicon-16x16.png
convert logo.png -resize 32x32 favicon-32x32.png
convert logo.png -resize 180x180 apple-touch-icon.png
convert logo.png -resize 192x192 android-chrome-192x192.png
convert logo.png -resize 512x512 android-chrome-512x512.png

# Generowanie favicon.ico z wielu rozmiarów
convert logo.png -resize 16x16 -define icon:auto-resize=16,32,48 favicon.ico
```

## Opcja 3: Użyj favicon.io

1. Wejdź na: https://favicon.io/favicon-converter/
2. Upload `public/logo.png`
3. Pobierz wygenerowany pakiet
4. Skopiuj pliki do `public/`

## Weryfikacja

Po dodaniu plików, sprawdź czy wszystkie istnieją:

```bash
cd public
ls -la favicon* apple-touch-icon.png android-chrome*
```

Powinny być widoczne:
- favicon.ico
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png
- android-chrome-192x192.png
- android-chrome-512x512.png

## Testowanie

Po dodaniu plików, przetestuj:
1. Otwórz stronę w przeglądarce
2. Sprawdź czy favicon jest widoczny w karcie
3. Dodaj stronę do ulubionych - sprawdź ikonę
4. Na iOS: "Dodaj do ekranu głównego" - sprawdź ikonę
5. Użyj https://realfavicongenerator.net/favicon_checker

