'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Kontakt() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] py-12 px-6">
      <div className="max-w-3xl mx-auto mb-6">
        <Link href="/"><Logo width={168} height={42} /></Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-[#e8dcc8]">
        <h1 className="text-3xl font-semibold text-[#14532d] mb-3">Kontakt</h1>
        <p className="text-[#4b5563] mb-8">
          Pytania o box, dostawę, alergie albo współpracę — napisz. Odpowiadamy zwykle w ciągu 24 godzin.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <a
            href="mailto:kontakt@smakowalo.pl"
            className="block border border-[#e8dcc8] rounded-2xl p-5 hover:border-[#15803d]"
          >
            <div className="text-xs text-[#6b7280] mb-1">E-mail</div>
            <div className="font-medium text-[#14532d]">kontakt@smakowalo.pl</div>
          </a>
          <div className="border border-[#e8dcc8] rounded-2xl p-5">
            <div className="text-xs text-[#6b7280] mb-1">Dostawa</div>
            <div className="font-medium text-[#14532d]">Poznań + 30 km</div>
            <div className="text-sm text-[#6b7280] mt-1">Wtorek lub czwartek</div>
          </div>
        </div>

        <div className="text-[#4b5563] space-y-2 text-sm mb-8">
          <p className="font-semibold text-[#14532d]">SMAKOWAŁO sp. z o.o.</p>
          <p>ul. Połączyńska 11A, 60-438 Poznań</p>
          <p>NIP 7812067133 • KRS 0001093816</p>
        </div>

        <a
          href="mailto:kontakt@smakowalo.pl?subject=Wiadomość%20ze%20strony%20Smakowało"
          className="inline-flex items-center justify-center bg-[#15803d] hover:bg-[#166534] text-white font-medium px-6 py-3 rounded-2xl"
        >
          Napisz e-mail
        </a>

        <div className="mt-8 text-center text-sm">
          <Link href="/" className="text-[#15803d] hover:underline">Powrót do strony głównej</Link>
          <span className="text-[#d1c4b0] mx-2">•</span>
          <Link href="/regulamin" className="text-[#6b7280] hover:text-[#15803d]">Regulamin</Link>
          <span className="text-[#d1c4b0] mx-2">•</span>
          <Link href="/polityka-prywatnosci" className="text-[#6b7280] hover:text-[#15803d]">Polityka prywatności</Link>
        </div>
      </div>
    </div>
  );
}
