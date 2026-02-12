import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"

// Lazy initialization – unikamy błędu "Missing API key" podczas buildu
function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const resend = getResend()
    const supabase = getSupabase()

    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Adres email jest wymagany" },
        { status: 400 }
      )
    }

    // Walidacja formatu email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Podaj poprawny adres email" },
        { status: 400 }
      )
    }

    // Sprawdź czy email już istnieje
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json(
          { error: "Ten adres email jest już zapisany do newslettera" },
          { status: 409 }
        )
      }

      // Jeśli był wypisany - aktywuj ponownie
      await supabase
        .from("newsletter_subscribers")
        .update({ status: "active", resubscribed_at: new Date().toISOString() })
        .eq("id", existing.id)
    } else {
      // Zapisz nowego subskrybenta
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: email.toLowerCase().trim(),
          status: "active",
          subscribed_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error("Błąd zapisu do Supabase:", insertError)
        return NextResponse.json(
          { error: "Nie udało się zapisać do newslettera. Spróbuj ponownie." },
          { status: 500 }
        )
      }
    }

    // Wyślij email powitalny przez Resend
    try {
      await resend.emails.send({
        from: "Biblioteka Promptów <newsletter@bibliotekapromptow.pl>",
        to: email.toLowerCase().trim(),
        subject: "🎉 Witaj w newsletterze Biblioteki Promptów!",
        html: getWelcomeEmailHtml(email),
      })
    } catch (emailError) {
      // Nie blokujemy zapisu nawet jeśli email się nie wyślał
      console.error("Błąd wysyłki emaila powitalnego:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Zapisano do newslettera!",
    })
  } catch (error) {
    console.error("Błąd API newsletter:", error)
    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie." },
      { status: 500 }
    )
  }
}

function getWelcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Witaj w newsletterze!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fff7ed; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); padding: 16px 32px; border-radius: 16px;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
          📚 Biblioteka Promptów
        </h1>
      </div>
    </div>

    <!-- Main Card -->
    <div style="background: #ffffff; border-radius: 16px; padding: 40px 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #fed7aa;">
      
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
        <h2 style="margin: 0 0 8px 0; color: #1f2937; font-size: 28px; font-weight: 700;">
          Witaj w naszym newsletterze!
        </h2>
        <p style="margin: 0; color: #6b7280; font-size: 16px;">
          Cieszymy się, że dołączasz do społeczności Biblioteki Promptów
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
        Cześć! 👋
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
        Dziękujemy za zapisanie się do naszego newslettera. Od teraz będziesz otrzymywać:
      </p>

      <div style="background: #fff7ed; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div style="display: flex; align-items: start; margin-bottom: 12px;">
          <span style="margin-right: 12px; font-size: 20px;">⚡</span>
          <div>
            <strong style="color: #1f2937;">Najlepsze prompty tygodnia</strong>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Sprawdzone szablony dla ChatGPT, Claude i Gemini</p>
          </div>
        </div>
        <div style="display: flex; align-items: start; margin-bottom: 12px;">
          <span style="margin-right: 12px; font-size: 20px;">📈</span>
          <div>
            <strong style="color: #1f2937;">Porady prompt engineering</strong>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Eksperckie wskazówki jak pisać lepsze prompty</p>
          </div>
        </div>
        <div style="display: flex; align-items: start;">
          <span style="margin-right: 12px; font-size: 20px;">🚀</span>
          <div>
            <strong style="color: #1f2937;">Nowości ze świata AI</strong>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Najnowsze narzędzia i trendy</p>
          </div>
        </div>
      </div>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">
        W międzyczasie zachęcamy do przeglądania naszej biblioteki:
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 28px 0;">
        <a href="https://bibliotekapromptow.pl/prompty" 
           style="display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Przeglądaj prompty →
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
        Pozdrawiamy,<br/>
        <strong style="color: #374151;">Zespół Biblioteki Promptów</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding: 0 20px;">
      <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0 0 8px 0;">
        Otrzymujesz tego emaila, ponieważ zapisałeś się na newsletter na stronie
        <a href="https://bibliotekapromptow.pl" style="color: #f97316;">bibliotekapromptow.pl</a>
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        Jeśli nie chcesz więcej otrzymywać wiadomości,
        <a href="https://bibliotekapromptow.pl/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" 
           style="color: #f97316;">wypisz się tutaj</a>.
      </p>
      <p style="color: #d1d5db; font-size: 11px; margin: 16px 0 0 0;">
        © ${new Date().getFullYear()} Biblioteka Promptów
      </p>
    </div>
  </div>
</body>
</html>`
}
