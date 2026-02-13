-- Dodanie kolumny category do tabeli prompts
-- Uruchom to zapytanie w SQL Editor w Supabase Dashboard

-- Dodaj kolumnę category z wartością domyślną 'Inne'
ALTER TABLE prompts 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Inne';

-- Utwórz indeks dla lepszej wydajności filtrowania
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);

-- Komentarz: Po uruchomieniu tego skryptu, wszystkie istniejące prompty będą miały kategorię 'Inne'
-- Następnie uruchom skrypt kategoryzacji aby przypisać właściwe kategorie na podstawie tagów
