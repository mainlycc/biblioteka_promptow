import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Logowanie - Biblioteka Promptów",
  description: "Zaloguj się do Biblioteki Promptów",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


