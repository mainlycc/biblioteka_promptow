# Przewodnik po formatowaniu tekstu w blogu

## Wprowadzenie

Blog został wyposażony w pełne wsparcie dla Markdown, co pozwala na tworzenie bogatych, sformatowanych artykułów z użyciem prostych znaczników tekstowych.

## Obsługiwane elementy Markdown

### Nagłówki

```markdown
# Nagłówek H1
## Nagłówek H2
### Nagłówek H3
#### Nagłówek H4
##### Nagłówek H5
###### Nagłówek H6
```

### Tekst

```markdown
**Pogrubiony tekst**
*Tekst kursywą*
~~Przekreślony tekst~~
`Kod inline`
```

### Listy

#### Lista nieuporządkowana
```markdown
- Element 1
- Element 2
  - Element zagnieżdżony
  - Kolejny element
- Element 3
```

#### Lista uporządkowana
```markdown
1. Pierwszy element
2. Drugi element
   1. Element zagnieżdżony
   2. Kolejny element
3. Trzeci element
```

### Linki i obrazy

```markdown
[Tekst linku](https://example.com)
![Tekst alternatywny](https://example.com/obraz.jpg)
```

### Cytaty

```markdown
> To jest cytat
> Może zawierać wiele linii
> I będzie wyświetlony w specjalnym stylu
```

### Kod

#### Kod inline
```markdown
Użyj funkcji `console.log()` do wyświetlania danych.
```

#### Bloki kodu z podświetlaniem składni
````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

Obsługiwane języki:
- `javascript` / `js`
- `typescript` / `ts`
- `python` / `py`
- `html`
- `css`
- `sql`
- `json`
- `bash` / `shell`
- `markdown`
- `xml`
- `yaml`
- `php`
- `java`
- `csharp` / `cs`
- `cpp` / `c++`
- `c`
- `go`
- `rust`
- `ruby`
- `swift`
- `kotlin`
- `scala`
- `r`
- `matlab`
- I wiele innych...

### Tabele

```markdown
| Kolumna 1 | Kolumna 2 | Kolumna 3 |
|-----------|-----------|-----------|
| Dane 1    | Dane 2    | Dane 3    |
| Dane 4    | Dane 5    | Dane 6    |
```

### Linie poziome

```markdown
---
```

### Listy zadań (checklist)

```markdown
- [x] Ukończone zadanie
- [ ] Nieukończone zadanie
- [x] Kolejne ukończone zadanie
```

## Zaawansowane funkcje

### Tabele z wyrównaniem

```markdown
| Lewo | Środek | Prawo |
|:-----|:------:|------:|
| Tekst | Tekst | Tekst |
```

### Kod z numerowaniem linii

````markdown
```javascript:1-5
function example() {
  console.log("Linia 1");
  console.log("Linia 2");
  return "Wynik";
}
```
````

### Definicje

```markdown
Term 1
: Definicja terminu 1

Term 2
: Definicja terminu 2
```

### Przypisy

```markdown
Tekst z przypisem[^1].

[^1]: To jest przypis.
```

## Style i kolory

### Ostrzeżenia i informacje

Możesz używać specjalnych bloków informacyjnych:

```markdown
> **Info**  
> To jest blok informacyjny

> **Warning**  
> To jest ostrzeżenie

> **Success**  
> To jest komunikat o sukcesie

> **Error**  
> To jest komunikat o błędzie
```

## Przykłady użycia w artykułach

### Artykuł techniczny

```markdown
# Jak używać React Hooks

## Wprowadzenie

React Hooks to nowoczesny sposób zarządzania stanem w komponentach funkcyjnych.

## Podstawowe Hooks

### useState

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Liczba: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Zwiększ
      </button>
    </div>
  );
}
```

### useEffect

```javascript
import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(setData);
  }, []);
  
  return <div>{data ? data.message : 'Ładowanie...'}</div>;
}
```

## Najlepsze praktyki

1. **Używaj Hooks na początku komponentu**
2. **Nie używaj Hooks w pętlach lub warunkach**
3. **Twórz własne Hooks dla logiki wielokrotnego użycia**

## Podsumowanie

Hooks znacznie upraszczają zarządzanie stanem w React.
```

### Artykuł z tabelami

```markdown
# Porównanie frameworków JavaScript

## Najpopularniejsze frameworki w 2024

| Framework | Popularność | Łatwość nauki | Performance |
|-----------|-------------|---------------|-------------|
| React     | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐       | ⭐⭐⭐⭐     |
| Vue       | ⭐⭐⭐⭐     | ⭐⭐⭐⭐⭐     | ⭐⭐⭐⭐     |
| Angular   | ⭐⭐⭐       | ⭐⭐⭐         | ⭐⭐⭐⭐⭐   |
| Svelte    | ⭐⭐         | ⭐⭐⭐⭐⭐     | ⭐⭐⭐⭐⭐   |

## Zalecenia

> **Tip**  
> Dla początkujących polecam zacząć od Vue lub React.

### Dla małych projektów
- **Svelte** - najszybszy
- **Vue** - najłatwiejszy

### Dla dużych projektów
- **React** - najlepsze wsparcie społeczności
- **Angular** - najpełniejszy framework
```

## Wskazówki redakcyjne

### Struktura artykułu

1. **Wprowadzenie** - krótkie wprowadzenie do tematu
2. **Główne sekcje** - podzielone na logiczne części
3. **Przykłady** - konkretne przykłady użycia
4. **Podsumowanie** - kluczowe wnioski

### Formatowanie

- Używaj nagłówków do strukturyzacji treści
- Dodawaj przykłady kodu dla lepszego zrozumienia
- Używaj tabel do porównań
- Dodawaj cytaty dla ważnych informacji
- Używaj list do wyliczania punktów

### Optymalizacja SEO

- Używaj nagłówków H1-H6 w logicznej kolejności
- Dodawaj tekst alternatywny do obrazów
- Używaj słów kluczowych w nagłówkach
- Twórz linki wewnętrzne między artykułami

## Narzędzia do pisania

### Edytory z podglądem Markdown

- **Typora** - elegancki edytor z podglądem na żywo
- **Mark Text** - darmowy edytor z podglądem
- **Obsidian** - zaawansowany edytor z bazą wiedzy
- **Notion** - edytor online z współpracą

### Wtyczki do VS Code

- **Markdown All in One** - kompletne wsparcie dla Markdown
- **Markdown Preview Enhanced** - zaawansowany podgląd
- **markdownlint** - sprawdzanie składni

## Rozwiązywanie problemów

### Kod nie jest podświetlany

Sprawdź, czy używasz poprawnej nazwy języka:
````markdown
```javascript  ← Poprawnie
```js         ← Poprawnie
```javascript:1-5  ← Z numerowaniem linii
```
````

### Tabele nie wyświetlają się poprawnie

Upewnij się, że:
- Każda linia zaczyna i kończy się znakiem `|`
- Nagłówki są oddzielone linią z `-`
- Liczba kolumn jest spójna

### Obrazy nie ładują się

Sprawdź:
- Czy URL obrazu jest poprawny
- Czy obraz jest dostępny publicznie
- Czy używasz poprawnej składni: `![alt text](url)`

## Wsparcie

Jeśli masz pytania dotyczące formatowania tekstu w blogu, skontaktuj się z zespołem redakcyjnym.
