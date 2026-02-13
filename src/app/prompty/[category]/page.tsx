import { PromptGridClient } from "@/components/prompt-grid-client"
import { OrganizationSchema, WebsiteSchema, BreadcrumbSchema } from "@/components/json-ld-schema"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { slugToCategory, categoryDescriptions, categoryKeywords } from "@/lib/category-utils"
import { CATEGORIES } from "@/lib/category-mapper"
import { notFound } from "next/navigation"

export const revalidate = 60

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

type Props = {
  params: Promise<{ category: string }>;
};

async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('type', 'text')
      .eq('category', category)
      .order('created_at', { ascending: false });

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug);

  if (!category) {
    return {
      title: "Kategoria nie znaleziona - Biblioteka Promptów",
    };
  }

  const description = categoryDescriptions[category];
  const keywords = categoryKeywords[category];

  return {
    title: `Prompty ${category} - Biblioteka Promptów`,
    description: description,
    keywords: [
      ...keywords,
      `prompty ${category.toLowerCase()}`,
      `prompty ai ${category.toLowerCase()}`,
      `szablony promptów ${category.toLowerCase()}`,
      "biblioteka promptów",
      "prompty chatgpt",
      "prompty claude",
      "darmowe prompty"
    ],
    openGraph: {
      title: `Prompty ${category} - Biblioteka Promptów`,
      description: description,
      url: `https://bibliotekapromptow.pl/prompty/${categorySlug}`,
      type: "website",
    },
    alternates: {
      canonical: `/prompty/${categorySlug}`,
    },
  };
}

export async function generateStaticParams() {
  // Generuj statyczne ścieżki dla wszystkich kategorii
  return CATEGORIES.map((category) => {
    const slug = category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return {
      category: slug,
    };
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const prompts = await getPromptsByCategory(category);

  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <BreadcrumbSchema 
        items={[
          { name: "Strona główna", url: "https://bibliotekapromptow.pl" },
          { name: "Prompty Tekstowe", url: "https://bibliotekapromptow.pl/prompty" },
          { name: category, url: `https://bibliotekapromptow.pl/prompty/${categorySlug}` }
        ]} 
      />
      <main className="flex-1 p-4 md:p-8 pt-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Prompty: {category}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {categoryDescriptions[category]}
          </p>
        </div>
        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Brak promptów w tej kategorii. Sprawdź inne kategorie lub wróć do{" "}
              <a href="/prompty" className="text-orange-600 hover:text-orange-700 underline">
                wszystkich promptów
              </a>.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Znaleziono {prompts.length} {prompts.length === 1 ? 'prompt' : prompts.length < 5 ? 'prompty' : 'promptów'} w kategorii:
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm font-medium">
                {category}
              </span>
              <a 
                href="/prompty" 
                className="text-sm text-orange-600 hover:text-orange-700 underline"
              >
                (zobacz wszystkie)
              </a>
            </div>
            <PromptGridClient prompts={prompts} />
          </>
        )}
      </main>
    </>
  )
}
