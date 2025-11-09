"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: "Polityka Prywatności" }
        ]} 
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Polityka Prywatności</h1>
        <p className="text-muted-foreground">
          Polityka prywatności serwisu Biblioteka Promptów
        </p>
      </div>

      {/* Content */}
      <Card className="border-[color:var(--main-orange)]">
        <CardHeader>
          <CardTitle>Treść polityki prywatności</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">§ 1. Postanowienia Ogólne</h2>
              <p className="mb-3">
                Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez użytkowników w związku z korzystaniem z serwisu internetowego "Biblioteka Promptów", dostępnego pod adresem www.bibliotekapromptow.pl, zwanego dalej "Serwisem".
              </p>
              <p className="mb-3">
                Administratorem danych osobowych (dalej: "Administrator") jest:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Biblioteka Promptów</li>
                <li>Adres siedziby: Polska</li>
                <li>E-mail: bibliotekapromptow@gmail.com</li>
              </ul>
              <p className="mb-3">
                Administrator przetwarza dane osobowe zgodnie z przepisami Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych, dalej: RODO), Ustawy o ochronie danych osobowych oraz Ustawy o świadczeniu usług drogą elektroniczną.
              </p>
              <p className="mb-3">
                Dbamy o prywatność użytkowników Serwisu i dokładamy wszelkich starań, aby chronić przekazywane dane osobowe przed ich nieuprawnionym dostępem, ujawnieniem, zmianą lub zniszczeniem.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 2. Rodzaje Przetwarzanych Danych, Cele i Podstawy Prawne</h2>
              <p className="mb-3">
                Administrator może przetwarzać następujące dane osobowe użytkowników w następujących celach i na podstawie następujących podstaw prawnych:
              </p>
              
              <h3 className="text-lg font-medium mb-3">Dane zbierane automatycznie (dane nawigacyjne):</h3>
              <p className="mb-3">
                <strong>Rodzaj danych:</strong> Adres IP, dane dotyczące przeglądarki internetowej, systemu operacyjnego, aktywności na stronie (np. odwiedzone podstrony, czas spędzony na stronie), dane geolokalizacyjne.
              </p>
              <p className="mb-3">
                <strong>Cel przetwarzania:</strong> Zapewnienie prawidłowego funkcjonowania Serwisu, jego optymalizacja, tworzenie statystyk oglądalności, poprawa komfortu korzystania z Serwisu.
              </p>
              <p className="mb-3">
                <strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes Administratora – zapewnienie funkcjonalności i bezpieczeństwa Serwisu, prowadzenie analiz statystycznych).
              </p>

              <h3 className="text-lg font-medium mb-3">Dane zbierane w przypadku kontaktu (np. przez e-mail, formularz kontaktowy):</h3>
              <p className="mb-3">
                <strong>Rodzaj danych:</strong> Imię, nazwisko, adres e-mail, treść wiadomości, inne dane podane dobrowolnie przez użytkownika.
              </p>
              <p className="mb-3">
                <strong>Cel przetwarzania:</strong> Obsługa zapytań, udzielanie odpowiedzi, nawiązanie kontaktu w związku z przesłaną wiadomością.
              </p>
              <p className="mb-3">
                <strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. b RODO (podjęcie działań na żądanie osoby, której dane dotyczą, przed zawarciem umowy) lub Art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes Administratora – komunikacja z użytkownikami).
              </p>

              <h3 className="text-lg font-medium mb-3">Dane zbierane w celu wysyłki newslettera:</h3>
              <p className="mb-3">
                <strong>Rodzaj danych:</strong> Adres e-mail.
              </p>
              <p className="mb-3">
                <strong>Cel przetwarzania:</strong> Wysyłka informacji marketingowych, nowości o Serwisie, ofert.
              </p>
              <p className="mb-3">
                <strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. a RODO (zgoda osoby, której dane dotyczą). Zgoda może zostać wycofana w każdej chwili.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 3. Okres Przechowywania Danych</h2>
              <p className="mb-3">
                Dane nawigacyjne (automatycznie zbierane) są przechowywane przez czas niezbędny do realizacji celów, dla których zostały zebrane, lub do czasu zgłoszenia sprzeciwu/żądania usunięcia.
              </p>
              <p className="mb-3">
                Dane przekazane w związku z kontaktem są przechowywane przez okres niezbędny do udzielenia odpowiedzi i rozwiązania sprawy, a następnie mogą być archiwizowane zgodnie z przepisami prawa.
              </p>
              <p className="mb-3">
                Dane zbierane w celu wysyłki newslettera są przechowywane do czasu wycofania zgody przez użytkownika.
              </p>
              <p className="mb-3">
                Po upływie wskazanych okresów, dane osobowe są usuwane lub anonimizowane.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 4. Odbiorcy Danych</h2>
              <p className="mb-3">
                Dane osobowe użytkowników mogą być przekazywane następującym kategoriom odbiorców:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Podmioty przetwarzające dane w imieniu Administratora (tzw. procesorzy), takie jak dostawcy usług hostingowych, dostawcy systemów statystycznych (np. Google Analytics), dostawcy usług e-mail marketingowych, podmioty świadczące usługi księgowe/prawne. Podmioty te przetwarzają dane na podstawie umowy z Administratorem i wyłącznie zgodnie z jego poleceniami.</li>
                <li>Organy państwowe lub inne podmioty uprawnione na podstawie przepisów prawa, w celu realizacji obowiązków prawnych.</li>
              </ul>
              <p className="mb-3">
                Dane osobowe nie są przekazywane do państw trzecich (poza Europejski Obszar Gospodarczy), chyba że nastąpi to na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję Europejską lub innych mechanizmów zgodnych z RODO.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 5. Prawa Użytkowników</h2>
              <p className="mb-3">
                Każdemu użytkownikowi przysługują następujące prawa dotyczące jego danych osobowych:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li><strong>Prawo dostępu do danych:</strong> Użytkownik ma prawo uzyskać od Administratora potwierdzenie, czy przetwarzane są dane osobowe jego dotyczące, a jeżeli tak, to ma prawo do ich dostępu.</li>
                <li><strong>Prawo do sprostowania danych:</strong> Użytkownik ma prawo żądać od Administratora niezwłocznego sprostowania nieprawidłowych danych osobowych.</li>
                <li><strong>Prawo do usunięcia danych ("prawo do bycia zapomnianym"):</strong> Użytkownik ma prawo żądać od Administratora niezwłocznego usunięcia swoich danych osobowych w określonych przypadkach (np. dane nie są już niezbędne do celów, dla których zostały zebrane).</li>
                <li><strong>Prawo do ograniczenia przetwarzania:</strong> Użytkownik ma prawo żądać od Administratora ograniczenia przetwarzania danych w określonych sytuacjach (np. kwestionuje prawidłowość danych).</li>
                <li><strong>Prawo do przenoszenia danych:</strong> Użytkownik ma prawo otrzymać w ustrukturyzowanym, powszechnie używanym formacie nadającym się do odczytu maszynowego dane osobowe, które dostarczył Administratorowi, oraz ma prawo przesłać te dane innemu administratorowi.</li>
                <li><strong>Prawo do sprzeciwu:</strong> Użytkownik ma prawo w dowolnym momencie wnieść sprzeciw wobec przetwarzania jego danych osobowych, jeśli przetwarzanie odbywa się na podstawie prawnie uzasadnionego interesu Administratora (Art. 6 ust. 1 lit. f RODO).</li>
                <li><strong>Prawo do wycofania zgody:</strong> Jeżeli przetwarzanie danych odbywa się na podstawie zgody (Art. 6 ust. 1 lit. a RODO), użytkownik ma prawo wycofać zgodę w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej wycofaniem.</li>
                <li><strong>Prawo do wniesienia skargi do organu nadzorczego:</strong> Użytkownik ma prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa), jeśli uważa, że przetwarzanie jego danych osobowych narusza przepisy RODO.</li>
              </ul>
              <p className="mb-3">
                W celu realizacji swoich praw, użytkownik może skontaktować się z Administratorem za pośrednictwem adresu e-mail: bibliotekapromptow@gmail.com.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 6. Pliki Cookies (Ciasteczka)</h2>
              <p className="mb-3">
                Serwis wykorzystuje pliki cookies (ciasteczka) – niewielkie informacje tekstowe, wysyłane przez serwer WWW i zapisywane na urządzeniu końcowym użytkownika (komputer, tablet, smartfon).
              </p>
              <p className="mb-3">
                Pliki cookies wykorzystywane są w celu:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Dostosowania zawartości stron internetowych Serwisu do preferencji użytkownika oraz optymalizacji korzystania ze stron.</li>
                <li>Tworzenia statystyk, które pomagają zrozumieć, w jaki sposób użytkownicy korzystają ze stron internetowych, co umożliwia ulepszanie ich struktury i zawartości.</li>
                <li>Utrzymania sesji użytkownika Serwisu (po zalogowaniu), dzięki czemu użytkownik nie musi na każdej podstronie Serwisu ponownie wpisywać loginu i hasła.</li>
              </ul>
              <p className="mb-3">
                Serwis używa dwóch zasadniczych rodzajów plików cookies: "sesyjne" (session cookies) oraz "stałe" (persistent cookies).
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Cookies "sesyjne" są plikami tymczasowymi, które przechowywane są w urządzeniu końcowym użytkownika do czasu wylogowania, opuszczenia strony internetowej lub wyłączenia oprogramowania (przeglądarki internetowej).</li>
                <li>"Stałe" pliki cookies przechowywane są w urządzeniu końcowym użytkownika przez czas określony w parametrach plików cookies lub do czasu ich usunięcia przez użytkownika.</li>
              </ul>
              <p className="mb-3">
                Standardowo oprogramowanie służące do przeglądania stron internetowych domyślnie dopuszcza umieszczanie plików cookies na urządzeniu końcowym. Użytkownik może w każdej chwili zmienić ustawienia dotyczące plików cookies. Ustawienia te mogą zostać zmienione w szczególności w taki sposób, aby blokować automatyczną obsługę plików cookies w ustawieniach przeglądarki internetowej bądź informować o ich każdorazowym zamieszczeniu w urządzeniu użytkownika Serwisu.
              </p>
              <p className="mb-3">
                Szczegółowe informacje o możliwości i sposobach obsługi plików cookies dostępne są w ustawieniach oprogramowania (przeglądarki internetowej).
              </p>
              <p className="mb-3">
                Ograniczenie stosowania plików cookies może wpłynąć na niektóre funkcjonalności dostępne na stronach internetowych Serwisu.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 7. Zmiany w Polityce Prywatności</h2>
              <p className="mb-3">
                Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. O wszelkich zmianach użytkownicy zostaną poinformowani poprzez publikację nowej wersji Polityki Prywatności na stronie Serwisu. Zmiany wchodzą w życie z dniem ich publikacji.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 8. Kontakt</h2>
              <p className="mb-3">
                Wszelkie pytania i uwagi dotyczące Polityki Prywatności prosimy kierować na adres e-mail: bibliotekapromptow@gmail.com.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 