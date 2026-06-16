'use client';

import Link from 'next/link';

export default function PolitykaPrywatnosci() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-[#e8dcc8]">
        <h1 className="text-3xl font-semibold text-[#14532d] mb-6">Polityka Prywatności</h1>
        
        <div className="prose text-[#4b5563] space-y-6">
          <p><strong>SMAKOWAŁO sp. z o.o.</strong> z siedzibą w Poznaniu przy ul. Połączyńska 11A, 60-438 Poznań, NIP: 7812067133, KRS: 0001093816 (dalej „Administrator”).</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">1. Zakres i cel przetwarzania danych</h2>
          <p>Przetwarzamy dane osobowe w celu świadczenia usług (zamówienia, dostawa, personalizacja menu na podstawie preferencji i alergii), marketingu (z zgodą), obsługi klienta i spełnienia obowiązków prawnych (np. podatkowych).</p>
          <p>Dane zbierane: imię, nazwisko, adres e-mail, adres dostawy, numer telefonu, preferencje dietetyczne, alergie, historia zamówień.</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">2. Podstawa prawna</h2>
          <p>Art. 6 ust. 1 lit. b RODO (wykonanie umowy), lit. c (obowiązek prawny), lit. a (zgoda na marketing), lit. f (prawnie uzasadniony interes – np. poprawa usług).</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">3. Odbiorcy danych</h2>
          <p>Dane mogą być przekazywane dostawcom (kurierzy, dostawcy składników), dostawcom IT (Supabase, Stripe), organom państwowym na żądanie.</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">4. Prawa osoby, której dane dotyczą</h2>
          <p>Masz prawo dostępu, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, wniesienia sprzeciwu i cofnięcia zgody w dowolnym momencie. Skontaktuj się: kontakt@smakowalo.pl.</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">5. Okres przechowywania</h2>
          <p>Dane przechowywane przez okres niezbędny do realizacji umowy i obowiązków prawnych (np. 5 lat dla danych podatkowych), a dla marketingu – do cofnięcia zgody.</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">6. Pliki cookies i technologie</h2>
          <p>Używamy cookies do funkcjonowania strony, analityki i personalizacji. Możesz zarządzać nimi w przeglądarce.</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">7. Kontakt i skargi</h2>
          <p>Administrator: kontakt@smakowalo.pl. Masz prawo wnieść skargę do Prezesa UODO.</p>

          <p className="text-sm mt-8">Polityka obowiązuje od dnia publikacji. Aktualna wersja dostępna na stronie.</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[#15803d] hover:underline">Powrót do strony głównej</Link>
        </div>
      </div>
    </div>
  );
}
