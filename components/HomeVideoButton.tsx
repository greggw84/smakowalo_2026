'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

export default function HomeVideoButton({
  variant = 'fab',
}: {
  variant?: 'fab' | 'inline' | 'thumb';
}) {
  const [open, setOpen] = useState(false);

  const trigger =
    variant === 'inline' ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 inline-flex items-center gap-2 text-[#15803d] font-medium hover:underline"
      >
        <Play className="w-4 h-4" /> Obejrzyj 9-sekundowy film (dźwięk wyłączony)
      </button>
    ) : variant === 'thumb' ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex-1 rounded-3xl overflow-hidden border border-[#e8dcc8] cursor-pointer group shadow-sm text-left w-full"
      >
        <img src="/images/hero-kitchen.jpg" alt="Podgląd wideo" width={800} height={450} className="w-full h-64 md:h-72 object-cover group-hover:scale-[1.015] transition" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-4 shadow group-hover:bg-white transition">
            <Play className="w-7 h-7 text-[#15803d] ml-0.5" />
          </div>
        </div>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Odtwórz wideo"
        className="absolute top-6 right-6 flex items-center justify-center w-11 h-11 bg-white/95 text-[#14532d] rounded-full shadow hover:bg-white transition z-10"
      >
        <Play className="w-4 h-4 ml-0.5" />
      </button>
    );

  return (
    <>
      {trigger}
      {open && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="relative max-w-4xl w-full overflow-hidden rounded-3xl bg-black" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zamknij"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white text-xl leading-none hover:bg-black/80"
            >
              ×
            </button>
            <video
              src="/videos/smakowalo-hero-demo.mp4"
              controls
              autoPlay
              playsInline
              className="w-full max-h-[80vh] object-contain"
              poster="/images/hero-kitchen.jpg"
            />
          </div>
        </div>
      )}
    </>
  );
}
