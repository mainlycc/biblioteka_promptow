"use client";
import React, { useState } from "react";
import { Copy } from "lucide-react";

interface GraphicCardProps {
  images: string[]; // tablica ścieżek do obrazków PNG (max 4)
  author?: string;
  avatarUrl?: string;
  copyText?: string;
}

export function GraphicCard({ images, author = "Autor", avatarUrl = "/avatar.png", copyText = "" }: GraphicCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyText) {
      navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card flex-1 max-w-[320px] w-full mb-4 grid grid-cols-2 grid-rows-2 gap-2 aspect-square p-4 relative">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-center bg-white rounded shadow-inner border border-orange-100 overflow-hidden">
          {images[i] ? (
            <img src={images[i]} alt={`Obrazek ${i + 1}`} className="max-w-[80%] max-h-[80%] object-contain" />
          ) : (
            <span className="text-xs text-muted-foreground">Brak obrazka</span>
          )}
        </div>
      ))}
      {/* Dolny pasek z avatarem, autorem i przyciskiem kopiowania */}
      <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between gap-2 bg-white/80 px-4 py-2 border-t border-orange-100">
        <div className="flex items-center gap-2">
          <img src={avatarUrl} alt={author} className="w-8 h-8 rounded-full border border-orange-200 object-cover" />
          <span className="text-sm font-medium text-main-orange-dark">{author}</span>
        </div>
        <button
          type="button"
          className={`w-10 h-10 p-0 rounded-md border border-main-orange bg-main-orange-light text-main-orange-dark hover:bg-main-orange hover:text-white transition flex items-center justify-center ${copied ? 'bg-main-orange text-white' : ''}`}
          onClick={handleCopy}
          title="Kopiuj"
        >
          <Copy className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 