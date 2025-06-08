"use server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyButton } from "@/components/copy-button";

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

export default async function PromptPage({
  params,
}: {
  params: { id: string }
}) {
  // TODO: Pobieranie danych z API lub bazy danych
  const prompt: Prompt = {
    id: params.id,
    title: "Przykładowy prompt",
    description: "Opis promptu",
    tags: ["#przykład"],
    author: {
      name: "Autor",
      avatar: "/avatar.png",
      role: "Ekspert"
    },
    fullPrompt: "Treść promptu"
  };

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
    </div>
  );
} 