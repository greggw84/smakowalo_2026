export const SITE_URL = 'https://www.smakowalo.pl';

export type RouteSeo = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

export const ROUTE_SEO: Record<string, RouteSeo> = {
  home: {
    path: '/',
    title: 'Zestawy do gotowania z dostawą | Poznań | Smakowało',
    description:
      'Odmierzone składniki + przepisy. Plany 2, 4 lub 6 osób. Dostawa wt/czw w Poznaniu i do 30 km. Subskrypcja lub jednorazowo.',
  },
  menu: {
    path: '/menu',
    title: 'Menu tygodnia — dania, czas i kcal | Smakowało',
    description:
      'Aktualne menu Smakowało: czas gotowania, kcal, alergeny i filtry. Wybierz dania do boxa z dostawą w Poznaniu.',
  },
  wybierzMenu: {
    path: '/wybierz-menu',
    title: 'Wybierz box 2/4/6 osób | Smakowało',
    description:
      'Ułóż box: liczba osób, preferencje i alergeny. System filtruje dania i ostrzega przy wykluczeniach.',
  },
  kontakt: {
    path: '/kontakt',
    title: 'Kontakt — dostawa Poznań + 30 km | Smakowało',
    description:
      'Napisz na kontakt@smakowalo.pl. SMAKOWAŁO sp. z o.o., Poznań. Dostawa wtorek lub czwartek w mieście i okolicach.',
  },
  regulamin: {
    path: '/regulamin',
    title: 'Regulamin świadczenia usług | Smakowało',
    description:
      'Regulamin zamówień, dostawy, płatności i subskrypcji Smakowało (zestawy do gotowania, Poznań).',
  },
  polityka: {
    path: '/polityka-prywatnosci',
    title: 'Polityka prywatności | Smakowało',
    description:
      'Jak Smakowało przetwarza dane klientów, zamówień i preferencji żywieniowych (RODO).',
  },
  logowanie: {
    path: '/logowanie',
    title: 'Logowanie | Smakowało',
    description:
      'Zaloguj się do konta Smakowało, żeby dokończyć zamówienie lub zarządzać boxem.',
    noindex: true,
  },
  rejestracja: {
    path: '/rejestracja',
    title: 'Załóż konto | Smakowało',
    description:
      'Załóż konto Smakowało: zapiszesz preferencje, alergeny i dokończysz zamówienie boxa.',
    noindex: true,
  },
};

export function buildMetadata(seo: RouteSeo) {
  const url = `${SITE_URL}${seo.path === '/' ? '' : seo.path}`;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title,
      description: seo.description,
      locale: 'pl_PL',
      url,
      siteName: 'Smakowało',
      type: 'website' as const,
    },
    robots: seo.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export const FAQ_ITEMS = [
  {
    question: 'Jak działają alergeny i ostrzeżenia?',
    answer:
      'W kreatorze zaznaczasz alergeny. Na liście dań i w podsumowaniu widzisz ostrzeżenia. Zawsze sprawdzaj etykiety — w kuchni mogą być ślady krzyżowe.',
  },
  {
    question: 'Ile zapłacę za pierwszy box łącznie?',
    answer:
      'Cena pierwszego tygodnia (promo na planie 2/4/6) + dostawa. Dostawa to 19 zł, gdy zamawiasz jednorazowo albo gdy wartość boxa jest poniżej 350 zł. Przy subskrypcji albo od 350 zł dostawa jest gratis — wtedy total = sama cena boxa promo.',
  },
  {
    question: 'Czy mogę pominąć tydzień (skip) lub pauzować?',
    answer:
      'Tak. Pauza / skip / zmiana planu w panelu. Żeby zdążyć na kolejny tydzień, zgłoś zmianę z co najmniej 48 h wyprzedzeniem (§3 regulaminu).',
  },
  {
    question: 'Kiedy jest dostawa i co oznacza 16–21?',
    answer:
      'Dostawa: wtorek lub czwartek, strefa Poznań + ok. 30 km (m.in. Wilda, Jeżyce, Rataje, Komorniki, Swarzędz). 16–21 to okno doręczenia kuriera, nie cutoff na złożenie zamówienia / zmianę boxa.',
  },
] as const;
