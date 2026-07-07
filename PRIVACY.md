# Polityka prywatności

**Odtwarzacz dla TVP SPORT™** — rozszerzenie przeglądarki

Obowiązuje od: 7 lipca 2026

## Zbieranie danych

Rozszerzenie **nie zbiera, nie przetwarza ani nie wysyła żadnych danych** — osobowych ani anonimowych. Nie zawiera telemetrii, analityki, reklam ani żadnych mechanizmów śledzenia. Nie komunikuje się z żadnymi serwerami poza serwerami TVP, z których pobierane są transmisje.

## Dane przechowywane lokalnie

Rozszerzenie przechowuje dane wyłącznie lokalnie, w magazynie przeglądarki użytkownika:

- **Ustawienia odtwarzacza** (`storage.local`) — m.in. jakość, głośność, motyw, skróty, własny CSS. Istnieją tylko po to, by odtwarzacz pamiętał Twoje preferencje.
- **Dziennik zdarzeń** (`storage.local`) — podręczny log techniczny (np. wykrycie transmisji, błędy odtwarzania) ułatwiający diagnozowanie problemów. Jest widoczny w menu „Logi" i możesz go w każdej chwili wyczyścić. Nie jest nigdzie wysyłany.
- **Adresy transmisji** (`storage.session`) — tymczasowo, na czas sesji przeglądarki, aby po kliknięciu ikony rozszerzenia otworzyć transmisję. Znikają po zamknięciu przeglądarki.

Żadne z tych danych nie opuszczają Twojej przeglądarki. Odinstalowanie rozszerzenia usuwa je bezpowrotnie.

## Uprawnienia

- **`webRequest`** — pasywne wykrywanie adresu transmisji (playlisty `.m3u8`) na otwartej stronie transmisji; ograniczone filtrem wyłącznie do `*://*.tvp.pl/*.m3u8*`.
- **`declarativeNetRequest`** — pojedyncza reguła modyfikująca nagłówki żądań kierowanych wyłącznie do serwerów transmisji TVP (tvp.pl, redcdn.pl), aby odtwarzacz mógł pobrać wideo. Nie blokuje ani nie przekierowuje żadnych żądań.
- **`storage`** — lokalny zapis danych opisanych powyżej.
- **Dostęp do hostów `tvp.pl` i `redcdn.pl`** — domeny serwisu TVP Sport i jego CDN, z których serwowane są playlisty i segmenty wideo. Rozszerzenie nie działa na żadnych innych witrynach i nie modyfikuje treści żadnych stron.

## Strony trzecie

Transmisje pobierane są bezpośrednio z serwerów TVP — dokładnie tak, jak robi to oficjalna strona sport.tvp.pl. Rozszerzenie nie pośredniczy w tym ruchu przez żadne własne serwery. Zasady przetwarzania danych przez TVP opisuje polityka prywatności serwisu sport.tvp.pl.

## Zmiany polityki

Wszelkie zmiany tej polityki będą publikowane w tym repozytorium — pełna historia zmian jest dostępna w historii gita.

## Kontakt

Pytania i zgłoszenia: [GitHub Issues](https://github.com/damian-kociszewski/tvp-sport-player/issues)
