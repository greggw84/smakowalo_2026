'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';

export default function Logowanie() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // Po zalogowaniu sprawdzamy czy jest niezapisany wybór z kreatora
    const savedSelection = localStorage.getItem('smakowalo_current_selection');

    if (savedSelection) {
      try {
        const selection = JSON.parse(savedSelection);

        const { saveUserSelection } = await import('@/app/actions/save-selection');
        const result = await saveUserSelection({
          peopleCount: selection.peopleCount,
          mealsPerWeek: selection.mealsPerWeek,
          dietaryPreferences: selection.selectedPreferences,
          allergens: selection.selectedAllergens,
          selectedRecipeIds: selection.selectedRecipeIds,
        });

        if (result.success) {
          localStorage.removeItem('smakowalo_current_selection');
        }
      } catch (err) {
        console.error('Failed to save pending selection after login', err);
      }
    }

    // Respect returnTo (e.g. back to podsumowanie so user can continue to payment)
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get('returnTo') || '/panel';
    window.location.href = returnTo;
  };

  const handleMagicLink = async () => {
    if (!email) {
      setMessage('Podaj email');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Sprawdź swoją skrzynkę — wysłaliśmy magic link.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/"><Logo width={120} height={30} /></Link>
          <h1 className="text-3xl font-semibold tracking-tight text-[#14532d] mt-6">Witaj ponownie</h1>
          <p className="text-[#4b5563] mt-2">Zaloguj się, żeby dokończyć zamówienie.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#e8dcc8]">
          <form onSubmit={handleLogin} className="space-y-5">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-[#e8dcc8] rounded-2xl px-4 py-3 focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#15803d] hover:bg-[#166534] disabled:bg-gray-400 text-white font-medium py-4 rounded-2xl text-lg"
            >
              {loading ? 'Logowanie...' : 'Zaloguj się hasłem'}
            </button>
          </form>

          <div className="my-4 flex items-center">
            <div className="flex-1 border-t border-[#e8dcc8]"></div>
            <span className="px-3 text-xs text-[#6b7280]">lub</span>
            <div className="flex-1 border-t border-[#e8dcc8]"></div>
          </div>

          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full border border-[#15803d] text-[#15803d] hover:bg-[#f1e9df] font-medium py-3.5 rounded-2xl text-sm"
          >
            Wyślij magic link na email
          </button>

          {message && (
            <p className="text-sm text-center text-[#15803d] mt-4">{message}</p>
          )}

          <div className="text-center text-sm text-[#6b7280] mt-6">
            Nie masz konta?{' '}
            <Link href="/rejestracja" className="text-[#15803d] font-medium hover:underline">
              Załóż konto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
