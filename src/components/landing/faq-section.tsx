import { HelpCircle, MessageSquare, DollarSign, Users, Zap } from "lucide-react"

export const FAQ_DATA = [
    {
      question: "Co to jest prompt AI?",
      answer:
        "Prompt AI to instrukcja lub polecenie przekazywane modelowi sztucznej inteligencji, które określa oczekiwany rodzaj odpowiedzi. Dobry prompt precyzyjnie definiuje zadanie, kontekst i oczekiwaną formę odpowiedzi, co pozwala uzyskać bardziej trafne i użyteczne rezultaty z narzędzi takich jak ChatGPT, Claude czy Midjourney.",
      icon: HelpCircle,
    },
    {
      question: "Jak pisać dobre prompty do ChatGPT?",
      answer:
        "Aby pisać skuteczne prompty do ChatGPT, zacznij od jasnego określenia roli (np. 'Jesteś ekspertem od...'), opisz dokładnie zadanie, podaj kontekst i szczegóły, określ format odpowiedzi oraz dodaj konkretne wymagania. Unikaj zbyt ogólnych pytań - im bardziej precyzyjny prompt, tym lepsze rezultaty uzyskasz.",
      icon: MessageSquare,
    },
    {
      question: "Czy prompty z biblioteki są darmowe?",
      answer:
        "Tak! Wszystkie prompty w naszej bibliotece są całkowicie darmowe. Możesz je używać zarówno do celów prywatnych, jak i komercyjnych bez żadnych ograniczeń. Nasza misja to ułatwienie dostępu do wysokiej jakości promptów AI dla wszystkich.",
      icon: DollarSign,
    },
    {
      question: "Dla kogo jest biblioteka promptów?",
      answer:
        "Biblioteka Promptów jest przeznaczona dla każdego, kto pracuje z narzędziami AI - od początkujących, którzy dopiero poznają możliwości ChatGPT i Claude, po profesjonalistów szukających gotowych szablonów do codziennej pracy. Szczególnie przydatna dla copywriterów, marketerów, programistów, przedsiębiorców i kreatywnych osób.",
      icon: Users,
    },
    {
      question: "Jakie narzędzia AI są wspierane?",
      answer:
        "Nasze prompty są przygotowane dla najpopularniejszych narzędzi AI, w tym ChatGPT, Claude, Gemini, Midjourney, DALL·E, Stable Diffusion i wielu innych. Większość promptów tekstowych działa z modelami językowymi, a prompty graficzne z generatorami obrazów AI.",
      icon: Zap,
    },
]

export function FAQSection() {
  const faqs = FAQ_DATA

  return (
    <section id="faq" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Często zadawane <span className="text-primary">pytania</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Masz pytania? Znajdziesz tutaj odpowiedzi na najczęściej zadawane pytania.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 group"
                style={{ borderColor: 'var(--main-orange)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <faq.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-3 leading-tight">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

