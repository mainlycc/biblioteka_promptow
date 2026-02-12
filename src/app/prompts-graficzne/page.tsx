"use client"

import { useState, useEffect, useMemo } from "react"
import { PromptImageCard } from "@/components/PromptImageCard"
import { supabase } from "@/lib/supabase"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Prompt {
  id: string
  title: string
  title_pl?: string
  type: 'text' | 'image' | 'video'
  author?: string
  author_username?: string
  author_profile_image?: string
  images?: string[]
  description: string
  created_at: string
}

const ITEMS_PER_PAGE = 18;

export default function PromptyGraficznePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchImagePrompts()
  }, [])

  const fetchImagePrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('type', 'image')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPrompts(data || [])
    } catch (error) {
      console.error('Błąd podczas pobierania promptów graficznych:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obliczanie paginacji
  const totalPages = Math.ceil(prompts.length / ITEMS_PER_PAGE);
  
  // Pobierz prompty dla aktualnej strony
  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return prompts.slice(startIndex, endIndex);
  }, [prompts, currentPage]);

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

  if (loading) {
    return (
      <main className="flex-1 p-8 pt-4">
        <h1 className="text-2xl font-bold mb-4">Prompty graficzne</h1>
        <div>Ładowanie...</div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-8 pt-4">
      <h1 className="text-2xl font-bold mb-4">Prompty graficzne</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {paginatedPrompts.map((prompt) => (
          <PromptImageCard key={prompt.id} prompt={prompt} />
        ))}
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
    </main>
  )
} 