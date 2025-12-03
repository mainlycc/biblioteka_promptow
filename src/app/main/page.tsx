import { Header } from "@/app/main/components/header"
import { HeroSection } from "@/app/main/components/hero-section"
import { TrustedBy } from "@/app/main/components/trusted-by"
import { StatsSection } from "@/app/main/components/stats-section"
import { FeaturesSection } from "@/app/main/components/features-section"
import { BentoSection } from "@/app/main/components/bento-section"
import { TestimonialsSection } from "@/app/main/components/testimonials-section"
import { FAQSection } from "@/app/main/components/faq-section"
import { CTASection } from "@/app/main/components/cta-section"
import { Footer } from "@/app/main/components/footer"

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
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
