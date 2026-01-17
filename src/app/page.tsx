import { Header } from "@/components/header-dashboard"
import { HeroSection } from "@/components/landing/hero-section"
import { TrustedBy } from "@/components/landing/trusted-by"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { BentoSection } from "@/components/landing/bento-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FAQSection, FAQ_DATA } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import Footer from "@/components/footer-dashboard"
import { WebsiteSchema, OrganizationSchema, FAQPageSchema } from "@/components/json-ld-schema"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Biblioteka Promptów - Prompty AI, ChatGPT, Claude",
  description: "Darmowa biblioteka 1000+ najlepszych promptów AI. Gotowe szablony dla ChatGPT, Claude, Gemini i Midjourney. Oszczędź 50% czasu i twórz lepsze treści!",
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
    description: "Darmowa biblioteka 1000+ najlepszych promptów AI. Gotowe szablony dla ChatGPT, Claude, Gemini i Midjourney. Oszczędź 50% czasu i twórz lepsze treści!",
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
      <FAQPageSchema faqs={FAQ_DATA} />
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10 h-full w-full bg-white" style={{ background: 'radial-gradient(125% 125% at 50% 10%, #fff 40%, #ff8000 100%)' }}></div>
        <Header />
        <main>
          <HeroSection />
          <TrustedBy />
          <StatsSection />
          <FeaturesSection />
          <BentoSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  )
}
