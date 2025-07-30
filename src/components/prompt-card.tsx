"use client"

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export function PromptCard({ id, title, description, tags }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card w-full mb-4">
      <div className="font-semibold text-xl">
        <Link href={`/prompt/${id}`} className="hover:underline">
          {title}
        </Link>
      </div>
      <div className="flex flex-col gap-4 mt-2 flex-1">
        <div className="flex flex-row items-end gap-2 flex-1">
          <div className="text-muted-foreground flex-1">{description}</div>
          <Button
            variant="outline"
            className="w-10 h-10 p-0 rounded-md"
            onClick={handleCopy}
          >
            {copied ? "Skopiowano!" : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="badge">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
} 