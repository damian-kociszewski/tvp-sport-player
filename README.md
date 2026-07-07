![Logo](public/icons/active/96.png)

# Odtwarzacz dla TVP SPORT™

Nieoficjalne rozszerzenie przeglądarki, które otwiera transmisje z [sport.tvp.pl](https://sport.tvp.pl) w pełnoprawnym, dopracowanym odtwarzaczu wideo.

![Odtwarzacz](docs/screenshot-1.png)

## Dlaczego powstało

Oficjalny odtwarzacz na stronie TVP Sport ma ograniczone możliwości.
To rozszerzenie automatycznie wykrywa transmisję na otwartej stronie i odtwarza ją we własnym odtwarzaczu, który daje pełną kontrolę nad oglądaniem.

## Funkcje

- **Jakość obrazu** — wybór ręczny lub automatyczny, z konfigurowalną jakością domyślną
- **Ścieżka dźwiękowa i napisy** — np. komentarz angielski zamiast polskiego
- **Skróty klawiszowe** — odtwórz / pauza, wyciszenie, przewijanie, głośność, pełny ekran, obraz w obrazie, powrót na żywo i więcej
- **Obraz w obrazie** oraz **przesyłanie na inne urządzenia** (Cast / AirPlay)
- **Przewijanie nagrań** z konfigurowalnym krokiem (5–60 s)
- **Zapamiętywanie ustawień i głośności**, autoodtwarzanie, automatyczne otwieranie odtwarzacza
- **Jasny i ciemny motyw**, a dla zaawansowanych — własny CSS

| Ustawienia | Skróty klawiszowe |
| --- | --- |
| ![Ustawienia](docs/screenshot-2.png) | ![Skróty klawiszowe](docs/screenshot-3.png) |

## Instalacja

1. Zbuduj rozszerzenie (poniżej) albo pobierz paczkę z [wydań](https://github.com/damian-kociszewski/tvp-sport-player/releases).
2. **Chrome / Edge / Brave**: `chrome://extensions` → włącz „Tryb dewelopera" → „Załaduj rozpakowane" → wskaż katalog `dist-chromium`.
3. **Firefox**: `about:debugging#/runtime/this-firefox` → „Załaduj tymczasowy dodatek" → wskaż `dist-gecko/manifest.json`. Następnie w `about:addons` nadaj rozszerzeniu uprawnienia do witryn tvp.pl i redcdn.pl.
4. Wejdź na transmisję na sport.tvp.pl i rozpocznij odtwarzanie — rozszerzenie zrobi resztę.

## Stack technologiczny

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) + [CRXJS](https://crxjs.dev) — build rozszerzenia dla Chromium i Gecko
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix UI)
- [Vidstack](https://vidstack.io) + [hls.js](https://github.com/video-dev/hls.js) — odtwarzacz i strumieniowanie HLS
- [Phosphor Icons](https://phosphoricons.com) · [Biome](https://biomejs.dev)

## Rozwój

```bash
npm install
npm run dev            # tryb deweloperski (Chromium)
npm run build          # build obu wersji: dist-chromium/ i dist-gecko/
npm run build:chromium # tylko Chromium
npm run build:gecko    # tylko Firefox
```

## Prywatność

Rozszerzenie nie zbiera ani nie wysyła żadnych danych — wszystko pozostaje lokalnie w Twojej przeglądarce, a transmisje pochodzą bezpośrednio z serwerów TVP. Szczegóły: [Polityka prywatności](PRIVACY.md).

## Licencja

[MIT](LICENSE)

Rozszerzenie nie jest powiązane, sponsorowane ani autoryzowane przez Telewizję Polską S.A. Nazwa „TVP SPORT", logo oraz treść transmisji są własnością ich właścicieli.
