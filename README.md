![Logo](public/icons/active/96.png)

# Odtwarzacz dla TVP SPORT™

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/nkkeeakhllmffaanpmlpefpfagbeihma?label=Chrome%20Web%20Store&color=4285F4)](https://chromewebstore.google.com/detail/odtwarzacz-dla-tvp-sport/nkkeeakhllmffaanpmlpefpfagbeihma)
[![Użytkownicy Chrome](https://img.shields.io/chrome-web-store/users/nkkeeakhllmffaanpmlpefpfagbeihma?label=u%C5%BCytkownicy&color=4285F4)](https://chromewebstore.google.com/detail/odtwarzacz-dla-tvp-sport/nkkeeakhllmffaanpmlpefpfagbeihma)
[![Ocena Chrome](https://img.shields.io/chrome-web-store/rating/nkkeeakhllmffaanpmlpefpfagbeihma?label=ocena&color=4285F4)](https://chromewebstore.google.com/detail/odtwarzacz-dla-tvp-sport/nkkeeakhllmffaanpmlpefpfagbeihma)
[![Firefox Add-ons](https://img.shields.io/amo/v/odtwarzacz-dla-tvp-sport?label=Firefox%20Add-ons&color=FF7139)](https://addons.mozilla.org/pl/firefox/addon/odtwarzacz-dla-tvp-sport/)
[![Użytkownicy Firefox](https://img.shields.io/amo/users/odtwarzacz-dla-tvp-sport?label=u%C5%BCytkownicy&color=FF7139)](https://addons.mozilla.org/pl/firefox/addon/odtwarzacz-dla-tvp-sport/)
[![Ocena Firefox](https://img.shields.io/amo/rating/odtwarzacz-dla-tvp-sport?label=ocena&color=FF7139)](https://addons.mozilla.org/pl/firefox/addon/odtwarzacz-dla-tvp-sport/)
[![Licencja](https://img.shields.io/github/license/damian-kociszewski/tvp-sport-player?label=licencja&color=green)](LICENSE)

Nieoficjalne rozszerzenie przeglądarki, które otwiera transmisje z [sport.tvp.pl](https://sport.tvp.pl) w pełnoprawnym, dopracowanym odtwarzaczu wideo.

**Pobierz**: [Chrome Web Store](https://chromewebstore.google.com/detail/odtwarzacz-dla-tvp-sport/nkkeeakhllmffaanpmlpefpfagbeihma) · [Firefox Add-ons](https://addons.mozilla.org/pl/firefox/addon/odtwarzacz-dla-tvp-sport/)

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

- **Chrome / Edge / Brave / Opera / Vivaldi**: zainstaluj z [Chrome Web Store](https://chromewebstore.google.com/detail/odtwarzacz-dla-tvp-sport/nkkeeakhllmffaanpmlpefpfagbeihma)
- **Firefox / LibreWolf / Zen**: zainstaluj z [Firefox Add-ons](https://addons.mozilla.org/pl/firefox/addon/odtwarzacz-dla-tvp-sport/)

Wejdź na transmisję na sport.tvp.pl i rozpocznij odtwarzanie — rozszerzenie zrobi resztę.

### Instalacja ręczna

1. Zbuduj rozszerzenie (poniżej) albo pobierz paczkę z [wydań](https://github.com/damian-kociszewski/tvp-sport-player/releases).
2. **Chrome / Edge / Brave / Opera / Vivaldi**: `chrome://extensions` → włącz „Tryb dewelopera" → „Załaduj rozpakowane" → wskaż katalog `dist/chromium`.
3. **Firefox / LibreWolf / Zen**: `about:debugging#/runtime/this-firefox` → „Załaduj tymczasowy dodatek" → wskaż `dist/gecko/manifest.json`. Następnie w `about:addons` nadaj rozszerzeniu uprawnienia do witryn tvp.pl i redcdn.pl.

## Rozwój

```bash
npm install
npm run dev            # tryb deweloperski (Chromium)
npm run build          # build obu wersji: dist/chromium/ i dist/gecko/
npm run build:chromium # tylko Chromium
npm run build:gecko    # tylko Firefox
```

## Prywatność

Rozszerzenie nie zbiera ani nie wysyła żadnych danych — wszystko pozostaje lokalnie w Twojej przeglądarce, a transmisje pochodzą bezpośrednio z serwerów TVP. Szczegóły: [Polityka prywatności](PRIVACY.md).

## Licencja

[MIT](LICENSE)

Rozszerzenie nie jest powiązane, sponsorowane ani autoryzowane przez Telewizję Polską S.A. Nazwa „TVP SPORT", logo oraz treść transmisji są własnością ich właścicieli.
