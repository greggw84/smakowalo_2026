'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { sampleRecipes } from '@/lib/data/recipes';
import { Recipe, DietaryPreference, Allergen } from '@/lib/types';
import { AlertTriangle, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';
import { saveUserSelection } from '@/app/actions/save-selection';

interface SavedSelection {
  peopleCount: 2 | 4 | 6;
  mealsPerWeek: 3 | 4 | 5;
  selectedPreferences: DietaryPreference[];
  selectedAllergens: Allergen[];
  selectedRecipeIds: string[];
  timestamp: number;
}

export default function Podsumowanie() {
  const [selection, setSelection] = useState<SavedSelection | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const saved = localStorage.getItem('smakowalo_current_selection');
      if (saved) {
        const parsed: SavedSelection = JSON.parse(saved);
        setSelection(parsed);

        const dishes = sampleRecipes.filter(r => parsed.selectedRecipeIds.includes(r.id));
        setSelectedDishes(dishes);
      }

      // Check if already logged in (so we can skip the auth wall and go to payment)
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // If logged in and we have a pending selection in localStorage, auto-save it now
      if (user && saved) {
        try {
          const parsed = JSON.parse(saved);
          await saveUserSelection({
            peopleCount: parsed.peopleCount,
            mealsPerWeek: parsed.mealsPerWeek,
            dietaryPreferences: parsed.selectedPreferences,
            allergens: parsed.selectedAllergens,
            selectedRecipeIds: parsed.selectedRecipeIds,
          });
          localStorage.removeItem('smakowalo_current_selection');
        } catch (e) {
          console.error('Auto-save after login in podsumowanie failed', e);
        }
      }

      // If we are logged in but have no selection in state (e.g. just returned from login page which cleared localStorage),
      // recover the latest saved order from the database so we can show price and allow proceeding to payment.
      if (user && !saved && !selection) {
        try {
          const { data: latestRows } = await supabase
            .from('user_selections')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (latestRows && latestRows.length > 0) {
            const latest = latestRows[0];
            const recovered: SavedSelection = {
              peopleCount: latest.people_count as 2 | 4 | 6,
              mealsPerWeek: latest.meals_per_week as 3 | 4 | 5,
              selectedPreferences: latest.dietary_preferences || [],
              selectedAllergens: latest.allergens || [],
              selectedRecipeIds: latest.selected_recipe_ids || [],
              timestamp: Date.now(),
            };
            setSelection(recovered);

            const recoveredDishes = sampleRecipes.filter(r => recovered.selectedRecipeIds.includes(r.id));
            setSelectedDishes(recoveredDishes);
          }
        } catch (e) {
          console.error('Failed to recover latest selection in podsumowanie', e);
        }
      }
    };

    load();
  }, [supabase]);

  if (!selection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <div className="text-center">
          <p className="text-[#6b7280] mb-4">Nie znaleziono aktywnego wyboru.</p>
          <Link href="/wybierz-menu" className="text-[#15803d] underline">
            Wróć do kreatora
          </Link>
        </div>
      </div>
    );
  }

  const totalPortions = selection.peopleCount * selection.mealsPerWeek;

  // Sprawdza czy danie ma alergen użytkownika (personalizowane)
  const dishHasUserAllergen = (recipe: Recipe) => {
    return recipe.allergens.some(a => selection.selectedAllergens.includes(a));
  };

  const dishesWithWarnings = selectedDishes.filter(dishHasUserAllergen);

  // Simple first-box pricing (matches the researched prices on the landing)
  const getFirstBoxPrice = (people: number) => {
    if (people === 2) return 119;
    if (people === 4) return 229;
    return 319;
  };
  const boxPrice = selection ? getFirstBoxPrice(selection.peopleCount) : 0;
  const delivery = 19;
  const total = boxPrice + delivery;

  // Defensive: if we have a logged-in user but still no selection object in state (race), hide price block or show loading state.
  const showPriceAndCta = !!user || !!selection;

  const handleProceedToPayment = () => {
    // Selection should already be saved if we were logged in.
    // Just clear any remaining localStorage and go to checkout.
    localStorage.removeItem('smakowalo_current_selection');
    window.location.href = '/platnosc';
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo width={100} height={26} /></Link>
          <div className="text-sm text-[#6b7280]">Podsumowanie zamówienia • Krok 3 z 4</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-semibold tracking-tight text-[#14532d] mb-2">
          Twoje zamówienie na ten tydzień
        </h1>
        <p className="text-[#4b5563] text-lg mb-8">
          Sprawdź wszystko przed finalizacją.
        </p>

        {/* Plan + Preferencje */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-[#e8dcc8]">
            <div className="text-sm text-[#6b7280]">Twój plan</div>
            <div className="text-2xl font-semibold text-[#14532d] mt-1">
              {selection.peopleCount} osoby • {selection.mealsPerWeek} dań
            </div>
            <div className="text-[#15803d] font-medium mt-1">
              Razem {totalPortions} porcji tygodniowo
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#e8dcc8]">
            <div className="text-sm text-[#6b7280] mb-2">Twoje preferencje i alergie</div>
            <div className="flex flex-wrap gap-2">
              {selection.selectedPreferences.map(p => (
                <span key={p} className="bg-[#f1e9df] text-[#14532d] px-3 py-1 rounded-full text-sm">
                  {p === 'none' ? 'Bez ograniczeń' : p}
                </span>
              ))}
              {selection.selectedAllergens.length > 0 && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {selection.selectedAllergens.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Wybrane dania + personalizowane ostrzeżenia */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-semibold text-xl text-[#14532d]">Wybrane dania ({selectedDishes.length})</h2>
            {dishesWithWarnings.length > 0 && (
              <div className="text-sm text-red-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {dishesWithWarnings.length} dań z Twoimi alergenami
              </div>
            )}
          </div>

          <div className="space-y-3">
            {selectedDishes.map(dish => {
              const hasWarning = dishHasUserAllergen(dish);
              return (
                <div key={dish.id} className={`bg-white rounded-3xl p-5 border flex justify-between items-center ${hasWarning ? 'border-red-300 bg-red-50/40' : 'border-[#e8dcc8]'}`}>
                  <div>
                    <div className="font-medium text-lg">{dish.title}</div>
                    <div className="text-sm text-[#6b7280]">{dish.nutrition.kcal} kcal • {dish.prepTime + dish.cookTime} min</div>
                  </div>

                  {hasWarning && (
                    <div className="text-xs px-4 py-2 bg-red-600 text-white rounded-2xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Zawiera Twój alergen!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Price summary + final CTA (conditional on auth) */}
        <div className="mt-10">
          {/* Price breakdown - only show when we have a selection (plan size) */}
          {selection && (
            <div className="bg-white border border-[#e8dcc8] rounded-3xl p-6 mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <div className="text-[#6b7280]">Box na {selection.peopleCount} osoby (pierwszy tydzień)</div>
                <div className="font-semibold text-xl">{boxPrice} zł</div>
              </div>
              <div className="flex justify-between items-baseline text-sm">
                <div className="text-[#6b7280]">Dostawa (Poznań + 30 km)</div>
                <div>{delivery} zł</div>
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-lg">
                <div>Razem do zapłaty</div>
                <div className="text-[#15803d]">{total} zł</div>
              </div>
              <p className="text-[10px] text-[#6b7280] mt-1">Od drugiego tygodnia cena regularna (bez pierwszego-box promo). Subskrypcja tańsza.</p>
            </div>
          )}

          {!user ? (
            /* Auth wall only if not logged in */
            <div className="bg-white border-2 border-[#15803d] rounded-3xl p-8 md:p-10">
              <div className="max-w-md mx-auto text-center">
                <div className="mx-auto w-14 h-14 bg-[#15803d] rounded-2xl flex items-center justify-center mb-5">
                  <UserPlus className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-semibold text-[#14532d] mb-3">
                  Prawie gotowe!
                </h3>
                <p className="text-[#4b5563] mb-6">
                  Aby dokończyć zamówienie, zapisać swoje preferencje i alergie na przyszłość oraz otrzymać potwierdzenie, 
                  załóż konto lub zaloguj się.
                </p>

                <div className="space-y-3">
                  <Link href="/logowanie?returnTo=/podsumowanie">
                    <button className="w-full flex items-center justify-center gap-3 bg-[#15803d] hover:bg-[#166534] text-white font-medium py-4 rounded-2xl text-lg">
                      <LogIn className="w-5 h-5" />
                      Zaloguj się
                    </button>
                  </Link>

                  <Link href="/rejestracja?returnTo=/podsumowanie">
                    <button className="w-full flex items-center justify-center gap-3 border-2 border-[#15803d] text-[#15803d] hover:bg-[#f1e9df] font-medium py-4 rounded-2xl text-lg">
                      Załóż konto (to zajmie 30 sekund)
                    </button>
                  </Link>
                </div>

                <p className="text-xs text-[#6b7280] mt-5">
                  Twoje wybory zostaną zapisane na koncie. Możesz je później zmieniać w panelu.
                </p>
              </div>
            </div>
          ) : (
            /* Logged in → direct path to payment */
            <div className="bg-white border-2 border-[#15803d] rounded-3xl p-8 md:p-10 text-center">
              <div className="max-w-md mx-auto">
                <div className="mx-auto w-14 h-14 bg-[#15803d] rounded-2xl flex items-center justify-center mb-5">
                  <ArrowRight className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-semibold text-[#14532d] mb-2">
                  Wszystko gotowe!
                </h3>
                <p className="text-[#4b5563] mb-6">
                  Jesteś zalogowany. Twoje preferencje i wybór dań zostały zapisane.
                  Możesz teraz przejść do płatności.
                </p>

                <button 
                  onClick={handleProceedToPayment}
                  disabled={isSaving}
                  className="w-full bg-[#15803d] hover:bg-[#166534] disabled:bg-gray-300 text-white font-medium py-4 rounded-2xl text-lg flex items-center justify-center gap-2"
                >
                  Przejdź do płatności • {total} zł <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-[#6b7280] mt-4">
                  Po płatności wrócisz do panelu, gdzie będziesz mógł zarządzać subskrypcją, pauzować tygodnie i zmieniać preferencje.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upsell / Dodatki — direct +15-20% AOV (self-reflect monetization) */}
        <div className="mt-8 bg-white border border-[#e8dcc8] rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-[#14532d]">Chcesz coś ekstra do tego boxa?</div>
              <div className="text-sm text-[#4b5563]">Dodaj przy tym zamówieniu (później w kreatorze + podsumowaniu).</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {[
              { name: "Deser tygodnia", price: "+29 zł", note: "Ciasto lub mus czekoladowy" },
              { name: "Śniadaniowy box", price: "+39 zł", note: "2-3 porcje na poniedziałek" },
              { name: "Butelka wina / cydr", price: "+49 zł", note: "Lokalny dobór do menu" },
            ].map((a, i) => (
              <div key={i} className="border border-[#e8dcc8] rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-[#6b7280]">{a.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#15803d] font-semibold">{a.price}</div>
                  <div className="text-[10px] text-[#6b7280]">+ do zamówienia</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#6b7280] mt-3">Dodatki dodasz po zalogowaniu lub w pełnym flow. Średnio +18% wartości zamówienia.</p>
        </div>

        <div className="text-center mt-8">
          <Link href="/wybierz-menu" className="text-sm text-[#6b7280] hover:text-[#15803d] underline">
            ← Wróć i zmień wybór
          </Link>
        </div>
      </div>
    </div>
  );
}
