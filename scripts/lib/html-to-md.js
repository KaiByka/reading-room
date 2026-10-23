/**
 * Jednostavan pretvarač HTML-a u Markdown (bez vanjskih ovisnosti).
 * Pokriva elemente koji se pojavljuju u novinskim tekstovima:
 * naslovi, odlomci, em/strong, linkovi, slike, citati, liste, code.
 */

import { parseHTML } from 'linkedom';

const blockTags = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol',
  'pre', 'hr', 'figure', 'figcaption', 'table',
]);

export function htmlToMarkdown(html) {
  const { document } = parseHTML(`<div id="root">${html}</div>`);
  const root = document.getElementById('root');
  return convertNode(root).replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function convertNode(node) {
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1) return '';

  const tag = node.tagName.toLowerCase();
  const children = () => Array.from(node.childNodes).map(convertNode).join('');

  switch (tag) {
    case 'h1': return `\n\n## ${inlineText(node)}\n\n`;
    case 'h2': return `\n\n## ${inlineText(node)}\n\n`;
    case 'h3': return `\n\n### ${inlineText(node)}\n\n`;
    case 'h4':
    case 'h5':
    case 'h6': return `\n\n#### ${inlineText(node)}\n\n`;
    case 'p': return `\n\n${inlineText(node)}\n\n`;
    case 'br': return '\n';
    case 'hr': return '\n\n---\n\n';
    case 'strong':
    case 'b': return `**${inlineText(node)}**`;
    case 'em':
    case 'i': return `*${inlineText(node)}*`;
    case 'a': {
      const href = node.getAttribute('href') ?? '';
      const text = inlineText(node);
      return href ? `[${text}](${href})` : text;
    }
    case 'img': {
      const src = node.getAttribute('src') ?? '';
      const alt = node.getAttribute('alt') ?? '';
      return src ? `\n\n![${alt}](${src})\n\n` : '';
    }
    case 'blockquote':
      return `\n\n${convertChildren(node)
        .trim()
        .split('\n')
        .map((l) => `> ${l}`.trimEnd())
        .join('\n')}\n\n`;
    case 'ul':
      return `\n\n${Array.from(node.children)
        .filter((li) => li.tagName.toLowerCase() === 'li')
        .map((li) => `- ${inlineText(li).trim()}`)
        .join('\n')}\n\n`;
    case 'ol':
      return `\n\n${Array.from(node.children)
        .filter((li) => li.tagName.toLowerCase() === 'li')
        .map((li, i) => `${i + 1}. ${inlineText(li).trim()}`)
        .join('\n')}\n\n`;
    case 'pre':
      return `\n\n\`\`\`\n${node.textContent.trim()}\n\`\`\`\n\n`;
    case 'code': return `\`${node.textContent}\``;
    case 'figure':
      return `\n\n${convertChildren(node)}\n\n`;
    case 'figcaption':
      return `*${inlineText(node).trim()}*\n\n`;
    case 'table':
      return `\n\n${convertChildren(node)}\n\n`;
    case 'tr':
      return convertChildren(node) + '\n';
    case 'td':
    case 'th':
      return `| ${inlineText(node).trim()} `;
    case 'script':
    case 'style':
    case 'noscript':
    case 'nav':
    case 'footer':
    case 'aside':
    case 'iframe':
    case 'form':
      return '';
    default:
      return convertChildren(node);
  }
}

function convertChildren(node) {
  return Array.from(node.childNodes).map(convertNode).join('');
}

/** Inline sadržaj: pretvara dijelove, ali bez blokovskih prijeloma. */
function inlineText(node) {
  const parts = Array.from(node.childNodes).map((child) => {
    if (child.nodeType === 3) return child.textContent.replace(/\s+/g, ' ');
    if (child.nodeType !== 1) return '';
    const tag = child.tagName.toLowerCase();
    if (blockTags.has(tag)) return ` ${inlineText(child)} `;
    return convertNode(child);
  });
  return parts.join('').replace(/\s+/g, ' ').trim();
}
