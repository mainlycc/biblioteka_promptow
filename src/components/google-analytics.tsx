import Script from 'next/script'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export function GoogleAnalytics() {
  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

// Funkcja do śledzenia zdarzeń
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Funkcja do śledzenia kopiowania promptów
export const trackPromptCopy = (promptTitle: string) => {
  trackEvent('copy_prompt', 'engagement', promptTitle, 1)
}

// Funkcja do śledzenia udostępniania promptów
export const trackPromptShare = (promptTitle: string) => {
  trackEvent('share_prompt', 'engagement', promptTitle, 1)
}

// Funkcja do śledzenia wypełnienia formularza kontaktowego
export const trackContactForm = () => {
  trackEvent('submit_contact_form', 'conversion', 'contact_form', 1)
}

// Funkcja do śledzenia zapisania się do newslettera
export const trackNewsletterSignup = () => {
  trackEvent('newsletter_signup', 'conversion', 'newsletter', 1)
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
} 