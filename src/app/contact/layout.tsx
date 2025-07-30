import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt - Biblioteka Promptów",
  description: "Skontaktuj się z zespołem Biblioteki Promptów. Masz pytania lub sugestie? Jesteśmy tutaj, aby pomóc!",
  keywords: ["kontakt", "pomoc", "wsparcie", "sugestie", "pytania"],
  openGraph: {
    title: "Kontakt - Biblioteka Promptów",
    description: "Skontaktuj się z zespołem Biblioteki Promptów. Masz pytania lub sugestie? Jesteśmy tutaj, aby pomóc!",
    url: "https://bibliotekapromptow.pl/contact",
    type: "website",
  },
  twitter: {
    title: "Kontakt - Biblioteka Promptów",
    description: "Skontaktuj się z zespołem Biblioteki Promptów. Masz pytania lub sugestie? Jesteśmy tutaj, aby pomóc!",
  },
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 