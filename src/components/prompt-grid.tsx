"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const prompts = [
  {
    id: "1",
    title: "Realistyczny Portret Biznesowy",
    description: "Stwórz profesjonalny portret biznesowy osoby w wieku [WIEK]...",
    tags: ["#portret", "#biznes", "+1"],
  },
  {
    id: "2",
    title: "Fantastyczny Krajobraz",
    description: "Namaluj fantastyczny krajobraz z [ELEMENT_1] i [ELEMENT_2]...",
    tags: ["#fantasy", "#krajobraz", "+1"],
  },
  {
    id: "3",
    title: "Logo Minimalistyczne",
    description: "Zaprojektuj minimalistyczne logo dla firmy [NAZWA_FIRMY]...",
    tags: ["#logo", "#minimalizm", "+1"],
  },
  {
    id: "4",
    title: "Strategia Marketingowa dla Startupów",
    description: "Stwórz szczegółową strategię marketingową dla startupu w branży [BRANŻA]...",
    tags: ["#startup", "#strategia", "+1"],
  },
  {
    id: "5",
    title: "Techniki Sprzedażowe B2B",
    description: "Opracuj listę 10 najskuteczniejszych technik sprzedażowych dla produktu [PRODUKT] w segmencie B2B...",
    tags: ["#b2b", "#sprzedaż", "+1"],
  },
  {
    id: "6",
    title: "Plan Rozwoju Osobistego",
    description: "Stwórz 90-dniowy plan rozwoju osobistego dla osoby, która chce rozwinąć umiejętności [UMIEJĘTNOŚCI]...",
    tags: ["#rozwój", "#plan", "+1"],
  },
  {
    id: "7",
    title: "Sesja Terapeutyczna CBT",
    description: "Zaprojektuj strukturę sesji terapeutycznej CBT dla klienta z problemem [PROBLEM]...",
    tags: ["#cbt", "#terapia", "+1"],
  },
  {
    id: "8",
    title: "Analiza Biznesowa SWOT",
    description: "Przeprowadź szczegółową analizę SWOT dla firmy [NAZWA_FIRMY] działającej w branży [BRANŻA]...",
    tags: ["#swot", "#analiza", "+1"],
  },
  {
    id: "9",
    title: "Kreatywny Copywriting",
    description: "Napisz 5 różnych wersji tekstu reklamowego dla produktu [PRODUKT]...",
    tags: ["#copywriting", "#reklama", "+1"],
  },
  {
    id: "10",
    title: "Ilustracja Produktu",
    description: "Stwórz atrakcyjną ilustrację produktu [PRODUKT] w stylu...",
    tags: ["#ilustracja", "#produkt", "+1"],
  },
];

export function PromptGrid() {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (prompt: typeof prompts[0], idx: number) => {
    const fullPrompt = `${prompt.title}\n${prompt.description}\n${prompt.tags.join(" ")}`;
    navigator.clipboard.writeText(fullPrompt);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="text-muted-foreground mb-4">Znaleziono {prompts.length} promptów</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {prompts.map((prompt, idx) => (
          <Link key={prompt.id} href={`/prompt/${prompt.id}`} className="block">
            <Card className="flex flex-col h-full border-[color:var(--main-orange)]">
              <CardHeader className="font-semibold text-base pb-2">{prompt.title}</CardHeader>
              <CardContent className="flex-1 flex flex-col gap-2">
                <div className="text-sm text-muted-foreground mb-2 flex-1">{prompt.description}</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {prompt.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
                <Button variant="outline" size="icon" className="self-end mt-auto hover:bg-primary hover:text-white w-10 h-10 p-0 rounded-md" title="Kopiuj prompt" onClick={(e) => { e.preventDefault(); handleCopy(prompt, idx); }}>
                  <span className="sr-only">Kopiuj</span>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {copied !== null && (
        <Alert className="mt-4">
          <AlertDescription>Prompt został skopiowany do schowka!</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 