import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return new NextResponse(getUnsubscribeHtml(false, "Brak adresu email."), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  }

  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ 
        status: "unsubscribed", 
        unsubscribed_at: new Date().toISOString() 
      })
      .eq("email", email.toLowerCase().trim())

    if (error) {
      console.error("Błąd wypisywania z newslettera:", error)
      return new NextResponse(
        getUnsubscribeHtml(false, "Wystąpił błąd. Spróbuj ponownie później."),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      )
    }

    return new NextResponse(
      getUnsubscribeHtml(true, "Zostałeś wypisany z newslettera."),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    )
  } catch {
    return new NextResponse(
      getUnsubscribeHtml(false, "Wystąpił nieoczekiwany błąd."),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    )
  }
}

function getUnsubscribeHtml(success: boolean, message: string): string {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter - Wypisanie</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff7ed; margin: 0; padding: 40px 20px; }
    .container { max-width: 480px; margin: 0 auto; text-align: center; background: white; border-radius: 16px; padding: 48px 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { color: ${success ? "#16a34a" : "#dc2626"}; font-size: 24px; margin-bottom: 12px; }
    p { color: #6b7280; font-size: 16px; line-height: 1.6; }
    a { display: inline-block; margin-top: 24px; background: linear-gradient(135deg, #f97316, #ea580c); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${success ? "✅" : "❌"}</div>
    <h1>${message}</h1>
    <p>${success 
      ? "Nie będziesz już otrzymywać naszych emaili. Jeśli zmienisz zdanie, zawsze możesz się ponownie zapisać." 
      : "Coś poszło nie tak. Skontaktuj się z nami jeśli problem się powtarza."
    }</p>
    <a href="https://bibliotekapromptow.pl">Wróć na stronę główną</a>
  </div>
</body>
</html>`
}
