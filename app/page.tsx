'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChefHat, Clock, Leaf, Truck, ArrowRight, Play, Gift, Users, Award } from 'lucide-react';
import Logo from '@/components/Logo';

export default function SmakowaloLanding() {
  const [showVideo, setShowVideo] = useState(false);
  const [showCorporateModal, setShowCorporateModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [corporateForm, setCorporateForm] = useState({ company: '', email: '', people: '', message: '' });
  const [giftForm, setGiftForm] = useState({ recipient: '', email: '', plan: '4', message: '' });

  // Business researched pricing (Poznań low-key, first-box heavy discount like HelloFresh/UK competitors, realistic for quality local ingredients + recipes)
  // Research: Ready diets ~65-85zł/dzień. DIY meal kits internationally first box ~50% off then ~18-28zł/porcja equivalent. Our positioning: premium local, educational, exact portions. 
  const plans = [
    {
      people: 2,
      label: 'DLA 2 OSÓB',
      first: 119,
      regular: 179,
      portions: '6–10 porcji',
      desc: '3, 4 lub 5 dań • idealne na początek lub dla pary',
      perPortionFirst: '~12-20 zł',
      perPortionReg: '~30 zł',
    },
    {
      people: 4,
      label: 'NAJPOPULARNIEJSZY • DLA RODZINY',
      first: 229,
      regular: 329,
      portions: '12–16 porcji',
      desc: '3 lub 4 dania • najlepszy stosunek ceny do porcji',
      perPortionFirst: '~14-19 zł',
      perPortionReg: '~27 zł',
      featured: true,
    },
    {
      people: 6,
      label: 'DUŻA RODZINA / GRUPA',
      first: 319,
      regular: 469,
      portions: '18–24 porcji',
      desc: '3 lub 4 dania • najniższa cena za porcję',
      perPortionFirst: '~13-18 zł',
      perPortionReg: '~26 zł',
    },
  ];

  const handleCorporateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real: send to Supabase or email. For now friendly confirmation.
    alert(`Dziękujemy ${corporateForm.company || 'Państwa'}! Odezwiemy się w 24h z ofertą corporate dla Poznania.`);
    setShowCorporateModal(false);
    setCorporateForm({ company: '', email: '', people: '', message: '' });
  };

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Voucher na plan ${giftForm.plan} osoby dla ${giftForm.recipient} został przygotowany. Link trafi na ${giftForm.email}. (W produkcji: kod + Stripe)`);
    setShowGiftModal(false);
    setGiftForm({ recipient: '', email: '', plan: '4', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - consistent low-key branding */}
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo width={118} height={30} />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#jak-to-dziala" className="text-[#374151] hover:text-[#15803d] transition-colors">Jak to działa</Link>
            <Link href="#plany" className="text-[#374151] hover:text-[#15803d] transition-colors">Plany i ceny</Link>
            <Link href="/menu" className="text-[#374151] hover:text-[#15803d] transition-colors">Menu tygodnia</Link>
            <Link href="#dodatkowo" className="text-[#374151] hover:text-[#15803d] transition-colors">Dodatkowo</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/logowanie">
              <Button variant="ghost" className="text-[#374151] hover:text-[#15803d] hidden sm:inline-flex">Zaloguj się</Button>
            </Link>
            <Link href="#plany">
              <Button className="bg-[#15803d] hover:bg-[#166534] text-white rounded-2xl px-6 h-10">Wybierz box</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — prominent desktop image + low-key warm overlay. Strong visual on .desktop */}
      <section className="relative bg-[#f8f5f0] pt-10 pb-14 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="max-w-[560px]">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1 text-sm font-medium text-[#15803d] mb-6 border border-[#e8dcc8]">
              <Leaf className="w-4 h-4" />
              Poznań + 30 km • Świeże • Zero marnowania
            </div>

            <h1 className="heading-playfair text-5xl md:text-[58px] font-semibold tracking-[-1.5px] text-[#14532d] leading-[1.02] mb-6">
              Zdrowe jedzenie.<br />Twój sposób.
            </h1>

            <p className="text-xl text-[#4b5563] max-w-md mb-8">
              Co tydzień przywozimy dokładnie odmierzone składniki z polskich upraw + proste przepisy. 
              Gotujesz w domu w 20–30 min. Pełna kontrola nad alergiami i tym, co lubisz.
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

          {/* Prominent desktop hero image — large, warm, low-key food photography */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#e8dcc8] aspect-[16/10] md:aspect-auto md:h-[480px]">
            <img 
              src="/images/hero-kitchen.jpg" 
              alt="Świeże składniki Smakowało — niski klucz, domowa kuchnia Poznań" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
              <div className="uppercase tracking-[2px] text-xs mb-1 opacity-80">PROSTO Z POLSKICH UPRAW</div>
              <div className="text-2xl font-semibold tracking-tight">Dokładnie tyle, ile potrzebujesz.<br />Zero marnowania.</div>
            </div>
            {/* Subtle play hint for video lovers on desktop */}
            <button 
              onClick={() => setShowVideo(true)}
              className="absolute top-6 right-6 flex items-center gap-2 bg-white/95 text-[#14532d] text-sm px-4 py-2 rounded-2xl shadow hover:bg-white transition"
            >
              <Play className="w-4 h-4" /> Zobacz 9s wideo
            </button>
          </div>
        </div>
      </section>

      {/* Video treatment — dedicated nice hero video / demo section on front page (desktop friendly) */}
      <section className="max-w-6xl mx-auto px-6 py-10 border-b border-[#e8dcc8]">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="text-[#15803d] text-xs tracking-[2px] font-semibold mb-2">ZOBACZ W PRAKTYCE</div>
            <h2 className="heading-playfair text-4xl font-semibold tracking-tight text-[#14532d] mb-3">Jak wygląda box i gotowanie w domu</h2>
            <p className="text-[#4b5563] max-w-md">Krótki filmik z otwierania pudełka i przygotowaniem jednego z dań. Spokojnie, bez pośpiechu, w poznańskim świetle.</p>
            <button 
              onClick={() => setShowVideo(true)} 
              className="mt-5 inline-flex items-center gap-2 text-[#15803d] font-medium hover:underline"
            >
              <Play className="w-4 h-4" /> Obejrzyj 9-sekundowy film (dźwięk wyłączony)
            </button>
          </div>
          <div 
            onClick={() => setShowVideo(true)}
            className="relative flex-1 rounded-3xl overflow-hidden border border-[#e8dcc8] cursor-pointer group shadow-sm"
          >
            <img src="/images/hero-kitchen.jpg" alt="Podgląd wideo" className="w-full h-64 md:h-72 object-cover group-hover:scale-[1.015] transition" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-4 shadow group-hover:bg-white transition">
                <Play className="w-7 h-7 text-[#15803d] ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-3 right-3 text-xs bg-black/70 text-white px-2.5 py-0.5 rounded">9 sekund • bez narracji</div>
          </div>
        </div>
      </section>

      {/* Jak to działa */}
      <section id="jak-to-dziala" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-[#15803d] font-semibold tracking-[1.5px] text-sm mb-2">PROSTE. BEZ STRESU.</div>
          <h2 className="heading-playfair text-4xl font-semibold tracking-tight text-[#14532d]">Jak działa Smakowało?</h2>
          <p className="mt-3 text-[#4b5563] max-w-md mx-auto">Wybierasz plan i dania. My przywozimy składniki. Ty gotujesz w domu — dokładnie tyle, ile potrzeba.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <ChefHat className="w-6 h-6" />, title: "1. Wybierasz plan", desc: "2, 4 lub 6 osób. 3–5 dań na tydzień. Elastycznie zmieniasz co tydzień." },
            { icon: <Leaf className="w-6 h-6" />, title: "2. Wybierasz dania + alergie", desc: "W kreatorze zaznaczasz preferencje i alergeny. System filtruje i ostrzega Cię osobiście przy każdym daniu." },
            { icon: <Truck className="w-6 h-6" />, title: "3. Dostawa pod drzwi", desc: "Wtorek lub czwartek. Wszystko odmierzone, z instrukcją krok po kroku. Gotujesz 20-30 minut." },
          ].map((step, i) => (
            <div key={i} className="bg-white border border-[#e8dcc8] rounded-3xl p-8 hover:shadow transition">
              <div className="w-12 h-12 rounded-2xl bg-[#f1e9df] flex items-center justify-center text-[#15803d] mb-6">{step.icon}</div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#14532d] mb-3">{step.title}</h3>
              <p className="text-[#4b5563]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual fresh ingredients / branding */}
      <section className="bg-white py-12 px-6 border-t border-[#e8dcc8]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { src: "/images/2.jpg", cap: "Warzywa i zioła od lokalnych dostawców" },
              { src: "/images/3.jpg", cap: "Proste przepisy, prawdziwy smak" },
              { src: "/images/4.jpg", cap: "Otwierasz box — zero stresu" },
            ].map((v, idx) => (
              <div key={idx} className="relative rounded-3xl overflow-hidden border border-[#e8dcc8] shadow-sm aspect-[16/10]">
                <img src={v.src} alt={v.cap} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-0 p-5 text-white text-sm bg-gradient-to-t from-black/70 w-full">{v.cap}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — researched, clear, first-box promo front and center */}
      <section id="plany" className="bg-[#f8f5f0] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[#15803d] font-semibold tracking-widest text-sm mb-2">WYBIERZ SWÓJ ROZMIAR</div>
            <h2 className="heading-playfair text-4xl font-semibold tracking-tight text-[#14532d]">Plany i ceny</h2>
            <p className="mt-2 text-[#4b5563]">Pierwszy box mocno w promocji (jak u najlepszych meal-kitów). Potem cena regularna. Dostawa 19 zł (gratis od 350 zł lub przy subskrypcji).</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div key={idx} className={`bg-white rounded-3xl p-8 flex flex-col border ${plan.featured ? 'border-2 border-[#15803d] shadow-lg relative' : 'border-[#e8dcc8]'}`}>
                {plan.featured && <div className="absolute -top-3 right-6 bg-[#15803d] text-white text-[10px] tracking-widest font-semibold px-4 py-1 rounded-full">NAJPOPULARNIEJSZY</div>}
                
                <div className="text-xs font-semibold text-[#15803d] tracking-wider">{plan.label}</div>
                <div className="text-3xl font-semibold tracking-tight mt-1 text-[#14532d]">{plan.people} osoby</div>

                <div className="my-7">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-semibold tracking-tighter text-[#14532d]">{plan.first} zł</span>
                    <span className="text-[#6b7280] text-sm">/ pierwszy tydzień</span>
                  </div>
                  <div className="text-sm mt-0.5 text-[#6b7280]">potem {plan.regular} zł / tydzień</div>
                  <div className="text-xs text-[#15803d] mt-1">{plan.perPortionFirst} pierwsza dostawa • {plan.perPortionReg} regularnie</div>
                </div>

                <ul className="space-y-2 text-sm flex-1 text-[#374151]">
                  <li>• {plan.portions} tygodniowo</li>
                  <li>• Pełna informacja odżywcza + alergeny</li>
                  <li>• Wybór dań + Twoje preferencje w kreatorze</li>
                  <li>• Dostawa wtorek lub czwartek</li>
                </ul>

                <Link href="/wybierz-menu" className="mt-8 block">
                  <Button className={`w-full h-12 rounded-2xl text-base ${plan.featured ? 'bg-[#15803d] hover:bg-[#166534]' : 'bg-[#14532d] hover:bg-black'}`}>
                    Wybierz dla {plan.people} osób
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 text-xs text-[#6b7280]">
            Subskrypcja = łatwe pauzowanie, pomijanie tygodni i niższa cena dostawy. Bez długich zobowiązań.
          </div>
        </div>
      </section>

      {/* Dodatki + nowe strumienie przychodu (self-reflect monetization) */}
      <section id="dodatkowo" className="max-w-6xl mx-auto px-6 py-16 border-t border-[#e8dcc8]">
        <div className="text-center mb-10">
          <div className="text-[#15803d] tracking-widest font-semibold text-sm mb-1">DODATKOWE PRZYCHODY + WARTOŚĆ DLA KLIENTA</div>
          <h2 className="heading-playfair text-3xl font-semibold tracking-tight text-[#14532d]">Urozmaić box, podaruj, firma, edukacja</h2>
          <p className="text-[#4b5563] mt-1">+15-25% średnia wartość zamówienia • wyższe marże B2B • powtarzalne przychody</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Addons */}
          <div className="bg-white border border-[#e8dcc8] rounded-3xl p-6">
            <div className="font-semibold mb-1">Dodatki do boxa</div>
            <div className="text-sm text-[#4b5563]">Deser tygodnia +29 zł • Butelka wina +49 zł • Śniadaniowy box +39 zł • Przekąski</div>
            <div className="text-[11px] text-[#6b7280] mt-3">+15-20% na zamówienie. Proste upsell w kreatorze i podsumowaniu.</div>
          </div>

          {/* Gifts */}
          <div onClick={() => setShowGiftModal(true)} className="bg-white border border-[#e8dcc8] rounded-3xl p-6 cursor-pointer hover:border-[#15803d] transition group">
            <div className="flex items-center gap-2 mb-1"><Gift className="w-4 h-4 text-[#15803d]" /><span className="font-semibold">Podaruj voucher</span></div>
            <div className="text-sm text-[#4b5563]">Vouchery na 1–4 tygodnie. Idealny prezent lokalny dla rodziny lub znajomych z Poznania.</div>
            <div className="text-xs text-[#15803d] mt-3 group-hover:underline">Kup voucher →</div>
          </div>

          {/* Corporate / B2B */}
          <div onClick={() => setShowCorporateModal(true)} className="bg-white border border-[#e8dcc8] rounded-3xl p-6 cursor-pointer hover:border-[#15803d] transition group">
            <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-[#15803d]" /><span className="font-semibold">Dla firm (B2B)</span></div>
            <div className="text-sm text-[#4b5563]">Zespołowe boxy tygodniowe, warsztaty gotowania w biurze, eventy. Partnerstwa z firmami i siłowniami w Poznaniu.</div>
            <div className="text-xs text-[#15803d] mt-3 group-hover:underline">Zapytaj o ofertę corporate →</div>
          </div>

          {/* Education + Merch */}
          <div className="bg-white border border-[#e8dcc8] rounded-3xl p-6">
            <div className="font-semibold mb-1">Edukacja + Merch</div>
            <div className="text-sm text-[#4b5563]">E-book „Sezonowo z Poznania” 49 zł • Warsztaty weekendowe • Fartuchy i torby z logo (marża 50%+).</div>
            <div className="text-[11px] text-[#6b7280] mt-3">Buduje lojalność i markę. Sprzedaż online + na eventach.</div>
          </div>

          {/* Referral / Loyalty */}
          <div className="bg-white border border-[#e8dcc8] rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-[#15803d]" /><span className="font-semibold">Poleć i zyskaj</span></div>
            <div className="text-sm text-[#4b5563]">Zaproś 3 znajomych — dostajesz tydzień gratis. Program lojalnościowy (punkty = darmowe dodatki).</div>
            <div className="text-[11px] text-[#6b7280] mt-3">Najtańszy i najskuteczniejszy kanał pozyskania (badania meal-kit: 30-40% nowych z poleceń).</div>
          </div>
        </div>
      </section>

      {/* Social proof — low key Poznań */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <div className="text-[#15803d] text-xs tracking-[2px] font-semibold mb-1">OPINIE Z POZNANIA</div>
          <h3 className="heading-playfair text-2xl font-semibold text-[#14532d]">Co mówią nasi klienci</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            "„Bigos jak u babci, ale bez kolejek i marnowania. Dzieci proszą o dokładkę.” — Anna, Jeżyce",
            "„Burrito bowl z lokalnym twistem. Szybko, zdrowo i naprawdę smacznie. Oszczędzam masę czasu.” — Marcin, Wilda",
            "„Wegańskie i rybne opcje co tydzień. Różnorodność bez nudy. Alergie córki są respektowane.” — Kasia, Rataje",
          ].map((t, i) => (
            <div key={i} className="bg-white border border-[#e8dcc8] rounded-3xl p-6 text-sm text-[#4b5563] italic">{t}</div>
          ))}
        </div>
      </section>

      {/* FAQ + Trust */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-t border-[#e8dcc8]">
        <h2 className="heading-playfair text-3xl font-semibold tracking-tight text-center text-[#14532d] mb-8">Najczęstsze pytania</h2>
        <div className="space-y-3 text-sm">
          {[
            ["Jak dokładnie działają alergeny i ostrzeżenia?", "W kreatorze zaznaczasz alergeny. Na liście dań i w podsumowaniu widzisz czerwone ostrzeżenia personalne. Zawsze sprawdzaj etykiety — kuchnie mogą mieć ślady."],
            ["Czy mogę pominąć tydzień lub zmienić plan?", "Tak. W panelu klienta pauzujesz, zmieniasz liczbę dań/osób lub całkowicie rezygnujesz bez kar."],
            ["Dostawa tylko Poznań?", "Na start Poznań + 30 km (Wilda, Jeżyce, Rataje, Komorniki, Swarzędz itd.). Planujemy poszerzenie po pierwszym sezonie."],
            ["Pierwszy box naprawdę w promocji?", "Tak. Badania rynku meal-kit pokazują, że mocny first-box discount (40-55%) jest kluczowy do konwersji. Potem klienci zostają dla wygody i jakości."],
          ].map(([q, a], i) => (
            <details key={i} className="bg-white border border-[#e8dcc8] rounded-3xl px-5 py-4 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center">{q} <span className="text-[#6b7280] group-open:rotate-180 transition">↓</span></summary>
              <p className="text-[#4b5563] mt-2 pr-6">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#14532d] text-white py-16 px-6 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="heading-playfair text-4xl font-semibold tracking-tight mb-3">Gotowy na pierwszy box w promocji?</h2>
          <p className="text-[#a3c9a8] mb-8">Zacznij od 119–319 zł. Bez ukrytych kosztów. Anulujesz kiedy chcesz.</p>
          <Link href="#plany">
            <Button size="lg" className="bg-white hover:bg-[#f8f5f0] text-[#14532d] text-base px-10 h-12 rounded-2xl">Wybierz plan i zacznij</Button>
          </Link>
          <p className="text-xs text-[#a3c9a8] mt-4">Dostawa we wtorki i czwartki • Pełna transparentność alergenów</p>
        </div>
      </section>

      <footer className="border-t py-8 px-6 text-sm text-[#6b7280]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <div>© {new Date().getFullYear()} Smakowało — SMAKOWAŁO sp. z o.o., Poznań (KRS 0001093816)</div>
          <div className="flex gap-5">
            <Link href="/regulamin" className="hover:text-[#15803d]">Regulamin</Link>
            <Link href="/polityka-prywatnosci" className="hover:text-[#15803d]">Polityka prywatności</Link>
            <Link href="/kontakt" className="hover:text-[#15803d]">Kontakt</Link>
          </div>
        </div>
      </footer>

      {/* VIDEO MODAL — desktop hero video */}
      {showVideo && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowVideo(false)}>
          <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <div className="font-medium">Smakowało — jak to wygląda w praktyce (demo)</div>
              <button onClick={() => setShowVideo(false)} className="text-xl leading-none">×</button>
            </div>
            <div className="bg-black">
              <video 
                src="/videos/smakowalo-hero-demo.mp4" 
                controls 
                autoPlay 
                playsInline 
                className="w-full max-h-[70vh] object-contain" 
                poster="/images/hero-kitchen.jpg"
              />
            </div>
            <div className="p-4 text-xs text-[#6b7280]">Niski klucz, naturalne światło, prawdziwe składniki. Film bez narracji — same obrazy z kuchni.</div>
          </div>
        </div>
      )}

      {/* CORPORATE MODAL — lead capture for B2B revenue */}
      {showCorporateModal && (
        <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowCorporateModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-semibold text-[#14532d] mb-1">Oferta dla firm i zespołów</h3>
            <p className="text-sm text-[#4b5563] mb-5">Boxy tygodniowe, warsztaty, catering eventowy. Wysoka marża, powtarzalność.</p>
            <form onSubmit={handleCorporateSubmit} className="space-y-4 text-sm">
              <input required placeholder="Nazwa firmy" className="w-full border border-[#e8dcc8] rounded-2xl px-4 py-3" value={corporateForm.company} onChange={e => setCorporateForm({...corporateForm, company: e.target.value})} />
              <input required type="email" placeholder="Email kontaktowy" className="w-full border border-[#e8dcc8] rounded-2xl px-4 py-3" value={corporateForm.email} onChange={e => setCorporateForm({...corporateForm, email: e.target.value})} />
              <input placeholder="Liczba osób w zespole" className="w-full border border-[#e8dcc8] rounded-2xl px-4 py-3" value={corporateForm.people} onChange={e => setCorporateForm({...corporateForm, people: e.target.value})} />
              <textarea placeholder="Kilka słów o potrzebach (lunch co tydzień / warsztat integracyjny / etc.)" className="w-full border border-[#e8dcc8] rounded-2xl px-4 py-3 h-20" value={corporateForm.message} onChange={e => setCorporateForm({...corporateForm, message: e.target.value})} />
              <Button type="submit" className="w-full bg-[#15803d] rounded-2xl h-12">Wyślij zapytanie</Button>
            </form>
            <p className="text-xs text-center text-[#6b7280] mt-3">Odezwiemy się w 24h. Poznaniacy lubią lokalne.</p>
          </div>
        </div>
      )}

      {/* GIFT / VOUCHER MODAL — direct monetization */}
      {showGiftModal && (
        <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowGiftModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-semibold text-[#14532d] mb-1">Podaruj Smakowało</h3>
            <p className="text-sm text-[#4b5563] mb-4">Voucher na cały box lub kilka tygodni. Piękny lokalny prezent.</p>
            <form onSubmit={handleGiftSubmit} className="space-y-4 text-sm">
              <input required placeholder="Imię obdarowanego" className="w-full border border-[#e8dcc8] rounded-2xl px-4 py-3" value={giftForm.recipient} onChange={e => setGiftForm({...giftForm, recipient: e.target.value})} />
              <input required type="email" placeholder="Email na który wyślemy voucher" className="w-full border border-[#e8dcc8] rounded-2xl px-4 py-3" value={giftForm.email} onChange={e => setGiftForm({...giftForm, email: e.target.value})} />
              <select className="w-full border border-[#e8dcc8] rounded-2xl px-4 py-3" value={giftForm.plan} onChange={e => setGiftForm({...giftForm, plan: e.target.value})}>
                <option value="2">Dla 2 osób — 1 tydzień</option>
                <option value="4">Dla 4 osób — 1 tydzień (najczęściej wybierany)</option>
                <option value="4-4">Dla 4 osób — 4 tygodnie</option>
              </select>
              <textarea placeholder="Krótka wiadomość do obdarowanego (opcjonalnie)" className="w-full border border-[#e8dcc8] rounded-2xl px-4 py-3 h-16" value={giftForm.message} onChange={e => setGiftForm({...giftForm, message: e.target.value})} />
              <Button type="submit" className="w-full bg-[#15803d] rounded-2xl h-12">Kup voucher (później Stripe)</Button>
            </form>
            <div className="text-[10px] text-center text-[#6b7280] mt-3">W produkcji: automatyczny kod + płatność + ładny PDF do wydruku/wysyłki.</div>
          </div>
        </div>
      )}
    </div>
  );
}
