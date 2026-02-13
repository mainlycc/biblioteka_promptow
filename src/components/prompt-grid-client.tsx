"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CopyButton from "./comp-105";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToastNotification } from "./toast-notification";
import { useSearch } from "@/contexts/search-context";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Prompt {
  id: string;
  title: string;
  title_pl?: string;
  description: string;
  content_pl?: string;
  introduction?: string;
  tags: string[];
  category?: string;
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

const ITEMS_PER_PAGE = 16;

interface PromptGridClientProps {
  prompts: Prompt[];
}

export function PromptGridClient({ prompts }: PromptGridClientProps) {
  const [copied, setCopied] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchQuery } = useSearch();

  // Resetuj do pierwszej strony przy zmianie wyszukiwania
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filtrowanie promptów po tagach na podstawie wyszukiwania
  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) {
      return prompts;
    }

    const query = searchQuery.trim().toLowerCase();
    return prompts.filter((prompt) => {
      if (!prompt.tags || prompt.tags.length === 0) {
        return false;
      }
      // Sprawdź czy którykolwiek tag zawiera wpisane słowo
      return prompt.tags.some((tag) => 
        tag.toLowerCase().includes(query)
      );
    });
  }, [prompts, searchQuery]);

  // Obliczanie paginacji
  const totalPages = Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE);
  
  // Pobierz prompty dla aktualnej strony
  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPrompts.slice(startIndex, endIndex);
  }, [filteredPrompts, currentPage]);

  // Generowanie numerów stron do wyświetlenia
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Jeśli jest mało stron, pokaż wszystkie
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Zawsze pokazuj pierwszą stronę
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Pokaż strony wokół aktualnej
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Zawsze pokazuj ostatnią stronę
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopy = (idx: number) => {
    setCopied(idx);
    setShowToast(true);
  };

  return (
    <div>
      <ToastNotification 
        message="Prompt został skopiowany do schowka!"
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 items-stretch">
        {paginatedPrompts.map((prompt, idx) => {
          // Oblicz globalny indeks dla kopiowania
          const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
          return (
          <div key={prompt.id} className="block h-full">
            <Card className="flex flex-col border-[color:var(--main-orange)] h-full min-h-[280px] md:min-h-[300px]">
              <Link href={`/prompt/${prompt.id}`} className="block">
                <div className="px-3 md:px-4 pt-1">
                  <h3 className="font-semibold text-sm md:text-base text-black text-center leading-tight">{prompt.title_pl}</h3>
                </div>
                
                {/* Zdjęcia dla promptów graficznych */}
                {prompt.type === 'image' && prompt.images && prompt.images.length > 0 && (
                  <div className="flex flex-1 items-center justify-center px-4 pt-1">
                    <div className="grid w-full aspect-square gap-2" style={{
                      gridTemplateColumns: prompt.images?.length === 1 ? '1fr' : '1fr 1fr',
                      gridTemplateRows: prompt.images?.length === 1 ? '1fr' : prompt.images?.length && prompt.images.length <= 2 ? '1fr' : '1fr 1fr'
                    }}>
                      {prompt.images
                        .filter((imageUrl) => {
                          // Filtrujemy tylko prawidłowe URL-e przed renderowaniem
                          try {
                            if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                              new URL(imageUrl)
                              return true
                            }
                            if (imageUrl.startsWith('/')) {
                              return true
                            }
                            return false
                          } catch {
                            return false
                          }
                        })
                        .map((imageUrl, index) => {
                          const displayTitle = prompt.title_pl || prompt.title || "Prompt"
                          const altText = `${displayTitle} - przykład ${index + 1}`
                          
                          return (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={altText}
                              className="w-full h-full object-cover rounded-xl border shadow-sm"
                              style={{
                                gridColumn: prompt.images?.length === 1 ? '1 / -1' : 'span 1',
                                gridRow: prompt.images?.length === 1 ? '1 / -1' : prompt.images?.length && prompt.images.length <= 2 ? '1 / -1' : index < 2 ? '1' : '2'
                              }}
                              onError={(e) => {
                                // Ukryj zepsuty obraz
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )
                        })}
                    </div>
                  </div>
                )}
                
                <CardContent className="flex flex-col flex-1 gap-2 pt-1 px-3 md:px-4 pb-0">
                  <div className="text-xs md:text-sm text-muted-foreground leading-normal whitespace-pre-wrap break-words overflow-hidden line-clamp-4 md:line-clamp-6">{prompt.description}</div>
                  {prompt.category && (
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-300">
                        {prompt.category}
                      </Badge>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Link>
              <div className="flex justify-between items-center mt-auto px-3 md:px-4 py-1 border-t">
                <div className="flex items-center gap-1">
                  {prompt.author_profile_image ? (
                    <img
                      src={prompt.author_profile_image}
                      alt={prompt.author}
                      className="h-4 w-4 md:h-5 md:w-5 rounded-full object-cover border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <Avatar className={`h-4 w-4 md:h-5 md:w-5 ${prompt.author_profile_image ? 'hidden' : ''}`}>
                    <AvatarFallback className="text-xs">
                      {prompt.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {prompt.author}
                  </span>
                </div>
                <CopyButton
                  text={`${prompt.description}\n${prompt.tags.join(" ")}\nAutor: ${prompt.author}`}
                  onCopied={() => handleCopy(globalIdx)}
                  copied={copied === globalIdx}
                />
              </div>
            </Card>
          </div>
        );
        })}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-label="Poprzednia strona"
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page as number);
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-label="Następna strona"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
