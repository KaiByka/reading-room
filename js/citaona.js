/* ============================================================
   ČITAONA — zajednički JS: pretraga, tagovi, tema
   Katalog tekstova se vodi u datoteci js/katalog.js
============================================================ */

// ---- inicijalizacija teme (prije rendera, protiv treptanja) ----
(function () {
  const stored = localStorage.getItem('citaona-tema');
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = stored || (dark ? 'dark' : 'light');
})();

document.addEventListener('DOMContentLoaded', function () {
  // ---- prebacivanje teme ----
  const themeBtn = document.getElementById('tema-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('citaona-tema', next);
    });
  }

  const searchInput = document.getElementById('pretraga');
  const tagFilter = document.getElementById('tag-filter');
  const countEl = document.getElementById('broj');
  const emptyEl = document.getElementById('prazno');

  if (!searchInput || !window.KATALOG) return;

  const rows = Array.from(document.querySelectorAll('.catalog-row'));
  let aktivniTag = null;

  // ---- gumbići za tagove ----
  const tagovi = Array.from(new Set(window.KATALOG.flatMap(function (t) { return t.tags || []; }))).sort();
  tagovi.forEach(function (tag) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag-btn';
    btn.textContent = tag;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', function () {
      aktivniTag = aktivniTag === tag ? null : tag;
      tagFilter.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn && aktivniTag === tag));
      });
      primijeni();
    });
    tagFilter.appendChild(btn);
  });

  // ---- pretraga + filter ----
  function primijeni() {
    const q = searchInput.value.trim().toLowerCase();
    const rijeci = q ? q.split(/\s+/) : [];
    let vidljivo = 0;

    window.KATALOG.forEach(function (tekst, i) {
      const row = rows[i];
      if (!row) return;

      let pokazuje = true;

      if (aktivniTag && !(tekst.tags || []).includes(aktivniTag)) pokazuje = false;

      if (pokazuje && rijeci.length) {
        const sjeno = [tekst.naslov, tekst.opis, tekst.autor, tekst.izvor, (tekst.tags || []).join(' ')]
          .filter(Boolean).join(' ').toLowerCase();
        pokazuje = rijeci.every(function (r) { return sjeno.includes(r); });
      }

      row.style.display = pokazuje ? '' : 'none';
      if (pokazuje) vidljivo++;
    });

    const forma = vidljivo === 1 ? 'tekst' : vidljivo >= 2 && vidljivo <= 4 ? 'teksta' : 'tekstova';
    countEl.textContent = vidljivo + ' ' + forma + ' na polici';
    if (emptyEl) emptyEl.classList.toggle('show', vidljivo === 0);
  }

  searchInput.addEventListener('input', primijeni);
  primijeni();
});
