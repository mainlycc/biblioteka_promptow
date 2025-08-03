"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CopyButton from "./comp-105";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToastNotification } from "./toast-notification";

interface Prompt {
  id: string;
  title: string;
  title_pl?: string;
  description: string;
  content_pl?: string;
  introduction?: string;
  tags: string[];
  author: string;
  author_id?: string;
  author_username?: string;
  author_profile_image?: string;
  type: 'text' | 'image' | 'video';
  images?: string[];
  tweet_url?: string;
  image_url?: string;
  tweet_id?: string;
  created_at: string;
}

export function PromptGrid() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('type', 'text') // Tylko prompty tekstowe
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Błąd podczas pobierania promptów:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (idx: number) => {
    setCopied(idx);
    setShowToast(true);
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div>
      <ToastNotification 
        message="Prompt został skopiowany do schowka!"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <div className="text-muted-foreground mb-4">Znaleziono {prompts.length} promptów tekstowych</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {prompts.map((prompt, idx) => (
          <div key={prompt.id} className="block h-full">
            <Card className="flex flex-col border-[color:var(--main-orange)] h-full min-h-[300px]">
              <Link href={`/prompt/${prompt.id}`} className="block">
                <div className="px-4 pt-2">
                  <h3 className="font-semibold text-base text-black text-center">{prompt.title}</h3>
                </div>
                
                {/* Zdjęcia dla promptów graficznych */}
                {prompt.type === 'image' && prompt.images && prompt.images.length > 0 && (
                  <div className="flex flex-1 items-center justify-center px-4 pt-2">
                    <div className="grid w-full aspect-square gap-2" style={{
                      gridTemplateColumns: prompt.images?.length === 1 ? '1fr' : '1fr 1fr',
                      gridTemplateRows: prompt.images?.length === 1 ? '1fr' : prompt.images?.length && prompt.images.length <= 2 ? '1fr' : '1fr 1fr'
                    }}>
                      {prompt.images.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Zdjęcie ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl border shadow-sm"
                          style={{
                            gridColumn: prompt.images?.length === 1 ? '1 / -1' : 'span 1',
                            gridRow: prompt.images?.length === 1 ? '1 / -1' : prompt.images?.length && prompt.images.length <= 2 ? '1 / -1' : index < 2 ? '1' : '2'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <CardContent className="flex flex-col flex-1 gap-2 pt-2 px-4 pb-0">
                  <div className="text-sm text-muted-foreground leading-normal whitespace-pre-wrap break-words overflow-hidden line-clamp-6">{prompt.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Link>
              <div className="flex justify-between items-center mt-auto px-4 py-2 border-t">
                <div className="flex items-center gap-1">
                  {prompt.author_profile_image ? (
                    <img
                      src={prompt.author_profile_image}
                      alt={prompt.author}
                      className="h-5 w-5 rounded-full object-cover border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <Avatar className={`h-5 w-5 ${prompt.author_profile_image ? 'hidden' : ''}`}>
                    <AvatarFallback className="text-xs">
                      {prompt.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {prompt.author}
                  </span>
                </div>
                <CopyButton
                  text={`${prompt.description}\n${prompt.tags.join(" ")}\nAutor: ${prompt.author}`}
                  onCopied={() => handleCopy(idx)}
                  copied={copied === idx}
                />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
} 