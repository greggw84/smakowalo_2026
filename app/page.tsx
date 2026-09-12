import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChefHat, Leaf, Truck, ArrowRight, Gift, Users, Award } from 'lucide-react';
import Logo from '@/components/Logo';
import HomeVideoButton from '@/components/HomeVideoButton';
import { PLAN_PRICES, PER_PORTION_WEEK1, type PlanPeople } from '@/lib/pricing';
import { buildMetadata, ROUTE_SEO, FAQ_ITEMS } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(ROUTE_SEO.home);

const plans: {
  people: PlanPeople;
  label: string;
  portions: string;
  desc: string;
  featured?: boolean;
}[] = [
  { people: 2, label: 'DLA 2 OSÓB', portions: '6–10 porcji', desc: '3, 4 lub 5 dań • idealne na początek lub dla pary' },
  { people: 4, label: 'NAJPOPULARNIEJSZY • DLA RODZINY', portions: '12–16 porcji', desc: '3 lub 4 dania • najlepszy stosunek ceny do porcji', featured: true },
  { people: 6, label: 'DUŻA RODZINA / GRUPA', portions: '18–24 porcji', desc: '3 lub 4 dania • najniższa cena za porcję' },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'AcceptedAnswer', text: item.answer },
  })),
};

export default function SmakowaloLanding() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><Logo width={168} height={42} /></Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#jak-to-dziala" className="text-[#374151] hover:text-[#15803d] transition-colors">Jak to działa</Link>
            <Link href="#plany" className="text-[#374151] hover:text-[#15803d] transition-colors">Plany i ceny</Link>
            <Link href="/menu" className="text-[#374151] hover:text-[#15803d] transition-colors">Menu tygodnia</Link>
            <Link href="#dodatkowo" className="text-[#374151] hover:text-[#15803d] transition-colors">Dodatkowo</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/logowanie"><Button variant="ghost" className="text-[#374151] hover:text-[#15803d] hidden sm:inline-flex">Zaloguj się</Button></Link>
            <Link href="#plany"><Button className="bg-[#15803d] hover:bg-[#166534] text-white rounded-2xl px-6 h-10">Wybierz box</Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative bg-[#f8f5f0] pt-10 pb-14 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="max-w-[560px]">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1 text-sm font-medium text-[#15803d] mb-6 border border-[#e8dcc8]">
              <Leaf className="w-4 h-4" />
              Poznań + 30 km • Świeże • Zero marnowania
            </div>
            <h1 className="heading-playfair text-5xl md:text-[58px] font-semibold tracking-[-1.5px] text-[#14532d] leading-[1.02] mb-6">
              Zdrowe zestawy do gotowania — Poznań i okolice
            </h1>
            <p className="text-xl text-[#4b5563] max-w-md mb-8">
              Co tydzień przywozimy dokładnie odmierzone składniki z polskich upraw + proste przepisy.
              Większość dań 25–40 min — dokładny czas na karcie dania. Pełna kontrola nad alergiami i tym, co lubisz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/wybierz-menu">
                <Button size="lg" className="bg-[#15803d] hover:bg-[#166534] text-base px-9 h-13 rounded-2xl w-full sm:w-auto">
                  Zacznij wybierać menu <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/menu">
                <Button size="lg" variant="outline" className="border-[#15803d] text-[#15803d] hover:bg-[#15803d] hover:text-white text-base px-8 h-13 rounded-2xl w-full sm:w-auto">
                  Zobacz menu tygodnia
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-[#6b7280]">
              Dostawa wtorek / czwartek • Subskrypcja lub jednorazowo • Pierwszy box w promocji
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#e8dcc8] aspect-[16/10] md:aspect-auto md:h-[480px]">
            <img src="/images/hero-kitchen.jpg" alt="Świeże składniki Smakowało — niski klucz, domowa kuchnia Poznań" width={960} height={600} className="absolute inset-0 w-full h-full object-cover" />
            <HomeVideoButton variant="fab" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 border-b border-[#e8dcc8]">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="heading-playfair text-4xl font-semibold tracking-tight text-[#14532d] mb-3">Jak wygląda box i gotowanie w domu</h2>
            <p className="text-[#4b5563] max-w-md">Krótki filmik z otwierania pudełka i przygotowaniem jednego z dań. Spokojnie, bez pośpiechu, w poznańskim świetle.</p>
            <HomeVideoButton variant="inline" />
          </div>
          <HomeVideoButton variant="thumb" />
        </div>
      </section>

      <section id="jak-to-dziala" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-[#15803d] font-semibold tracking-[1.5px] text-sm mb-2">PROSTE. BEZ STRESU.</div>
          <h2 className="heading-playfair text-4xl font-semibold tracking-tight text-[#14532d]">Jak działa Smakowało?</h2>
          <p className="mt-3 text-[#4b5563] max-w-md mx-auto">Wybierasz plan i dania. My przywozimy składniki. Ty gotujesz w domu — dokładnie tyle, ile potrzeba.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <ChefHat className="w-6 h-6" />, title: '1. Wybierasz plan', desc: '2, 4 lub 6 osób. 3–5 dań na tydzień. Elastycznie zmieniasz co tydzień.' },
            { icon: <Leaf className="w-6 h-6" />, title: '2. Wybierasz dania + alergie', desc: 'W kreatorze zaznaczasz preferencje i alergeny. System filtruje i ostrzega Cię osobiście przy każdym daniu.' },
            { icon: <Truck className="w-6 h-6" />, title: '3. Dostawa pod drzwi', desc: 'Wtorek lub czwartek (okno 16–21). Wszystko odmierzone, z instrukcją. Większość dań 25–40 min — dokładny czas na karcie dania.' },
          ].map((step, i) => (
            <div key={i} className="bg-white border border-[#e8dcc8] rounded-3xl p-8 hover:shadow transition">
              <div className="w-12 h-12 rounded-2xl bg-[#f1e9df] flex items-center justify-center text-[#15803d] mb-6">{step.icon}</div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#14532d] mb-3">{step.title}</h3>
              <p className="text-[#4b5563]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 px-6 border-t border-[#e8dcc8]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { src: '/images/2.jpg', cap: 'Warzywa i zioła od lokalnych dostawców' },
              { src: '/images/3.jpg', cap: 'Proste przepisy, prawdziwy smak' },
              { src: '/images/4.jpg', cap: 'Otwierasz box — zero stresu' },
            ].map((v, idx) => (
              <div key={idx} className="relative rounded-3xl overflow-hidden border border-[#e8dcc8] shadow-sm aspect-[16/10]">
                <img src={v.src} alt={v.cap} width={640} height={400} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plany" className="bg-[#f8f5f0] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[#15803d] font-semibold tracking-widest text-sm mb-2">WYBIERZ SWÓJ ROZMIAR</div>
            <h2 className="heading-playfair text-4xl font-semibold tracking-tight text-[#14532d]">Plany i ceny</h2>
            <p className="mt-2 text-[#4b5563]">
              Duża liczba = cena boxa w 1. tygodniu. Dostawa: 19 zł · 0 zł przy sub. Subskrypcja lub jednorazowo — bez długich zobowiązań.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const prices = PLAN_PRICES[plan.people];
              return (
                <div key={plan.people} className={`bg-white rounded-3xl p-8 flex flex-col border ${plan.featured ? 'border-2 border-[#15803d] shadow-lg relative' : 'border-[#e8dcc8]'}`}>
                  {plan.featured && <div className="absolute -top-3 right-6 bg-[#15803d] text-white text-[10px] tracking-widest font-semibold px-4 py-1 rounded-full">NAJPOPULARNIEJSZY</div>}
                  <div className="text-xs font-semibold text-[#15803d] tracking-wider">{plan.label}</div>
                  <div className="text-3xl font-semibold tracking-tight mt-1 text-[#14532d]">{plan.people} osoby</div>
                  <div className="my-7">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-semibold tracking-tighter text-[#14532d]">{prices.promo} zł</span>
                      <span className="text-[#6b7280] text-sm">/ box w 1. tygodniu</span>
                    </div>
                    <div className="text-sm mt-0.5 text-[#6b7280]">od 2. tygodnia {prices.regular} zł / box</div>
                    <div className="text-xs text-[#15803d] mt-1">{PER_PORTION_WEEK1[plan.people]}</div>
                    <div className="text-xs text-[#6b7280] mt-1">Dostawa: 19 zł · 0 zł przy sub</div>
                  </div>
                  <ul className="space-y-2 text-sm flex-1 text-[#374151]">
                    <li>• {plan.portions} tygodniowo</li>
                    <li>• Jednorazowo (Ten tydzień) lub subskrypcja (Co tydzień)</li>
                    <li>• Pełna informacja odżywcza + alergeny</li>
                    <li>• Dostawa wtorek lub czwartek</li>
                  </ul>
                  <Link href={`/wybierz-menu?osoby=${plan.people}&sub=0`} className="mt-8 block">
                    <Button className={`w-full h-12 rounded-2xl text-base ${plan.featured ? 'bg-[#15803d] hover:bg-[#166534]' : 'bg-[#14532d] hover:bg-black'}`}>
                      Wybierz dla {plan.people} osób
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-6 text-xs text-[#6b7280]">
            Subskrypcja = pauza / skip z 48 h wyprzedzeniem i dostawa 0 zł. Jednorazowo = ten tydzień + 19 zł dostawy (gratis od 350 zł).
          </div>
        </div>
      </section>

      <section id="dodatkowo" className="max-w-6xl mx-auto px-6 py-16 border-t border-[#e8dcc8]">
        <div className="text-center mb-10">
          <div className="text-[#15803d] tracking-widest font-semibold text-sm mb-1">COŚ WIĘCEJ NIŻ BOX</div>
          <h2 className="heading-playfair text-3xl font-semibold tracking-tight text-[#14532d]">Urozmaćnij box, podaruj, firma, edukacja</h2>
          <p className="text-[#4b5563] mt-1">Dodatki, vouchery, oferta dla firm i program poleceń</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="bg-white border border-[#e8dcc8] rounded-3xl p-6">
            <div className="font-semibold mb-1">Dodatki do boxa</div>
            <div className="text-sm text-[#4b5563]">Deser tygodnia +29 zł • Butelka wina +49 zł • Śniadaniowy box +39 zł • Przekąski</div>
          </div>
          <a href="mailto:kontakt@smakowalo.pl?subject=Voucher%20Smakowa%C5%82o&body=Dzie%C5%84%20dobry%2C%0A%0AChc%C4%99%20zam%C3%B3wi%C4%87%20voucher%20Smakowa%C5%82o.%0A%0APlan%20(osoby)%3A%0ALiczba%20tygodni%3A%0A" className="bg-white border border-[#e8dcc8] rounded-3xl p-6 hover:border-[#15803d] transition group block">
            <div className="flex items-center gap-2 mb-1"><Gift className="w-4 h-4 text-[#15803d]" /><span className="font-semibold">Podaruj voucher</span></div>
            <div className="text-sm text-[#4b5563]">Vouchery na 1–4 tygodnie. Idealny prezent lokalny dla rodziny lub znajomych z Poznania.</div>
            <div className="text-xs text-[#15803d] mt-3 group-hover:underline">Napisz na kontakt@smakowalo.pl →</div>
          </a>
          <a href="mailto:kontakt@smakowalo.pl?subject=Oferta%20B2B%20/%20dla%20firm%20Smakowa%C5%82o&body=Dzie%C5%84%20dobry%2C%0A%0AProsz%C4%99%20o%20ofert%C4%99%20dla%20firm%20(B2B).%0A%0ANazwa%20firmy%3A%0ALiczba%20os%C3%B3b%3A%0A" className="bg-white border border-[#e8dcc8] rounded-3xl p-6 hover:border-[#15803d] transition group block">
            <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-[#15803d]" /><span className="font-semibold">Dla firm (B2B)</span></div>
            <div className="text-sm text-[#4b5563]">Zespołowe boxy tygodniowe, warsztaty gotowania w biurze, eventy. Partnerstwa z firmami i siłowniami w Poznaniu.</div>
            <div className="text-xs text-[#15803d] mt-3 group-hover:underline">Zapytaj: kontakt@smakowalo.pl →</div>
          </a>
          <div className="bg-white border border-[#e8dcc8] rounded-3xl p-6">
            <div className="font-semibold mb-1">Edukacja + Merch</div>
            <div className="text-sm text-[#4b5563]">E-book „Sezonowo z Poznania” 49 zł • Warsztaty weekendowe • Fartuchy i torby z logo.</div>
          </div>
          <div className="bg-white border border-[#e8dcc8] rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-[#15803d]" /><span className="font-semibold">Poleć i zyskaj</span></div>
            <div className="text-sm text-[#4b5563]">Zaproś 3 znajomych — dostajesz tydzień gratis. Program lojalnościowy (punkty = darmowe dodatki).</div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <div className="text-[#15803d] text-xs tracking-[2px] font-semibold mb-1">OPINIE Z POZNANIA</div>
          <h3 className="heading-playfair text-2xl font-semibold text-[#14532d]">Co mówią nasi klienci</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            '„Bigos jak u babci, ale bez kolejek i marnowania. Dzieci proszą o dokładkę.” — Anna, Jeżyce',
            '„Burrito bowl z lokalnym twistem. Szybko, zdrowo i naprawdę smacznie. Oszczędzam masę czasu.” — Marcin, Wilda',
            '„Wegańskie i rybne opcje co tydzień. Różnorodność bez nudy. Alergie córki są respektowane.” — Kasia, Rataje',
          ].map((t, i) => (
            <div key={i} className="bg-white border border-[#e8dcc8] rounded-3xl p-6 text-sm text-[#4b5563] italic">{t}</div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-14 border-t border-[#e8dcc8]">
        <h2 className="heading-playfair text-3xl font-semibold tracking-tight text-center text-[#14532d] mb-8">Najczęstsze pytania</h2>
        <div className="space-y-3 text-sm">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="bg-white border border-[#e8dcc8] rounded-3xl px-5 py-4 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                {item.question} <span className="text-[#6b7280] group-open:rotate-180 transition">↓</span>
              </summary>
              <p className="text-[#4b5563] mt-2 pr-6">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[#14532d] text-white py-16 px-6 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="heading-playfair text-4xl font-semibold tracking-tight mb-3">Gotowy na pierwszy box?</h2>
          <p className="text-[#a3c9a8] mb-8">Zacznij od 119–319 zł za box (+ 19 zł dostawy jednorazowo, 0 zł przy sub). Anulujesz kiedy chcesz.</p>
          <Link href="/wybierz-menu">
            <Button size="lg" className="bg-white hover:bg-[#f8f5f0] text-[#14532d] text-base px-10 h-12 rounded-2xl">Wybierz plan i zacznij</Button>
          </Link>
          <p className="text-xs text-[#a3c9a8] mt-4">Dostawa we wtorki i czwartki • Pełna transparentność alergenów</p>
        </div>
      </section>

      <footer className="border-t py-8 px-6 text-sm text-[#6b7280]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col gap-3">
            <Logo width={150} height={38} />
            <div>© {new Date().getFullYear()} Smakowało — SMAKOWAŁO sp. z o.o., Poznań (KRS 0001093816)</div>
          </div>
          <div className="flex gap-5">
            <Link href="/regulamin" className="hover:text-[#15803d]">Regulamin</Link>
            <Link href="/polityka-prywatnosci" className="hover:text-[#15803d]">Polityka prywatności</Link>
            <Link href="/kontakt" className="hover:text-[#15803d]">Kontakt</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
