'use client';

import Link from 'next/link';
import { useState } from 'react';
import { sampleRecipes, allAllergens, dietaryOptions } from '@/lib/data/recipes';
import { Recipe } from '@/lib/types';
import { Clock, Users, AlertTriangle, Search, X } from 'lucide-react';
import Logo from '@/components/Logo';

export default function MenuTygodnia() {
  const [search, setSearch] = useState('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState(60);
  const [maxKcal, setMaxKcal] = useState(700);
  const [excludeAllergens, setExcludeAllergens] = useState<string[]>([]);
  const [sort, setSort] = useState<'time' | 'kcal' | 'name'>('time');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  let filteredRecipes = sampleRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) || 
                          recipe.description.toLowerCase().includes(search.toLowerCase());
    const matchesDiet = selectedDiets.length === 0 || selectedDiets.some(diet => recipe.dietaryTags.includes(diet as any));
    const totalTime = recipe.prepTime + recipe.cookTime;
    const matchesTime = totalTime <= maxTime;
    const matchesKcal = recipe.nutrition.kcal <= maxKcal;
    const matchesAllergens = excludeAllergens.length === 0 || !excludeAllergens.some(all => recipe.allergens.includes(all as any));
    return matchesSearch && matchesDiet && matchesTime && matchesKcal && matchesAllergens;
  });

  if (sort === 'time') {
    filteredRecipes.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
  } else if (sort === 'kcal') {
    filteredRecipes.sort((a, b) => a.nutrition.kcal - b.nutrition.kcal);
  } else {
    filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
  }

  const toggleDiet = (diet: string) => {
    setSelectedDiets(prev => prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]);
  };

  const toggleAllergen = (allergen: string) => {
    setExcludeAllergens(prev => prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo width={105} height={26} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/start">
              <button className="bg-[#15803d] hover:bg-[#166534] text-white px-6 py-2 rounded-2xl text-sm font-medium">
                Zacznij swój box
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <div className="text-[#15803d] text-sm font-semibold tracking-[2px] mb-2">TYDZIEŃ 23 • 2–8 CZERWCA 2025</div>
            <h1 className="text-5xl font-semibold tracking-tighter text-[#14532d]">Menu tego tygodnia</h1>
            <p className="text-[#4b5563] mt-2">12 dań • pełne informacje • kliknij po szczegóły</p>
          </div>
          <p className="text-[#4b5563] max-w-md mt-4 md:mt-0 text-sm">
            Pełne menu z przepisami krok po kroku, wartościami odżywczymi, witaminami i wskazówkami. Wybierz, co Ci smakuje.
          </p>
        </div>

        {/* Filters - low key, functional */}
        <div className="bg-white rounded-3xl p-6 border border-[#e8dcc8] mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-[#6b7280] block mb-1">Szukaj</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="np. łosoś, curry, bigos..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border border-[#e8dcc8] rounded-2xl pl-10 py-2 text-sm focus:outline-none focus:border-[#15803d]"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#6b7280]" />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#6b7280] block mb-1">Dieta</label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.slice(1).map(opt => (
                  <button 
                    key={opt.value} 
                    onClick={() => toggleDiet(opt.value)}
                    className={`px-3 py-1 text-xs rounded-full border ${selectedDiets.includes(opt.value) ? 'bg-[#15803d] text-white border-[#15803d]' : 'border-[#e8dcc8] hover:border-[#15803d]'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-40">
              <label className="text-xs text-[#6b7280] block mb-1">Max czas (min)</label>
              <input type="range" min="15" max="90" step="5" value={maxTime} onChange={e => setMaxTime(parseInt(e.target.value))} className="w-full" />
              <div className="text-xs text-[#6b7280] text-right">{maxTime} min</div>
            </div>

            <div className="w-40">
              <label className="text-xs text-[#6b7280] block mb-1">Max kcal</label>
              <input type="range" min="400" max="800" step="20" value={maxKcal} onChange={e => setMaxKcal(parseInt(e.target.value))} className="w-full" />
              <div className="text-xs text-[#6b7280] text-right">{maxKcal} kcal</div>
            </div>

            <div>
              <label className="text-xs text-[#6b7280] block mb-1">Wyklucz alergeny</label>
              <div className="flex flex-wrap gap-1">
                {allAllergens.map(a => (
                  <button 
                    key={a.value} 
                    onClick={() => toggleAllergen(a.value)}
                    className={`px-2 py-0.5 text-xs rounded-full border ${excludeAllergens.includes(a.value) ? 'bg-red-100 border-red-300 text-red-700' : 'border-[#e8dcc8] hover:border-red-300'}`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 items-end">
              <select value={sort} onChange={e => setSort(e.target.value as any)} className="border border-[#e8dcc8] rounded-2xl px-3 py-2 text-sm">
                <option value="time">Najkrótszy czas</option>
                <option value="kcal">Najmniej kcal</option>
                <option value="name">A-Z</option>
              </select>
              <button onClick={() => { setSearch(''); setSelectedDiets([]); setMaxTime(60); setMaxKcal(700); setExcludeAllergens([]); setSort('time'); }} className="text-xs px-3 py-2 border border-[#e8dcc8] rounded-2xl hover:bg-[#f8f5f0]">Reset</button>
            </div>
          </div>
          <div className="text-xs text-[#6b7280] mt-3">Znaleziono {filteredRecipes.length} dań • Kliknij kartę, żeby zobaczyć pełny przepis krok po kroku, wartości odżywcze i wskazówki.</div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => {
            const totalTime = recipe.prepTime + recipe.cookTime;
            return (
              <div 
                key={recipe.id} 
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-3xl overflow-hidden border border-[#e8dcc8] flex flex-col group cursor-pointer hover:shadow-md transition"
              >
                <div className="relative h-52 bg-[#f1e9df] overflow-hidden">
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {totalTime} min
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/95 text-xs px-2 py-0.5 rounded">{recipe.nutrition.kcal} kcal / porcja</div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold tracking-tight text-[#14532d] leading-tight mb-1.5 group-hover:text-[#15803d]">{recipe.title}</h3>
                  <p className="text-[#4b5563] text-sm line-clamp-2 mb-3">{recipe.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {recipe.dietaryTags.slice(0,3).map(tag => (
                      <span key={tag} className="text-[10px] bg-[#f1e9df] text-[#14532d] px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>

                  {recipe.allergens.length > 0 && (
                    <div className="text-[10px] text-[#b45309] flex items-center gap-1 mb-3">
                      <AlertTriangle className="w-3 h-3" /> {recipe.allergens.join(', ')}
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-t flex items-center justify-between text-xs text-[#6b7280]">
                    <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {recipe.servings} porcje</div>
                    <div className="text-[#15803d] font-medium group-hover:underline">Zobacz przepis i kroki →</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRecipes.length === 0 && <p className="text-center text-[#6b7280] mt-8">Brak dań pasujących do filtrów. Zmień kryteria.</p>}

        {/* Modal z pełnym przepisem - informacyjny, klikalny, krok po kroku */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4" onClick={() => setSelectedRecipe(null)}>
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-semibold text-[#14532d]">{selectedRecipe.title}</h2>
                <button onClick={() => setSelectedRecipe(null)} className="text-[#6b7280] hover:text-black"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-6">
                <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} className="w-full h-64 object-cover rounded-2xl mb-6" />

                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <div className="bg-[#f8f5f0] px-4 py-2 rounded-2xl flex items-center gap-2"><Clock className="w-4 h-4" /> {selectedRecipe.prepTime + selectedRecipe.cookTime} min</div>
                  <div className="bg-[#f8f5f0] px-4 py-2 rounded-2xl">{selectedRecipe.difficulty}</div>
                  <div className="bg-[#f8f5f0] px-4 py-2 rounded-2xl">Dla {selectedRecipe.servings} osób</div>
                  <div className="bg-[#f8f5f0] px-4 py-2 rounded-2xl">{selectedRecipe.nutrition.kcal} kcal / porcja</div>
                </div>

                <p className="text-[#4b5563] mb-6">{selectedRecipe.description}</p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3 text-[#14532d]">Składniki (na 2 porcje)</h3>
                    <ul className="space-y-1.5 text-sm">
                      {selectedRecipe.ingredients.map((ing, i) => <li key={i} className="flex gap-2">• {ing}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-[#14532d]">Sposób przyrządzania krok po kroku</h3>
                    <ol className="space-y-3 text-sm list-decimal pl-5">
                      {selectedRecipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </div>
                </div>

                <div className="mt-8 bg-[#f8f5f0] rounded-2xl p-5">
                  <h3 className="font-semibold mb-3 text-[#14532d]">Wartości odżywcze (na porcję) + witaminy (przybliżone)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>Kalorie: <span className="font-semibold">{selectedRecipe.nutrition.kcal} kcal</span></div>
                    <div>Białko: <span className="font-semibold">{selectedRecipe.nutrition.protein} g</span></div>
                    <div>Tłuszcze: <span className="font-semibold">{selectedRecipe.nutrition.fat} g</span></div>
                    <div>Węglowodany: <span className="font-semibold">{selectedRecipe.nutrition.carbs} g</span></div>
                  </div>
                  <div className="text-xs text-[#6b7280]">
                    Witaminy i wartości (przybliżone na podstawie składników): 
                    {selectedRecipe.nutrition.fiber && ` Błonnik ${selectedRecipe.nutrition.fiber}g.`}
                    {' '}Wit. C: ok. 30-50% RWS (z warzyw). Żelazo: 15-25% RWS (z mięsa/grzybów). 
                    Pełne wartości zależą od dokładnych produktów – zawsze sprawdzaj etykiety.
                  </div>
                </div>

                {selectedRecipe.allergens.length > 0 && (
                  <div className="mt-4 p-4 bg-[#fef3c7] rounded-2xl text-sm text-[#b45309] flex gap-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" /> 
                    <span>Zawiera alergeny: {selectedRecipe.allergens.join(', ')}. Informacje o alergenach podane w kreatorze. Nasze dania przygotowywane są w kuchniach, gdzie mogą występować ślady innych alergenów.</span>
                  </div>
                )}

                <div className="mt-6 text-xs text-[#6b7280] border-t pt-4">
                  Dane odżywcze i witaminy są przybliżone, oparte na standardowych tabelach wartości odżywczych i typowych składnikach. Nie zastępują porady dietetyka. Zawsze sprawdzaj aktualne etykiety produktów. 
                  <Link href="/regulamin" className="underline ml-1">Regulamin</Link> • <Link href="/polityka-prywatnosci" className="underline">Prywatność</Link>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link href="/start" className="flex-1 text-center bg-[#15803d] text-white py-3 rounded-2xl font-medium">Dodaj to danie do boxa</Link>
                  <button onClick={() => setSelectedRecipe(null)} className="flex-1 border border-[#e8dcc8] py-3 rounded-2xl">Zamknij</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/start" className="inline-block bg-[#15803d] hover:bg-[#166534] text-white px-10 py-3.5 rounded-2xl font-medium text-lg">Zacznij wybierać i zamawiać</Link>
          <p className="text-xs text-[#6b7280] mt-3">Wszystkie informacje w jednym miejscu • Pełna kontrola nad alergenami i preferencjami</p>
        </div>

        <footer className="mt-12 pt-6 border-t text-xs text-[#6b7280] flex flex-wrap gap-4 justify-center">
          <Link href="/regulamin" className="hover:text-[#15803d]">Regulamin</Link>
          <Link href="/polityka-prywatnosci" className="hover:text-[#15803d]">Polityka prywatności</Link>
          <span>© Smakowało – SMAKOWAŁO sp. z o.o., Poznań. Low-key, real food for real people.</span>
        </footer>
      </div>
    </div>
  );
}
