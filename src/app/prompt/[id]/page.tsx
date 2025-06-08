"use server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyButton } from "@/components/copy-button";
import Image from "next/image";

interface Author {
  name: string;
  avatar: string;
  role: string;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: Author;
  fullPrompt: string;
}

// Przykładowe dane promptów (w przyszłości można je pobierać z API lub bazy danych)
const prompts: Prompt[] = [
  {
    id: "1",
    title: "Realistyczny Portret Biznesowy",
    description: "Stwórz profesjonalny portret biznesowy osoby w wieku [WIEK]...",
    tags: ["#portret", "#biznes", "+1"],
    author: {
      name: "Jan Kowalski",
      avatar: "/avatars/jan.jpg",
      role: "Ekspert AI"
    },
    fullPrompt: `Stwórz profesjonalny portret biznesowy osoby w wieku [WIEK] lat, pracującej w branży [BRANŻA].\nPortret powinien być wykonany w stylu [STYL], z uwzględnieniem następujących elementów:\n- Profesjonalny strój biznesowy\n- Neutralne tło w kolorze [KOLOR]\n- Naturalne oświetlenie podkreślające rysy twarzy\n- Subtelny uśmiech wyrażający profesjonalizm i zaufanie\n- Odpowiednia kompozycja podkreślająca status zawodowy\n\nDodatkowe wskazówki:\n- Unikaj przesady w stylizacji\n- Zachowaj naturalny wygląd\n- Uwzględnij specyfikę branży w detalach`
  },
  {
    id: "2",
    title: "Fantastyczny Krajobraz",
    description: "Namaluj fantastyczny krajobraz z [ELEMENT_1] i [ELEMENT_2]...",
    tags: ["#fantasy", "#krajobraz", "+1"],
    author: {
      name: "Anna Nowak",
      avatar: "/avatars/anna.jpg",
      role: "Grafik AI"
    },
    fullPrompt: `Namaluj fantastyczny krajobraz z [ELEMENT_1] i [ELEMENT_2] w stylu [STYL].\nKrajobraz powinien zawierać:\n- Dramatyczne oświetlenie\n- Efekty atmosferyczne\n- Szczegółowe elementy przyrody\n- Magiczne akcenty`
  },
  {
    id: "3",
    title: "Logo Minimalistyczne",
    description: "Zaprojektuj minimalistyczne logo dla firmy [NAZWA_FIRMY]...",
    tags: ["#logo", "#minimalizm", "+1"],
    author: {
      name: "Piotr Wiśniewski",
      avatar: "/avatars/piotr.jpg",
      role: "Designer AI"
    },
    fullPrompt: `Zaprojektuj minimalistyczne logo dla firmy [NAZWA_FIRMY] działającej w branży [BRANŻA].\nLogo powinno być:\n- Proste i czytelne\n- Łatwe do zapamiętania\n- Działające w różnych rozmiarach\n- Zgodne z zasadami projektowania minimalistycznego`
  },
  {
    id: "4",
    title: "Strategia Marketingowa dla Startupów",
    description: "Stwórz szczegółową strategię marketingową dla startupu w branży [BRANŻA]...",
    tags: ["#startup", "#strategia", "+1"],
    author: {
      name: "Ewa Zielińska",
      avatar: "/avatars/ewa.jpg",
      role: "Marketingowiec"
    },
    fullPrompt: `Stwórz szczegółową strategię marketingową dla startupu w branży [BRANŻA].\nStrategia powinna obejmować:\n- Analizę rynku\n- Określenie grupy docelowej\n- Propozycję wartości\n- Kanały komunikacji\n- Plan działań promocyjnych\n- Mierniki sukcesu`
  },
  {
    id: "5",
    title: "Techniki Sprzedażowe B2B",
    description: "Opracuj listę 10 najskuteczniejszych technik sprzedażowych dla produktu [PRODUKT] w segmencie B2B...",
    tags: ["#b2b", "#sprzedaż", "+1"],
    author: {
      name: "Marek Nowicki",
      avatar: "/avatars/marek.jpg",
      role: "Specjalista B2B"
    },
    fullPrompt: `Opracuj listę 10 najskuteczniejszych technik sprzedażowych dla produktu [PRODUKT] w segmencie B2B.\nKażda technika powinna zawierać:\n- Krótki opis\n- Przykład zastosowania\n- Wskazówki praktyczne`
  },
  {
    id: "6",
    title: "Plan Rozwoju Osobistego",
    description: "Stwórz 90-dniowy plan rozwoju osobistego dla osoby, która chce rozwinąć umiejętności [UMIEJĘTNOŚCI]...",
    tags: ["#rozwój", "#plan", "+1"],
    author: {
      name: "Katarzyna Lewandowska",
      avatar: "/avatars/kasia.jpg",
      role: "Coach"
    },
    fullPrompt: `Stwórz 90-dniowy plan rozwoju osobistego dla osoby, która chce rozwinąć umiejętności [UMIEJĘTNOŚCI].\nPlan powinien zawierać:\n- Cele na każdy miesiąc\n- Zadania tygodniowe\n- Sposoby monitorowania postępów\n- Motywujące cytaty`
  },
  {
    id: "7",
    title: "Sesja Terapeutyczna CBT",
    description: "Zaprojektuj strukturę sesji terapeutycznej CBT dla klienta z problemem [PROBLEM]...",
    tags: ["#cbt", "#terapia", "+1"],
    author: {
      name: "Tomasz Wójcik",
      avatar: "/avatars/tomek.jpg",
      role: "Terapeuta CBT"
    },
    fullPrompt: `Zaprojektuj strukturę sesji terapeutycznej CBT dla klienta z problemem [PROBLEM].\nStruktura powinna obejmować:\n- Wprowadzenie\n- Pracę nad myślami\n- Ćwiczenia praktyczne\n- Podsumowanie sesji`
  },
  {
    id: "8",
    title: "Analiza Biznesowa SWOT",
    description: "Przeprowadź szczegółową analizę SWOT dla firmy [NAZWA_FIRMY] działającej w branży [BRANŻA]...",
    tags: ["#swot", "#analiza", "+1"],
    author: {
      name: "Agnieszka Dąbrowska",
      avatar: "/avatars/aga.jpg",
      role: "Analityk biznesowy"
    },
    fullPrompt: `Przeprowadź szczegółową analizę SWOT dla firmy [NAZWA_FIRMY] działającej w branży [BRANŻA].\nAnaliza powinna zawierać:\n- Mocne strony\n- Słabe strony\n- Szanse\n- Zagrożenia`
  },
  {
    id: "9",
    title: "Kreatywny Copywriting",
    description: "Napisz 5 różnych wersji tekstu reklamowego dla produktu [PRODUKT]...",
    tags: ["#copywriting", "#reklama", "+1"],
    author: {
      name: "Paweł Kaczmarek",
      avatar: "/avatars/pawel.jpg",
      role: "Copywriter"
    },
    fullPrompt: `Napisz 5 różnych wersji tekstu reklamowego dla produktu [PRODUKT].\nKażda wersja powinna być:\n- Krótka i chwytliwa\n- Skierowana do grupy docelowej\n- Zawierać wezwanie do działania`
  },
  {
    id: "10",
    title: "Ilustracja Produktu",
    description: "Stwórz atrakcyjną ilustrację produktu [PRODUKT] w stylu...",
    tags: ["#ilustracja", "#produkt", "+1"],
    author: {
      name: "Zofia Maj",
      avatar: "/avatars/zofia.jpg",
      role: "Ilustratorka"
    },
    fullPrompt: `Stwórz atrakcyjną ilustrację produktu [PRODUKT] w stylu [STYL].\nIlustracja powinna:\n- Przyciągać uwagę\n- Być zgodna z identyfikacją wizualną\n- Być gotowa do użycia w materiałach marketingowych`
  }
];

const similarPrompts = [
  {
    title: "Fantastyczny Krajobraz",
    description: "Namaluj fantastyczny krajobraz z [ELEMENT_1] i [ELEMENT_2]. Scena powinna być magiczna i surrealistyczna...",
    author: "Michał Kowalczyk",
  },
  {
    title: "Logo Minimalistyczne",
    description: "Zaprojektuj minimalistyczne logo dla firmy [NAZWA_FIRMY] działającej w branży [BRANŻA]. Logo powinno...",
    author: "Michał Kowalczyk",
  },
  {
    title: "Ilustracja Produktu",
    description: "Stwórz atrakcyjną ilustrację produktu [PRODUKT] w stylu [STYL]. Ilustracja powinna pokazywać główne ...",
    author: "Michał Kowalczyk",
  },
];

export default async function PromptPage({
  params,
}: {
  params: { id: string }
}) {
  const prompt = prompts.find((p) => p.id === params.id);

  if (!prompt) {
    return <div>Prompt nie znaleziony</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 md:p-4">
      <div className="card w-full max-w-3xl relative mb-10 border-[1px]">
        <div className="space-y-4 p-4 pb-0">
          <h1 className="text-2xl font-bold">{prompt.title}</h1>
        </div>
        <div className="space-y-4 p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag, i) => (
              <span key={i} className="badge">{tag}</span>
            ))}
          </div>
          <div className="bubble">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-transparent p-0 rounded-lg m-0">
              {prompt.fullPrompt}
            </pre>
          </div>
        </div>
        <div className="flex justify-end p-4 pt-0">
          <CopyButton text={prompt.fullPrompt} />
        </div>
        <div className="absolute left-6 bottom-6 flex items-center gap-3">
          <Avatar>
            <AvatarImage src={prompt.author.avatar} />
            <AvatarFallback>{prompt.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm leading-tight">{prompt.author.name}</div>
            <div className="text-xs text-muted-foreground leading-tight">{prompt.author.role}</div>
          </div>
        </div>
      </div>
      <section className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-[color:var(--main-orange)] mb-6">Podobne prompty</h2>
        <div className="flex gap-6 flex-wrap">
          {similarPrompts.map((prompt, idx) => (
            <div key={idx} className="card flex-1 min-w-[280px] max-w-xs flex flex-col p-4 items-start border-[1px]">
              <div className="text-lg font-semibold text-[color:var(--main-orange)] mb-2">{prompt.title}</div>
              <div className="w-full flex justify-center mb-2">
                <div className="w-full h-24 bg-gray-100 border-[1px] border-[color:var(--main-orange)] rounded-md flex items-center justify-center">
                  <Image src="/placeholder.svg" alt="placeholder" width={160} height={60} className="object-contain" />
                </div>
              </div>
              <div className="text-sm text-[color:var(--main-orange-dark)] mb-3 line-clamp-2">{prompt.description}</div>
              <div className="flex items-center gap-2 mt-auto">
                <span className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                  <Image src="/avatar-placeholder.svg" alt="avatar" width={20} height={20} />
                </span>
                <span className="text-xs text-[color:var(--main-orange-dark)]">{prompt.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 