import { PromptGridClient } from "@/components/prompt-grid-client"
import { OrganizationSchema, WebsiteSchema, BreadcrumbSchema } from "@/components/json-ld-schema"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { slugToCategory, categoryToSlug } from "@/lib/category-utils"
import { CATEGORIES } from "@/lib/category-mapper"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Prompty Tekstowe - Biblioteka Promptów",
  description: "Darmowa biblioteka najlepszych promptów dla AI. Gotowe szablony promptów dla ChatGPT, Claude, Gemini. Zwiększ efektywność pracy z AI!",
  keywords: [
    "biblioteka promptów",
    "prompty chatgpt",
    "prompty claude",
    "prompty gemini",
    "darmowe prompty",
    "szablony promptów",
    "prompt engineering",
    "najlepsze prompty ai",
    "prompty do chatgpt",
    "gotowe prompty",
    "ai prompts",
  ],
  openGraph: {
    title: "Prompty Tekstowe - Biblioteka Promptów",
    description: "Darmowa biblioteka najlepszych promptów dla ChatGPT, Claude i Gemini. Gotowe szablony zwiększające efektywność pracy z AI.",
    url: "https://bibliotekapromptow.pl/prompty",
    type: "website",
  },
  alternates: {
    canonical: "/prompty",
  },
}

interface Prompt {
  id: string;
  title: string;
  title_pl?: string;
  description: string;
  content_pl?: string;
  introduction?: string;
  tags: string[];
  category?: string;
  author: string;
  author_id?: string;
  author_username?: string;
  author_profile_image?: string;
  type: 'text' | 'image' | 'video';
  images?: string[];
  tweet_url?: string;
  image_url?: string;
  tweet_id?: string;
  created_at: string;
}

async function getPrompts(category?: string | null): Promise<Prompt[]> {
  try {
    let query = supabase
      .from('prompts')
      .select('*')
      .eq('type', 'text');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Błąd podczas pobierania promptów:', error);
      return [];
    }

    return (data || []) as Prompt[];
  } catch (error) {
    console.error('Błąd podczas pobierania promptów:', error);
    return [];
  }
}

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function PromptyPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryParam = params.category;
  
  // Jeśli jest parametr category, przekieruj na dedykowaną podstronę
  if (categoryParam) {
    // Sprawdź czy to slug czy pełna nazwa kategorii
    let categorySlug: string;
    const categoryFromSlug = slugToCategory(categoryParam);
    
    if (categoryFromSlug) {
      // To jest slug - użyj go bezpośrednio
      categorySlug = categoryParam;
    } else {
      // To może być pełna nazwa kategorii - spróbuj znaleźć kategorię
      const foundCategory = CATEGORIES.find(cat => 
        cat.toLowerCase() === categoryParam.toLowerCase()
      );
      if (foundCategory) {
        categorySlug = categoryToSlug(foundCategory);
      } else {
        // Nie znaleziono - użyj parametru jako slug (może być nieprawidłowy, ale przekierujemy)
        categorySlug = categoryParam.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
    }
    
    redirect(`/prompty/${categorySlug}`);
  }
  
  const prompts = await getPrompts();

  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <BreadcrumbSchema 
        items={[
          { name: "Strona główna", url: "https://bibliotekapromptow.pl" },
          { name: "Prompty Tekstowe", url: "https://bibliotekapromptow.pl/prompty" }
        ]} 
      />
      <main className="flex-1 p-4 md:p-8 pt-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Prompty Tekstowe dla AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Odkryj najlepsze prompty tekstowe dla ChatGPT, Claude, Gemini i innych modeli AI. 
            Gotowe szablony promptów, które zwiększą efektywność Twojej pracy z sztuczną inteligencją. 
            Znajdź idealny prompt dla swoich potrzeb i zacznij tworzyć lepsze treści już dziś.
          </p>
        </div>
        <PromptGridClient prompts={prompts} />
      </main>
    </>
  )
}

