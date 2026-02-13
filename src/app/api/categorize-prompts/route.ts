import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { mapTagsToCategory } from '@/lib/category-mapper';

/**
 * Endpoint do automatycznego przypisania kategorii istniejącym promptom
 * Uruchom: GET /api/categorize-prompts
 */
export async function GET() {
  try {
    // Pobierz wszystkie prompty tekstowe
    const { data: prompts, error: fetchError } = await supabase
      .from('prompts')
      .select('id, tags, category')
      .eq('type', 'text');

    if (fetchError) {
      console.error('Błąd podczas pobierania promptów:', fetchError);
      return NextResponse.json(
        { error: 'Błąd podczas pobierania promptów', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!prompts || prompts.length === 0) {
      return NextResponse.json({
        message: 'Brak promptów do kategoryzacji',
        categorized: 0,
        total: 0
      });
    }

    let categorized = 0;
    let updated = 0;
    const errors: string[] = [];

    // Dla każdego promptu przypisz kategorię na podstawie tagów
    for (const prompt of prompts) {
      try {
        const tags = prompt.tags || [];
        const newCategory = mapTagsToCategory(tags);
        
        // Aktualizuj tylko jeśli kategoria się zmieniła lub nie była ustawiona
        if (!prompt.category || prompt.category === 'Inne' || prompt.category !== newCategory) {
          const { error: updateError } = await supabase
            .from('prompts')
            .update({ category: newCategory })
            .eq('id', prompt.id);

          if (updateError) {
            errors.push(`Prompt ${prompt.id}: ${updateError.message}`);
          } else {
            updated++;
          }
        }
        
        categorized++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
        errors.push(`Prompt ${prompt.id}: ${errorMessage}`);
      }
    }

    return NextResponse.json({
      message: 'Kategoryzacja zakończona',
      total: prompts.length,
      categorized,
      updated,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Błąd podczas kategoryzacji:', error);
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    return NextResponse.json(
      { error: 'Błąd podczas kategoryzacji', details: errorMessage },
      { status: 500 }
    );
  }
}
