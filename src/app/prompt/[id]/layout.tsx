import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Prompt - Biblioteka Promptów",
  description: "Odkryj najlepsze prompty dla AI - ChatGPT, Claude, Gemini. Skuteczne szablony promptów dla biznesu, kreatywności i codziennej pracy.",
  keywords: ["prompty", "prompt engineering", "ChatGPT", "Claude", "Gemini", "AI"],
  openGraph: {
    title: "Prompt - Biblioteka Promptów",
    description: "Odkryj najlepsze prompty dla AI - ChatGPT, Claude, Gemini. Skuteczne szablony promptów dla biznesu, kreatywności i codziennej pracy.",
    url: "https://bibliotekapromptow.pl/prompt",
    type: "website",
  },
  twitter: {
    title: "Prompt - Biblioteka Promptów",
    description: "Odkryj najlepsze prompty dla AI - ChatGPT, Claude, Gemini. Skuteczne szablony promptów dla biznesu, kreatywności i codziennej pracy.",
  },
  alternates: {
    canonical: "/prompt",
  },
}

export default function PromptLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 