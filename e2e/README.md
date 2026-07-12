# Testy e2e

Testy end-to-end w Playwright. Uruchamiają zbudowane rozszerzenie w przeglądarce
Chromium.

## Wymagania

- `npm run build:chromium` — testy używają zbudowanego rozszerzenia z `dist/chromium`
- `npx playwright install chromium` — jednorazowe pobranie przeglądarki testowej
- internet — testy odtwarzają publiczne strumienie testowe i wchodzą na stronę TVP

## Jak uruchomić

```sh
npm run build:chromium   # raz, po każdej zmianie w src/
npm run test:e2e:ui      # okno Playwrighta do przeglądania i uruchamiania testów
```

Wyniki lądują w `test-results/junit.xml`.

## Skąd biorą się strumienie wideo

Wszystkie adresy są w jednym pliku: `e2e/streams.ts`:

- **nagranie** — testowy strumień mux (~10 minut, kilka jakości obrazu); używa go
  większość testów
- **transmisja na żywo** — strumień demo Unified Streaming; jeśli akurat nie działa,
  testy "na żywo" same się pomijają
- **niedziałający adres** — `invalid.invalid`, do testu ekranu błędu sieci
- **strona TVP** (`TVP_PAGE`) — prawdziwa strona nagrania, na której test sprawdza
  cały przepływ: wykrycie strumienia i automatyczne otwarcie odtwarzacza

Jeśli któryś adres przestanie działać, wystarczy podmienić go w tym pliku.
Zadziała dowolne nagranie HLS z kilkoma jakościami, którego serwer wysyła nagłówek
`Access-Control-Allow-Origin: *`. Po podmianie trzeba zaktualizować listę
wysokości obrazu w `VOD_HEIGHTS`. Link do strony TVP trzeba podmienić na aktualną transmisję lub powtórkę — gdy strona zniknie,
test sam się pomija.

## Czego te testy nie sprawdzają

Google Cast oraz ekrany błędów DRM i wygasłego linku są sprawdzane testami
jednostkowymi w `src/`. Firefox nie jest objęty testami e2e.
