import { Header } from "@/components/header-dashboard"
import { HeroSection } from "@/components/landing/hero-section"
import { TrustedBy } from "@/components/landing/trusted-by"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { BentoSection } from "@/components/landing/bento-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import Footer from "@/components/footer-dashboard"
import { WebsiteSchema, OrganizationSchema } from "@/components/json-ld-schema"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Biblioteka Promptów - Prompty AI, ChatGPT, Claude",
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
    title: "Biblioteka Promptów - Prompty AI, ChatGPT, Claude",
    description: "Darmowa biblioteka najlepszych promptów dla ChatGPT, Claude i Gemini. Gotowe szablony zwiększające efektywność pracy z AI.",
    url: "https://bibliotekapromptow.pl",
    type: "website",
    images: [
      {
        url: "https://bibliotekapromptow.pl/logo.png",
        width: 1200,
        height: 630,
        alt: "Biblioteka Promptów - Logo",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  return (
    <>
      <WebsiteSchema />
      <OrganizationSchema />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <TrustedBy />
          <StatsSection />
          <FeaturesSection />
          <BentoSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  )
}
