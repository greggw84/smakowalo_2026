'use client';

import { useState } from 'react';
import Link from 'next/link';
import { dietaryOptions, allAllergens, sampleRecipes } from '@/lib/data/recipes';
import { DietaryPreference, Allergen, Recipe } from '@/lib/types';
import { AlertTriangle, Plus, Minus, Check } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Kreator() {
  // === PLAN ===
  const [peopleCount, setPeopleCount] = useState<2 | 4 | 6>(2);
  const [mealsPerWeek, setMealsPerWeek] = useState<3 | 4 | 5>(3);

  const totalPortions = peopleCount * mealsPerWeek;

  // === PREFERENCJE I ALERGIE (zaznaczane w kreatorze) ===
  const [selectedPreferences, setSelectedPreferences] = useState<DietaryPreference[]>(['none']);
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>([]);

  const toggleAllergen = (allergen: Allergen) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const togglePreference = (pref: DietaryPreference) => {
    if (pref === 'none') {
      setSelectedPreferences(['none']);
    } else {
      setSelectedPreferences(prev => {
        const withoutNone = prev.filter(p => p !== 'none');
        if (withoutNone.includes(pref)) {
          const filtered = withoutNone.filter(p => p !== pref);
          return filtered.length === 0 ? ['none'] : filtered;
        } else {
          return [...withoutNone, pref];
        }
      });
    }
  };

  // === WYBÓR DAŃ (core kreatora) ===
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);

  const addDish = (id: string) => {
    if (selectedRecipeIds.length >= mealsPerWeek) return;
    if (!selectedRecipeIds.includes(id)) {
      setSelectedRecipeIds([...selectedRecipeIds, id]);
    }
  };

  const removeDish = (id: string) => {
    setSelectedRecipeIds(selectedRecipeIds.filter(rid => rid !== id));
  };

  const isSelected = (id: string) => selectedRecipeIds.includes(id);
  const remaining = mealsPerWeek - selectedRecipeIds.length;

  // Filtrowanie przepisów na podstawie preferencji użytkownika
  const filteredRecipes = sampleRecipes.filter(recipe => {
    if (selectedPreferences.includes('none')) return true;
    return selectedPreferences.some(pref => recipe.dietaryTags.includes(pref));
  });

  // Sprawdza czy danie zawiera alergen użytkownika (personalizowane ostrzeżenie)
  const dishHasUserAllergen = (recipe: Recipe): boolean => {
    return recipe.allergens.some(a => selectedAllergens.includes(a));
  };

  // Wybrane dania z pełnymi danymi
  const selectedDishes: Recipe[] = sampleRecipes.filter(r => selectedRecipeIds.includes(r.id));

  // Czy są jakieś ostrzeżenia w aktualnym wyborze?
  const hasAnyAllergenWarning = selectedDishes.some(dish => dishHasUserAllergen(dish));

  // Przejście dalej — zapisujemy wybór i idziemy do podsumowania
  const handleContinue = () => {
    if (selectedRecipeIds.length < mealsPerWeek) {
      alert(`Musisz wybrać jeszcze ${remaining} dań.`);
      return;
    }

    // Zapisujemy wszystko do localStorage (na razie do podglądu)
    const selection = {
      peopleCount,
      mealsPerWeek,
      selectedPreferences,
      selectedAllergens,
      selectedRecipeIds,
      timestamp: Date.now()
    };
    localStorage.setItem('smakowalo_current_selection', JSON.stringify(selection));

    // Przechodzimy do podsumowania
    window.location.href = '/podsumowanie';
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo width={100} height={26} /></Link>
          <div className="text-sm text-[#6b7280] font-medium">Kreator • Krok 2 z 4</div>
          <Link href="/menu" className="text-sm text-[#15803d] hover:underline">Zobacz pełne menu</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-[#14532d]">Wybierz dania na ten tydzień</h1>
          <p className="text-[#4b5563] mt-2 text-lg">
            Zaznacz swoje preferencje i alergie — menu dostosuje się automatycznie, a my będziemy Cię ostrzegać.
          </p>
        </div>

        {/* === 1. PLAN + PREFERENCJE + ALERGIE === */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Plan */}
          <div className="bg-white rounded-3xl p-6 border border-[#e8dcc8]">
            <div className="font-semibold text-[#14532d] mb-3">Twój plan</div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-[#6b7280] mb-1">Dla ilu osób?</div>
                <div className="flex gap-2">
                  {[2,4,6].map(n => (
                    <button key={n} onClick={() => setPeopleCount(n as any)}
                      className={`flex-1 py-2 rounded-2xl border text-sm font-medium ${peopleCount === n ? 'bg-[#15803d] text-white border-[#15803d]' : 'border-[#e8dcc8]'}`}>
                      {n} osoby
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-[#6b7280] mb-1">Ile dań w tygodniu?</div>
                <div className="flex gap-2">
                  {[3,4,5].map(n => (
                    <button key={n} onClick={() => setMealsPerWeek(n as any)}
                      className={`flex-1 py-2 rounded-2xl border text-sm font-medium ${mealsPerWeek === n ? 'bg-[#15803d] text-white border-[#15803d]' : 'border-[#e8dcc8]'}`}>
                      {n} dań
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2 text-sm text-[#15803d] font-medium">
                Razem: <span className="font-semibold">{totalPortions} porcji</span> tygodniowo
              </div>
              <div className="text-[11px] text-[#6b7280] pt-1">Subskrybuj i oszczędzaj ~15 zł co tydzień + gratis dostawa (po zalogowaniu).</div>
            </div>
          </div>

          {/* Preferencje */}
          <div className="bg-white rounded-3xl p-6 border border-[#e8dcc8]">
            <div className="font-semibold text-[#14532d] mb-3">Preferencje dietetyczne</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {dietaryOptions.map(opt => (
                <button key={opt.value} onClick={() => togglePreference(opt.value)}
                  className={`p-3 rounded-2xl border text-left transition ${selectedPreferences.includes(opt.value) ? 'border-[#15803d] bg-[#f1e9df] text-[#14532d]' : 'border-[#e8dcc8]'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alergie — bardzo ważne */}
          <div className="bg-white rounded-3xl p-6 border border-[#e8dcc8]">
            <div className="font-semibold text-[#14532d] mb-1">Alergie / nietolerancje</div>
            <p className="text-xs text-[#6b7280] mb-3">Zaznacz — będziemy Cię ostrzegać przy niebezpiecznych daniach.</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {allAllergens.map(item => (
                <button key={item.value} onClick={() => toggleAllergen(item.value)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition ${selectedAllergens.includes(item.value) ? 'border-red-500 bg-red-50 text-red-700' : 'border-[#e8dcc8]'}`}>
                  {item.label}
                </button>
              ))}
            </div>
            {selectedAllergens.length > 0 && (
              <div className="mt-3 text-xs text-red-600 font-medium">
                Twoje alergeny: {selectedAllergens.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* === GŁÓWNY KREATOR === */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Lista dań */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <span className="font-semibold text-[#14532d]">Dostępne dania</span>
                <span className="text-[#6b7280] ml-2">({filteredRecipes.length})</span>
              </div>
              <div className="text-sm text-[#15803d] font-medium">
                Musisz wybrać jeszcze <span className="font-semibold">{remaining}</span> dań
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredRecipes.map(recipe => {
                const hasWarning = dishHasUserAllergen(recipe);
                const selected = isSelected(recipe.id);

                return (
                  <div key={recipe.id} 
                       className={`bg-white rounded-3xl border overflow-hidden flex flex-col transition ${selected ? 'border-[#15803d] ring-1 ring-[#15803d]' : 'border-[#e8dcc8]'} ${hasWarning ? 'border-red-300' : ''}`}>
                    
                    {/* Photo - the missing piece in the creator */}
                    {recipe.imageUrl && (
                      <div className="relative h-40 bg-[#f1e9df]">
                        <img 
                          src={recipe.imageUrl} 
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                          {recipe.nutrition.kcal} kcal
                        </div>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg leading-tight text-[#14532d] mb-1.5">{recipe.title}</h3>
                        <p className="text-sm text-[#4b5563] line-clamp-2 mb-3">{recipe.description}</p>

                        <div className="flex gap-2 flex-wrap mb-3">
                          {recipe.dietaryTags.map(t => (
                            <span key={t} className="text-[10px] px-2 py-0.5 bg-white border border-[#e8dcc8] rounded-full">{t}</span>
                          ))}
                        </div>

                        {/* Personalizowane ostrzeżenie */}
                        {hasWarning && (
                          <div className="flex items-start gap-2 text-xs bg-red-50 text-red-700 p-3 rounded-2xl mb-3 border border-red-200">
                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>
                              <strong>Uwaga:</strong> To danie zawiera Twój alergen: {recipe.allergens.filter(a => selectedAllergens.includes(a)).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => selected ? removeDish(recipe.id) : addDish(recipe.id)}
                        disabled={!selected && remaining <= 0}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium transition ${selected 
                          ? 'bg-[#14532d] text-white hover:bg-black' 
                          : 'bg-[#15803d] text-white hover:bg-[#166534] disabled:bg-gray-300'}`}
                      >
                        {selected ? <><Minus className="w-4 h-4" /> Usuń z boxa</> : <><Plus className="w-4 h-4" /> Dodaj do boxa</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky podsumowanie boxa */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#e8dcc8] p-6 sticky top-20">
              <div className="font-semibold text-[#14532d] mb-4 flex items-center justify-between">
                <span>Twój box na ten tydzień</span>
                <span className="text-sm font-normal text-[#6b7280]">{selectedRecipeIds.length} / {mealsPerWeek} dań</span>
              </div>

              {selectedDishes.length === 0 ? (
                <div className="text-[#6b7280] text-sm py-6 text-center border border-dashed border-[#e8dcc8] rounded-2xl">
                  Wybierz pierwsze danie po lewej stronie
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {selectedDishes.map(dish => {
                    const warning = dishHasUserAllergen(dish);
                    return (
                      <div key={dish.id} className={`flex justify-between items-start p-3 rounded-2xl border ${warning ? 'border-red-300 bg-red-50' : 'border-[#e8dcc8]'}`}>
                        <div>
                          <div className="font-medium text-sm">{dish.title}</div>
                          {warning && (
                            <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-3 h-3" /> Zawiera Twój alergen!
                            </div>
                          )}
                        </div>
                        <button onClick={() => removeDish(dish.id)} className="text-red-500 hover:text-red-700">
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {hasAnyAllergenWarning && selectedDishes.length > 0 && (
                <div className="bg-red-100 text-red-700 text-xs p-3 rounded-2xl mb-4">
                  Masz w boxie danie/dania zawierające Twoje alergeny. Upewnij się, że chcesz je zostawić.
                </div>
              )}

              <button 
                onClick={handleContinue}
                disabled={selectedRecipeIds.length < mealsPerWeek}
                className="w-full bg-[#15803d] hover:bg-[#166534] disabled:bg-gray-300 text-white font-medium py-4 rounded-2xl text-lg transition"
              >
                {remaining > 0 
                  ? `Wybierz jeszcze ${remaining} dań, żeby kontynuować` 
                  : 'Przejdź do finalizacji zamówienia →'}
              </button>

              <p className="text-[11px] text-center text-[#6b7280] mt-3">
                Po kliknięciu poprosimy Cię o zalogowanie lub założenie konta (dane się zapiszą).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
