import { slugify } from './slug';

export function extractHeadings(markdown) {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const headings = [];
  const seen = new Map();
  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].replace(/[*_`]/g, '').trim();
    let slug = slugify(text);
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count}`;
    headings.push({ level, text, slug });
  }
  return headings;
}
