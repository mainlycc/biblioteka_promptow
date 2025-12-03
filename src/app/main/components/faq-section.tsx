import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Czym jest Biblioteka Promptów?",
      answer:
        "Biblioteka Promptów to kolekcja gotowych, przetestowanych poleceń (promptów) do narzędzi AI takich jak ChatGPT, Midjourney czy DALL·E. Pomagają one uzyskać lepsze rezultaty bez konieczności samodzielnego wymyślania promptów.",
    },
    {
      question: "Czy prompty są aktualizowane?",
      answer:
        "Tak! Regularnie dodajemy nowe prompty i aktualizujemy istniejące, aby zawsze odpowiadały najnowszym możliwościom narzędzi AI.",
    },
    {
      question: "Czy mogę używać promptów komercyjnie?",
      answer:
        "Oczywiście! Wszystkie prompty z naszej biblioteki możesz wykorzystywać zarówno do celów prywatnych, jak i komercyjnych bez żadnych ograniczeń.",
    },
    {
      question: "Jakie narzędzia AI są wspierane?",
      answer:
        "Nasze prompty są przygotowane dla najpopularniejszych narzędzi AI, w tym ChatGPT, Claude, Midjourney, DALL·E, Stable Diffusion i wielu innych.",
    },
  ]

  return (
    <section id="faq" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Często zadawane <span className="text-primary">pytania</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Masz pytania? Znajdziesz tutaj odpowiedzi na najczęściej zadawane pytania.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-xl border border-border px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
