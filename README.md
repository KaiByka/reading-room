# Čitaona

Osobna, privatna biblioteka tekstova i kolumni — "reading room" za tekstove
koje vrijedi pročitati još jednom.

## Pokretanje (lokalno, privatno)

```bash
npm install
npm run dev
```

Stranica je dostupna na `http://localhost:4321`. Radi isključivo lokalno —
ništa nije javno objavljeno.

Produkcija (statički fajlovi u `dist/`):

```bash
npm run build
```

## Dodavanje teksta

Svaki tekst je jedna Markdown datoteka u `src/content/texts/`:

```markdown
---
title: "Naslov kolumne"
description: "Jedna-dvije rečenice o čemu se radi."
author: "Ime autora"
source: "Portal ili novine"
date: 2025-01-15
tags: ["kultura", "esej"]
---

Ovdje počinje tekst…
```

Nakon dodavanja, tekst se automatski pojavi na polici, s pretragom i
tagovima.

### Uvoz s URL-a

Kolumnu ili članak s interneta možeš uvesti jednom naredbom — skripta
dohvati stranicu, izdvoji naslov, autora, datum i tijelo te spremi sve
kao Markdown:

```bash
npm run import -- https://primjer.com/kolumna
npm run import -- https://primjer.com/kolumna --tags kultura,esej
npm run import -- https://primjer.com/kolumna --source "Ime portala"
```

Izvorni URL se pamti u `originalUrl` polju i prikazuje na dnu teksta.
Ako je stranica JavaScript-renderirana ili iza paywalla, skripta će to
javiti — tada tekst sačuvaj ručno.

## Dizajn

- Tople, papirnate nijanse (svjetla tema) + prava tamna tema
- Serif za tijelo teksta, bez serifna za sučelje
- Mjerna dužina reda ~65 znakova, velik line-height — za dugotrajno čitanje
- Polica s karticama, pretraga i tag filtri (radi i bez JavaScript servera)

## Struktura

- `src/pages/index.astro` — naslovnica (polica s karticama)
- `src/pages/tekstovi/[slug].astro` — stranica za čitanje
- `src/pages/o-citaoni.astro` — upute
- `src/content/texts/` — svi tekstovi
- `src/layouts/` i `src/components/` — dizajn
- `src/styles/global.css` — boje, tipografija, teme
