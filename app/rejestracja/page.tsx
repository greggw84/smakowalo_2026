'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { saveUserSelection } from '@/app/actions/save-selection';
import Logo from '@/components/Logo';

// Force dynamic rendering so Supabase env vars are not required at build time
export const dynamic = 'force-dynamic';

export default function Rejestracja() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // Po udanej rejestracji próbujemy zapisać wybór z kreatora
    const savedSelection = localStorage.getItem('smakowalo_current_selection');

    if (savedSelection) {
      try {
        const selection = JSON.parse(savedSelection);

        const result = await saveUserSelection({
          peopleCount: selection.peopleCount,
          mealsPerWeek: selection.mealsPerWeek,
          dietaryPreferences: selection.selectedPreferences,
          allergens: selection.selectedAllergens,
          selectedRecipeIds: selection.selectedRecipeIds,
        });

        if (result.success) {
          localStorage.removeItem('smakowalo_current_selection');
          setMessage('Konto utworzone i Twój wybór został zapisany! Sprawdź email.');

          // Respect returnTo so the order flow continues (back to podsumowanie → payment)
          const params = new URLSearchParams(window.location.search);
          const returnTo = params.get('returnTo') || '/panel';
          setTimeout(() => {
            window.location.href = returnTo;
          }, 1200);
        } else {
          setMessage('Konto utworzone, ale nie udało się zapisać wyboru. Zaloguj się, żeby dokończyć.');
        }
      } catch (err) {
        console.error(err);
        setMessage('Konto utworzone. Sprawdź email, żeby potwierdzić rejestrację.');
      }
    } else {
      setMessage('Konto utworzone! Sprawdź swoją skrzynkę email.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/"><Logo width={120} height={30} /></Link>
          <h1 className="text-3xl font-semibold tracking-tight text-[#14532d] mt-6">Załóż konto</h1>
          <p className="text-[#4b5563] mt-2">Zapisujemy Twoje wybory i alergie na przyszłość.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#e8dcc8]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#374151]">Imię i nazwisko</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-[#e8dcc8] rounded-2xl px-4 py-3 focus:outline-none focus:border-[#15803d]"
                placeholder="Anna Kowalska"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#374151]">Adres email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-[#e8dcc8] rounded-2xl px-4 py-3 focus:outline-none focus:border-[#15803d]"
                placeholder="anna@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#374151]">Hasło</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-[#e8dcc8] rounded-2xl px-4 py-3 focus:outline-none focus:border-[#15803d]"
                placeholder="Minimum 6 znaków"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#15803d] hover:bg-[#166534] disabled:bg-gray-400 text-white font-medium py-4 rounded-2xl text-lg mt-4"
            >
              {loading ? 'Tworzymy konto...' : 'Załóż konto i dokończ zamówienie'}
            </button>

            {message && (
              <p className="text-sm text-center text-[#15803d]">{message}</p>
            )}

            {/* Fix for the reported issue: email confirmation */}
            <div className="mt-4 text-[10px] text-[#6b7280] border border-[#e8dcc8] rounded-2xl p-3 leading-snug">
              W dev: jeśli nie dostałeś maila z potwierdzeniem — w Supabase (Authentication → Providers → Email) wyłącz "Confirm email". 
              Po rejestracji powinieneś być zalogowany od razu i wybór zapisze się automatycznie.
            </div>
          </form>

          <div className="text-center text-sm text-[#6b7280] mt-6">
            Masz już konto?{' '}
            <Link href="/logowanie" className="text-[#15803d] font-medium hover:underline">
              Zaloguj się
            </Link>
          </div>
        </div>

        <p className="text-xs text-center text-[#6b7280] mt-6">
          Kontynuując, akceptujesz regulamin i politykę prywatności Smakowało.
        </p>
      </div>
    </div>
  );
}
