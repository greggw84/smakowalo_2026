'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { sampleRecipes } from '@/lib/data/recipes';
import Logo from '@/components/Logo';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SavedSelection {
  peopleCount: 2 | 4 | 6;
  mealsPerWeek: 3 | 4 | 5;
  selectedPreferences: string[];
  selectedAllergens: string[];
  selectedRecipeIds: string[];
}

export default function Platnosc() {
  const [selection, setSelection] = useState<SavedSelection | null>(null);
  const [dishes, setDishes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      // Try localStorage first (pending order from podsumowanie)
      let hasLocal = false;
      const saved = localStorage.getItem('smakowalo_current_selection');
      if (saved) {
        hasLocal = true;
        const parsed = JSON.parse(saved) as SavedSelection;
        setSelection(parsed);
        const found = sampleRecipes.filter(r => parsed.selectedRecipeIds.includes(r.id));
        setDishes(found);
      }

      // Always get the current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // Robust recovery from DB when there is no localStorage data.
      // This fixes the "Brak aktywnego zamówienia do opłacenia." error when:
      // - User just came back from login/register (auth pages clear localStorage)
      // - Direct navigation or refresh
      // - localStorage was cleared in podsumowanie after auto-save
      if (!hasLocal && currentUser) {
        try {
          const { data: latestRows, error: fetchErr } = await supabase
            .from('user_selections')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (fetchErr) {
            console.error('platnosc: error fetching latest selection', fetchErr);
          }

          if (latestRows && latestRows.length > 0) {
            const latest = latestRows[0];
            const parsed: SavedSelection = {
              peopleCount: latest.people_count as 2 | 4 | 6,
              mealsPerWeek: latest.meals_per_week as 3 | 4 | 5,
              selectedPreferences: latest.dietary_preferences || [],
              selectedAllergens: latest.allergens || [],
              selectedRecipeIds: latest.selected_recipe_ids || [],
            };
            setSelection(parsed);
            const found = sampleRecipes.filter(r => parsed.selectedRecipeIds.includes(r.id));
            setDishes(found);
          }
        } catch (e) {
          console.error('platnosc: failed to recover from DB', e);
        }
      }

      setLoading(false);
    };

    load();
  }, [supabase]);

  const getFirstBoxPrice = (people: number) => {
    if (people === 2) return 119;
    if (people === 4) return 229;
    return 319;
  };

  const boxPrice = selection ? getFirstBoxPrice(selection.peopleCount) : 0;
  const delivery = 19;
  const total = boxPrice + delivery;

  const handlePay = async () => {
    // In real life: create Stripe Checkout session here using your price IDs.
    // For now: fake successful payment, mark as confirmed if we have data, clean up.

    if (selection && user) {
      try {
        // Best effort: insert a confirmed order row (or we could update latest)
        await supabase.from('user_selections').insert({
          user_id: user.id,
          people_count: selection.peopleCount,
          meals_per_week: selection.mealsPerWeek,
          dietary_preferences: selection.selectedPreferences,
          allergens: selection.selectedAllergens,
          selected_recipe_ids: selection.selectedRecipeIds,
          week_label: `Tydzień ${new Date().toISOString().slice(0, 10)}`,
          status: 'confirmed',
        });
      } catch (e) {
        console.error('Could not mark order confirmed', e);
      }
    }

    localStorage.removeItem('smakowalo_current_selection');
    setPaid(true);

    // After short delay, go to panel (user sees their orders there)
    setTimeout(() => {
      window.location.href = '/panel';
    }, 1600);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <p>Ładowanie płatności...</p>
      </div>
    );
  }

  if (!selection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] p-6">
        <div className="bg-white rounded-3xl border border-[#e8dcc8] p-8 max-w-md text-center">
          <h2 className="text-2xl font-semibold text-[#14532d] mb-2">Brak aktywnego zamówienia do opłacenia.</h2>
          <p className="text-[#4b5563] mb-6">
            Mogło się to zdarzyć jeśli odświeżyłeś stronę, wszedłeś bezpośrednio na ten adres, 
            lub sesja wymaga odświeżenia.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/wybierz-menu" className="block w-full py-3 bg-[#15803d] text-white rounded-2xl font-medium">
              Wróć do kreatora i wybierz menu
            </Link>

            <Link href="/panel" className="block w-full py-3 border border-[#15803d] text-[#15803d] rounded-2xl font-medium">
              Idź do panelu (moje zamówienia)
            </Link>

            <button
              onClick={async () => {
                // Force recovery from the latest DB record for this user
                const { data: { user: u } } = await supabase.auth.getUser();
                if (!u) {
                  alert('Musisz być zalogowany, żeby pobrać zamówienia.');
                  return;
                }
                const { data: latestRows } = await supabase
                  .from('user_selections')
                  .select('*')
                  .eq('user_id', u.id)
                  .order('created_at', { ascending: false })
                  .limit(1);

                if (latestRows && latestRows.length > 0) {
                  const latest = latestRows[0];
                  const parsed: SavedSelection = {
                    peopleCount: latest.people_count as 2 | 4 | 6,
                    mealsPerWeek: latest.meals_per_week as 3 | 4 | 5,
                    selectedPreferences: latest.dietary_preferences || [],
                    selectedAllergens: latest.allergens || [],
                    selectedRecipeIds: latest.selected_recipe_ids || [],
                  };
                  setSelection(parsed);
                  const found = sampleRecipes.filter(r => parsed.selectedRecipeIds.includes(r.id));
                  setDishes(found);
                } else {
                  alert('Nie znaleziono żadnych zapisanych zamówień na Twoim koncie.');
                }
              }}
              className="block w-full py-3 border border-[#e8dcc8] rounded-2xl text-sm"
            >
              Spróbuj załadować ostatnie zamówienie z konta
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 text-center max-w-md border border-[#e8dcc8]">
          <CheckCircle className="w-16 h-16 text-[#15803d] mx-auto mb-4" />
          <h1 className="text-3xl font-semibold text-[#14532d]">Dziękujemy!</h1>
          <p className="mt-2 text-[#4b5563]">Płatność przyjęta. Twoje zamówienie jest potwierdzone.</p>
          <p className="text-sm text-[#6b7280] mt-4">Za chwilę przeniesiemy Cię do panelu, gdzie możesz zarządzać subskrypcją.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo width={100} height={26} /></Link>
          <div className="text-sm text-[#6b7280]">Płatność • Krok 4 z 4</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-semibold tracking-tight text-[#14532d] mb-2">Podsumowanie i płatność</h1>
        <p className="text-[#4b5563] mb-8">Sprawdź zamówienie przed płatnością.</p>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Order details */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-[#e8dcc8] p-7">
            <div className="mb-5">
              <div className="text-sm text-[#6b7280]">Twój plan</div>
              <div className="text-2xl font-semibold text-[#14532d]">
                {selection.peopleCount} osoby • {selection.mealsPerWeek} dań
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium mb-2 text-[#374151]">Wybrane dania</div>
              <div className="space-y-2">
                {dishes.length === 0 ? (
                  <p className="text-[#6b7280] text-sm">Dania zostaną dobrane według Twojego profilu (lub wybierzesz w następnym kroku).</p>
                ) : (
                  dishes.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm border-b pb-2 last:border-none">
                      <span>{d.title}</span>
                      <span className="text-[#6b7280]">{d.nutrition.kcal} kcal</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-xs text-[#6b7280]">
              Preferencje: {selection.selectedPreferences.join(', ') || 'bez ograniczeń'}<br />
              Alergeny: {selection.selectedAllergens.length ? selection.selectedAllergens.join(', ') : 'brak'}
            </div>
          </div>

          {/* Payment box */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-[#e8dcc8] p-7 sticky top-6">
              <div className="text-sm text-[#6b7280] mb-1">Pierwszy box (promocja)</div>
              <div className="flex justify-between text-xl mb-1">
                <span>Box</span>
                <span className="font-semibold">{boxPrice} zł</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span>Dostawa (Poznań + 30 km)</span>
                <span>{delivery} zł</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-2xl font-semibold">
                <span>Razem</span>
                <span className="text-[#15803d]">{total} zł</span>
              </div>

              <button
                onClick={handlePay}
                className="mt-6 w-full bg-[#15803d] hover:bg-[#166534] text-white font-medium py-4 rounded-2xl text-lg flex items-center justify-center gap-2"
              >
                Zapłać teraz przez Stripe <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-[10px] text-center text-[#6b7280] mt-3">
                Bezpieczna płatność. Subskrypcję możesz wstrzymać lub zmienić w panelu w dowolnym momencie.
              </p>

              <div className="mt-5 text-xs text-[#6b7280]">
                Masz pytania? <Link href="/kontakt" className="underline">Skontaktuj się z nami</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/podsumowanie" className="text-sm text-[#6b7280] hover:text-[#15803d] underline">← Wróć do podsumowania</Link>
        </div>
      </div>
    </div>
  );
}
