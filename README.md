# Čitaona

Osobna, privatna biblioteka tekstova i kolumni — za tekstove koje vrijedi
pročitati još jednom.

**Čisti HTML/CSS/JS — bez Node.js-a, bez buildanja, bez servera.**
Dvostruki klik na `index.html` i sve radi.

## Struktura

```
citaona/
├── index.html        ← polica (naslovnica)
├── o-citaoni.html    ← upute
├── css/stil.css      ← sav dizajn
├── js/citaona.js     ← pretraga, tagovi, tema
├── js/katalog.js     ← popis tekstova (ovdje dodaješ nove)
└── tekstovi/         ← sami tekstovi
```

## Dodavanje novog teksta

1. **Dupliciraj** bilo koju datoteku u `tekstovi/` (npr. `o-umijecu-sporog-citanja.html`)
2. Zamijeni naslov, metapodatke (izvor, autor, datum, tagovi) i tijelo teksta
3. Otvori `js/katalog.js` i dodaj unos na kraj liste:

```js
{
  naslov: 'Naslov novog teksta',
  opis: 'Jedna-dvije rečenice o čemu se radi.',
  autor: 'Ime autora',
  izvor: 'Portal ili novine',
  datum: 'ožujak 2025.',
  tags: ['kultura', 'esej'],
  url: 'tekstovi/novi-tekst.html',
},
```

Gotovo — tekst je na polici, pretraga i tagovi rade automatski.

## Dizajn

- Editorijalni, novinski izgled: Fraunces (display), Source Serif 4 (tijelo),
  IBM Plex Mono (metapodaci)
- Duboka krem pozadina s finom teksturom papira; tamna tema je "stari
  papir u tami", ne crno-bijela
- Kazalo s numeriranim redovima umjesto kartica, drop-cap na početku
  teksta, pečat "Za ponovno čitanje"
- Kako izgleda: slike u `docs/screenshots/`

## Privatnost

Sve radi lokalno, izravno iz mape — bez objave, bez servera. Fontovi se
dohvaćaju s Google Fontsa (ako si offline, koriste se rezervni).
