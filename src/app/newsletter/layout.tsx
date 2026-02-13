import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Newsletter - Biblioteka Promptów",
  description: "Zapisz się do naszego newslettera i otrzymuj najlepsze prompty co tydzień prosto na swoją skrzynkę email. Bądź na bieżąco z najnowszymi trendami w świecie AI.",
  keywords: [
    "newsletter",
    "prompty newsletter",
    "newsletter ai",
    "zapisz się do newslettera",
    "prompty email",
    "newsletter chatgpt",
    "prompty tygodniowo",
  ],
  openGraph: {
    title: "Newsletter - Biblioteka Promptów",
    description: "Zapisz się do naszego newslettera i otrzymuj najlepsze prompty co tydzień prosto na swoją skrzynkę email. Bądź na bieżąco z najnowszymi trendami w świecie AI.",
    url: "https://bibliotekapromptow.pl/newsletter",
    type: "website",
  },
  twitter: {
    title: "Newsletter - Biblioteka Promptów",
    description: "Zapisz się do naszego newslettera i otrzymuj najlepsze prompty co tydzień prosto na swoją skrzynkę email. Bądź na bieżąco z najnowszymi trendami w świecie AI.",
  },
  alternates: {
    canonical: "/newsletter",
  },
}

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
