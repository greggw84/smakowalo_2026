'use client';

import Link from 'next/link';

export default function Regulamin() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-[#e8dcc8]">
        <h1 className="text-3xl font-semibold text-[#14532d] mb-6">Regulamin świadczenia usług</h1>
        
        <div className="prose text-[#4b5563] space-y-6">
          <p><strong>SMAKOWAŁO sp. z o.o.</strong> z siedzibą w Poznaniu przy ul. Połączyńska 11A, 60-438 Poznań, NIP: 7812067133, KRS: 0001093816 (dalej „Usługodawca”).</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">§1 Definicje</h2>
          <ul className="list-disc pl-5">
            <li><strong>Usługa</strong> – dostarczanie zestawów składników do przygotowania posiłków w domu (meal kit) w modelu subskrypcyjnym lub jednorazowym.</li>
            <li><strong>Menu tygodniowe</strong> – zestaw przepisów dostępnych w danym tygodniu.</li>
            <li><strong>Box</strong> – wybrany zestaw dań na tydzień dla określonej liczby osób.</li>
            <li><strong>Klient</strong> – osoba fizyczna lub prawna zamawiająca Usługę.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">§2 Zakres usługi</h2>
          <p>Usługodawca dostarcza dokładnie odmierzone, świeże składniki wraz z przepisami krok po kroku. Klient samodzielnie przygotowuje posiłki w domu.</p>
          <p>Usługa obejmuje dostawę na terenie Poznania i okolic (do 30 km) we wtorki lub czwartki.</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">§3 Zamówienia i płatności</h2>
          <p>Zamówienia składane są poprzez kreator na stronie. Płatność za pomocą Stripe (karta, przelew, Apple/Google Pay).</p>
          <p>Subskrypcja jest odnawialna co tydzień. Klient może pominąć tydzień, wstrzymać lub anulować subskrypcję w panelu z 48h wyprzedzeniem.</p>
          <p>Ceny podane są za box (dla 2/4/6 osób). Dostawa 19 zł (gratis od pewnej wartości).</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">§4 Alergeny i bezpieczeństwo żywności</h2>
          <p>Klient zobowiązany jest do poinformowania o alergiach i nietolerancjach podczas składania zamówienia.</p>
          <p>Usługodawca dokłada wszelkich starań, aby unikać cross-contamination, jednak nie może zagwarantować 100% braku śladów alergenów w kuchniach dostawców.</p>
          <p>Informacje odżywcze (kalorie, makro, witaminy) są przybliżone i oparte na standardowych tabelach wartości odżywczych. Nie zastępują porady dietetyka lub lekarza.</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">§5 Dostawa i odbiór</h2>
          <p>Dostawa odbywa się w wybranym dniu (wtorek/czwartek) w godzinach 16-21 lub według ustalonego slotu.</p>
          <p>Klient zobowiązany jest do odbioru w ustalonym terminie. W przypadku nieobecności paczka może zostać pozostawiona w bezpiecznym miejscu lub zwrócona – dodatkowe koszty po stronie Klienta.</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">§6 Reklamacje i odstąpienie</h2>
          <p>Reklamacje dotyczące jakości składników należy zgłaszać w ciągu 24h od dostawy na kontakt@smakowalo.pl z opisem i zdjęciami.</p>
          <p>Klient będący konsumentem ma prawo odstąpić od umowy w ciągu 14 dni bez podawania przyczyny (z wyjątkiem produktów szybko psujących się po otwarciu).</p>
          <p>Usługodawca odpowiada za wady zgodnie z rękojmią (2 lata).</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">§7 Ochrona danych osobowych</h2>
          <p>Szczegóły w Polityce Prywatności.</p>

          <h2 className="text-xl font-semibold text-[#14532d] mt-8">§8 Postanowienia końcowe</h2>
          <p>Regulamin obowiązuje od dnia publikacji. Usługodawca może go zmieniać z 14-dniowym wyprzedzeniem.</p>
          <p>Spory rozstrzygane są przez sąd właściwy dla Usługodawcy lub polubownie.</p>
          <p>Kontakt: kontakt@smakowalo.pl , tel. [wstaw numer]</p>

          <p className="text-sm mt-8">SMAKOWAŁO sp. z o.o., ul. Połączyńska 11A, 60-438 Poznań, NIP 7812067133, KRS 0001093816</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[#15803d] hover:underline">Powrót do strony głównej</Link>
        </div>
      </div>
    </div>
  );
}
