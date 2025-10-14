import { PromptGrid } from "@/components/prompt-grid"
import { OrganizationSchema, WebsiteSchema } from "@/components/json-ld-schema"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Biblioteka Promptów - Najlepsze Prompty dla ChatGPT, Claude i Gemini",
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
    title: "Biblioteka Promptów - Najlepsze Prompty dla AI",
    description: "Darmowa biblioteka najlepszych promptów dla ChatGPT, Claude i Gemini. Gotowe szablony zwiększające efektywność pracy z AI.",
    url: "https://bibliotekapromptow.pl",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <main className="flex-1 p-4 md:p-8 pt-4">
        <PromptGrid />
      </main>
    </>
  )
}
