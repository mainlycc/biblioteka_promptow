"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegulaminPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: "Regulamin" }
        ]} 
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Regulamin</h1>
        <p className="text-muted-foreground">
          Regulamin korzystania z serwisu Biblioteka Promptów
        </p>
      </div>

      {/* Content */}
      <Card className="border-[color:var(--main-orange)]">
        <CardHeader>
          <CardTitle>Treść regulaminu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">§ 1. Postanowienia Ogólne</h2>
              <p className="mb-3">
                Niniejszy regulamin określa zasady korzystania z serwisu internetowego "Biblioteka Promptów", dostępnego pod adresem www.bibliotekapromptow.pl, zwanego dalej "Serwisem".
              </p>
              <p className="mb-3">
                Właścicielem i administratorem Serwisu jest Biblioteka Promptów, prowadząca działalność gospodarczą pod nazwą Biblioteka Promptów, z siedzibą w Polsce, zwana dalej "Administratorem".
              </p>
              <p className="mb-3">
                Serwis "Biblioteka Promptów" to platforma gromadząca i porządkująca gotowe prompty (instrukcje, zapytania) do sztucznej inteligencji, mające na celu ułatwienie codziennego korzystania z AI dla szerokiego grona użytkowników.
              </p>
              <p className="mb-3">
                Korzystanie z Serwisu jest równoznaczne z akceptacją niniejszego regulaminu.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 2. Zakres Usług</h2>
              <p className="mb-3">
                Serwis oferuje dostęp do zbioru promptów do sztucznej inteligencji, podzielonych na kategorie tematyczne, w tym między innymi dla przedsiębiorców, freelancerów, marketerów, nauczycieli, programistów, twórców treści i pasjonatów AI.
              </p>
              <p className="mb-3">
                Treści dostępne w Serwisie są w języku polskim.
              </p>
              <p className="mb-3">
                Usługi świadczone w ramach Serwisu obejmują w szczególności:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Prezentację spisu promptów i przykładów ich zastosowań.</li>
                <li>Udostępnianie gotowych wzorców promptów do wykorzystania.</li>
                <li>Możliwość dodawania własnych promptów przez użytkowników, po weryfikacji przez Administratora.</li>
              </ul>
              <p className="mb-3">
                Administrator zastrzega sobie prawo do modyfikacji i rozbudowy Serwisu, w tym wprowadzania nowych funkcji oraz usług płatnych.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 3. Zasady Korzystania z Serwisu</h2>
              <p className="mb-3">
                Korzystanie z Serwisu jest bezpłatne w zakresie dostępu do podstawowej bazy promptów.
              </p>
              <p className="mb-3">
                Użytkownicy mogą przeglądać i wykorzystywać dostępne prompty do własnych celów, w tym komercyjnych, z zastrzeżeniem, że nie będą naruszać praw autorskich i innych praw osób trzecich.
              </p>
              <p className="mb-3">
                Zabrania się:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Kopiowania, modyfikowania, rozpowszechniania lub odsprzedawania treści Serwisu w sposób naruszający prawa autorskie Administratora lub osób trzecich.</li>
                <li>Publikowania w Serwisie treści niezgodnych z prawem, wulgarnych, obraźliwych, naruszających dobra osobiste, szerzących nienawiść lub dyskryminację.</li>
                <li>Działania mającego na celu destabilizację działania Serwisu.</li>
                <li>Wykorzystywania Serwisu do celów niezgodnych z jego przeznaczeniem.</li>
              </ul>
              <p className="mb-3">
                Administrator nie ponosi odpowiedzialności za sposób, w jaki użytkownicy wykorzystują udostępnione prompty oraz za ewentualne skutki ich zastosowania. Użytkownicy ponoszą pełną odpowiedzialność za treści generowane przy użyciu promptów z Serwisu.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 4. Prawa Autorskie</h2>
              <p className="mb-3">
                Wszelkie treści, w tym teksty, grafiki, układ Serwisu, nazwa, logo i prompty udostępnione w Serwisie (z wyłączeniem promptów dodanych przez użytkowników, jeśli taka funkcja zostanie wdrożona), stanowią własność Administratora lub są wykorzystywane na podstawie odpowiednich licencji.
              </p>
              <p className="mb-3">
                Kopiowanie i rozpowszechnianie treści Serwisu bez pisemnej zgody Administratora jest zabronione.
              </p>
              <p className="mb-3">
                W przypadku dodawania własnych promptów przez użytkowników, użytkownik oświadcza, że posiada do nich pełne prawa autorskie lub licencje i udziela Administratorowi nieodpłatnej, niewyłącznej licencji na wykorzystanie, modyfikowanie, przechowywanie i publiczne udostępnianie tych promptów w ramach Serwisu.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 5. Polityka Prywatności i Ochrona Danych Osobowych</h2>
              <p className="mb-3">
                Administrator Serwisu jest administratorem danych osobowych użytkowników w rozumieniu Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO).
              </p>
              <p className="mb-3">
                Szczegółowe zasady przetwarzania danych osobowych oraz wykorzystania plików cookies określone są w Polityce Prywatności, dostępnej pod adresem www.bibliotekapromptow.pl/polityka-prywatnosci. Użytkownik zobowiązany jest zapoznać się z Polityką Prywatności.
              </p>
              <p className="mb-3">
                Korzystanie z Serwisu oznacza akceptację warunków Polityki Prywatności.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 6. Reklamacje</h2>
              <p className="mb-3">
                Wszelkie reklamacje dotyczące działania Serwisu lub świadczonych usług należy zgłaszać na adres e-mail Administratora: bibliotekapromptow@gmail.com.
              </p>
              <p className="mb-3">
                Reklamacja powinna zawierać dokładny opis problemu oraz dane kontaktowe osoby zgłaszającej reklamację.
              </p>
              <p className="mb-3">
                Administrator rozpatrzy reklamację w terminie 14 dni od daty jej otrzymania i poinformuje użytkownika o sposobie jej rozpatrzenia.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">§ 7. Postanowienia Końcowe</h2>
              <p className="mb-3">
                Administrator zastrzega sobie prawo do zmiany niniejszego regulaminu w dowolnym czasie. O wszelkich zmianach użytkownicy zostaną poinformowani poprzez publikację nowej wersji regulaminu na stronie Serwisu. Zmiany wchodzą w życie z dniem ich publikacji.
              </p>
              <p className="mb-3">
                W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu Cywilnego oraz ustawy o świadczeniu usług drogą elektroniczną.
              </p>
              <p className="mb-3">
                Wszelkie spory wynikające z korzystania z Serwisu będą rozstrzygane przez sąd właściwy dla siedziby Administratora.
              </p>
              <p className="mb-3">
                Regulamin wchodzi w życie z dniem 30 lipca 2025 r.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 