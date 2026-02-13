import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

// Lazy initialization – unikamy błędu "Missing API key" podczas buildu
function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const resend = getResend()
    const body = await request.json()
    const { name, email, subject, message } = body

    // Walidacja
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Wszystkie pola są wymagane" },
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

    // Wyślij email potwierdzający do użytkownika
    try {
      await resend.emails.send({
        from: "Biblioteka Promptów <kontakt@bibliotekapromptow.pl>",
        to: email.toLowerCase().trim(),
        subject: "Dziękujemy za kontakt - Biblioteka Promptów",
        html: getConfirmationEmailHtml(name, subject),
      })
    } catch (emailError) {
      console.error("Błąd wysyłki emaila potwierdzającego:", emailError)
      // Kontynuuj nawet jeśli email potwierdzający się nie wysłał
    }

    // Wyślij wiadomość do administratora
    try {
      await resend.emails.send({
        from: "Biblioteka Promptów <kontakt@bibliotekapromptow.pl>",
        to: "bibliotekapromptow@gmail.com",
        replyTo: email.toLowerCase().trim(),
        subject: `Nowa wiadomość kontaktowa: ${subject}`,
        html: getAdminEmailHtml(name, email, subject, message),
      })
    } catch (adminEmailError) {
      console.error("Błąd wysyłki emaila do administratora:", adminEmailError)
      return NextResponse.json(
        { error: "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Wiadomość została wysłana pomyślnie!",
    })
  } catch (error) {
    console.error("Błąd API kontakt:", error)
    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie." },
      { status: 500 }
    )
  }
}

function getConfirmationEmailHtml(name: string, subject: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dziękujemy za kontakt</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    Dziękujemy za kontakt! 🎉
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Cześć <strong>${name}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Dziękujemy za wysłanie wiadomości na temat: <strong>"${subject}"</strong>
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Otrzymaliśmy Twoją wiadomość i odpowiemy najszybciej jak to możliwe, zwykle w ciągu 24 godzin.
                  </p>
                  
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    W międzyczasie możesz sprawdzić naszą <a href="https://bibliotekapromptow.pl" style="color: #f97316; text-decoration: none; font-weight: 600;">bibliotekę promptów</a> lub przeczytać najnowsze artykuły na <a href="https://bibliotekapromptow.pl/blog" style="color: #f97316; text-decoration: none; font-weight: 600;">naszym blogu</a>.
                  </p>
                  
                  <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                    Pozdrawiamy,<br>
                    <strong>Zespół Biblioteki Promptów</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                    Biblioteka Promptów<br>
                    <a href="https://bibliotekapromptow.pl" style="color: #f97316; text-decoration: none;">bibliotekapromptow.pl</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function getAdminEmailHtml(name: string, email: string, subject: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nowa wiadomość kontaktowa</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                    📬 Nowa wiadomość kontaktowa
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <div style="margin-bottom: 25px;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Od:
                    </p>
                    <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 600;">
                      ${name}
                    </p>
                    <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
                      ${email}
                    </p>
                  </div>
                  
                  <div style="margin-bottom: 25px;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Temat:
                    </p>
                    <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 600;">
                      ${subject}
                    </p>
                  </div>
                  
                  <div style="margin-bottom: 25px;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Wiadomość:
                    </p>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border-left: 4px solid #f97316;">
                      <p style="margin: 0; color: #111827; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                        ${message.replace(/\n/g, '<br>')}
                      </p>
                    </div>
                  </div>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                      Aby odpowiedzieć, użyj funkcji "Odpowiedz" w swoim kliencie pocztowym.
                    </p>
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">
                      Email został wysłany: ${new Date().toLocaleString('pl-PL', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                    Biblioteka Promptów - System kontaktowy
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
