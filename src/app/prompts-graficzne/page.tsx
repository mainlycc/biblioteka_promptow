import { PromptsGraficzneClient } from "@/components/prompts-graficzne-client"
import { OrganizationSchema, WebsiteSchema, BreadcrumbSchema } from "@/components/json-ld-schema"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Prompty Graficzne - Biblioteka Promptów",
  description: "Najlepsze prompty graficzne dla AI. Gotowe szablony promptów do generowania obrazów w Midjourney, DALL-E, Stable Diffusion i innych narzędziach AI.",
  keywords: [
    "prompty graficzne",
    "prompty midjourney",
    "prompty dall-e",
    "prompty stable diffusion",
    "prompty do generowania obrazów",
    "ai art prompts",
    "prompty graficzne ai",
    "szablony promptów graficznych",
    "prompt engineering obrazów",
    "najlepsze prompty graficzne",
  ],
  openGraph: {
    title: "Prompty Graficzne - Biblioteka Promptów",
    description: "Najlepsze prompty graficzne dla AI. Gotowe szablony promptów do generowania obrazów w Midjourney, DALL-E, Stable Diffusion.",
    url: "https://bibliotekapromptow.pl/prompts-graficzne",
    type: "website",
  },
  twitter: {
    title: "Prompty Graficzne - Biblioteka Promptów",
    description: "Najlepsze prompty graficzne dla AI. Gotowe szablony promptów do generowania obrazów w Midjourney, DALL-E, Stable Diffusion.",
  },
  alternates: {
    canonical: "/prompts-graficzne",
  },
}

interface Prompt {
  id: string
  title: string
  title_pl?: string
  type: 'text' | 'image' | 'video'
  author?: string
  author_username?: string
  author_profile_image?: string
  images?: string[]
  description: string
  created_at: string
}

async function getImagePrompts(): Promise<Prompt[]> {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('type', 'image')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Błąd podczas pobierania promptów graficznych:', error)
      return []
    }

    return (data || []) as Prompt[]
  } catch (error) {
    console.error('Błąd podczas pobierania promptów graficznych:', error)
    return []
  }
}

export default async function PromptyGraficznePage() {
  const prompts = await getImagePrompts()

  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <BreadcrumbSchema 
        items={[
          { name: "Strona główna", url: "https://bibliotekapromptow.pl" },
          { name: "Prompty Graficzne", url: "https://bibliotekapromptow.pl/prompts-graficzne" }
        ]} 
      />
      <main className="flex-1 p-4 md:p-8 pt-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Prompty Graficzne dla AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Odkryj najlepsze prompty graficzne do generowania obrazów za pomocą AI. 
            Gotowe szablony promptów dla Midjourney, DALL-E, Stable Diffusion i innych narzędzi do tworzenia sztuki AI. 
            Znajdź inspirację i twórz niesamowite obrazy z pomocą sztucznej inteligencji.
          </p>
        </div>
        <PromptsGraficzneClient prompts={prompts} />
      </main>
    </>
  )
} 