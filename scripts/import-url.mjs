#!/usr/bin/env node
/**
 * Uvoz teksta s URL-a u čitaonu.
 *
 * Upotreba:
 *   npm run import -- https://primjer.com/kolumna
 *   npm run import -- https://primjer.com/kolumna --tags kultura,esej
 *   npm run import -- https://primjer.com/kolumna --source "Ime portala"
 *
 * Skripta dohvaća stranicu, čisti HTML (naslov, autor, datum, tijelo teksta)
 * i sprema ga kao Markdown datoteku u src/content/texts/.
 */

import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';
import { slugify } from './lib/slugify.js';
import { htmlToMarkdown } from './lib/html-to-md.js';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
if (args.length === 0 || args[0].startsWith('-')) {
  console.error(
    'Upotreba: npm run import -- <url> [--tags tag1,tag2] [--source "Ime portala"]'
  );
  process.exit(1);
}

const url = args[0];
const getOpt = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
};

const tagsOpt = getOpt('--tags');
const sourceOpt = getOpt('--source');
const tags = tagsOpt ? tagsOpt.split(',').map((t) => t.trim()).filter(Boolean) : [];

async function fetchHtml(target) {
  const res = await fetch(target, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; personal-reading-room/1.0; +local use only)',
      Accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`Dohvat nije uspio: HTTP ${res.status} ${res.statusText}`);
  }
  return res.text();
}

function parseMeta(doc, article) {
  const meta = (sel) => doc.querySelector(sel)?.getAttribute('content') ?? undefined;

  const author =
    article.byline?.replace(/^by\s+/i, '').trim() ||
    meta('meta[name="author"]') ||
    meta('meta[property="article:author"]') ||
    undefined;

  const rawDate =
    meta('meta[property="article:published_time"]') ||
    meta('meta[name="date"]') ||
    doc.querySelector('time[datetime]')?.getAttribute('datetime') ||
    undefined;
  const date = rawDate ? new Date(rawDate) : new Date();

  const siteName =
    sourceOpt ||
    meta('meta[property="og:site_name"]') ||
    new URL(url).hostname.replace(/^www\./, '');

  return { author, date, siteName };
}

async function main() {
  console.log(`Dohvaćam: ${url}`);
  const html = await fetchHtml(url);
  const { document } = parseHTML(html);

  const reader = new Readability(document);
  const article = reader.parse();
  if (!article || !article.content) {
    console.error(
      'Nisam uspio izdvojiti tijelo teksta (stranica je možda JavaScript-renderirana ili paywall).'
    );
    console.error('Kao zaobilazno rješenje: sačuvaj stranicu kao HTML i pošalji mi je.');
    process.exit(2);
  }

  const { author, date, siteName } = parseMeta(document, article);

  const body = htmlToMarkdown(article.content).trim();
  if (!body) {
    console.error('Izdvojeno tijelo je prazno — prekidam.');
    process.exit(2);
  }

  const description =
    article.excerpt?.replace(/\s+/g, ' ').trim().slice(0, 300) || '';

  const fmtDate = date.toISOString().slice(0, 10);
  const slug = slugify(article.title) || slugify(new URL(url).pathname);

  const frontmatter = [
    '---',
    `title: "${(article.title ?? '').replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    author ? `author: "${author.replace(/"/g, '\\"')}"` : null,
    `source: "${siteName.replace(/"/g, '\\"')}"`,
    `date: ${fmtDate}`,
    `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`,
    `originalUrl: "${url}"`,
    '---',
    '',
  ]
    .filter((l) => l !== null)
    .join('\n');

  const md = `${frontmatter}\n${body}\n`;

  const outDir = path.join(process.cwd(), 'src', 'content', 'texts');
  await mkdir(outDir, { recursive: true });

  let outPath = path.join(outDir, `${slug}.md`);
  if (existsSync(outPath)) {
    outPath = path.join(outDir, `${slug}-${Date.now().toString(36)}.md`);
  }
  await writeFile(outPath, md, 'utf-8');

  console.log(`Spremljeno: ${path.relative(process.cwd(), outPath)}`);
  console.log(`Naslov: ${article.title}`);
  if (author) console.log(`Autor: ${author}`);
  console.log(`Datum: ${fmtDate}`);
  if (tags.length) console.log(`Tagovi: ${tags.join(', ')}`);
  console.log('Pokreni `npm run dev` i tekst će biti na polici.');
}

main().catch((err) => {
  console.error(`Greška: ${err.message}`);
  process.exit(1);
});
