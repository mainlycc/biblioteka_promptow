import { Header } from "@/components/header-dashboard"
import { HeroSection } from "@/components/landing/hero-section"
import { TrustedBy } from "@/components/landing/trusted-by"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { BentoSection } from "@/components/landing/bento-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import Footer from "@/components/footer-dashboard"
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

export default function Home() {
  return (
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
  )
}
