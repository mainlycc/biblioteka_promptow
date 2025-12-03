"use client"

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Pokaż przycisk po przewinięciu o 300px w dół
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Nasłuchuj zdarzeń scroll
    window.addEventListener('scroll', toggleVisibility)

    // Sprawdź początkową pozycję
    toggleVisibility()

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0 shadow-lg',
        'bg-[#d03801] hover:bg-[#a02d01] text-white',
        'transition-all duration-300 ease-in-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      aria-label="Przewiń do góry"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}

