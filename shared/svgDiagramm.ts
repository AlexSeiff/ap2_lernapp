// Diagramme in den Lernblättern: ```svg-Codeblöcke mit handgezeichnetem SVG werden als Bild gezeigt (Glossar & Diagramme, Deep Dive 17).
// Das SVG wird direkt ins Dokument gesetzt (Farben über CSS-Klassen, damit Hell/Dunkel stimmt). Deshalb gilt eine Positivliste:
// nur Zeichen-Elemente und -Attribute, keine Skripte, Ereignisse, Links, Fremdinhalte oder externen Verweise. Ein Block, der sie
// verletzt, wird als Code angezeigt und als Importhinweis gemeldet.

const ELEMENTE = new Set([
  'svg',
  'g',
  'defs',
  'marker',
  'path',
  'line',
  'polyline',
  'polygon',
  'rect',
  'circle',
  'ellipse',
  'text',
  'tspan',
  'title',
  'desc',
]);

const ATTRIBUTE = new Set([
  'xmlns',
  'viewBox',
  'width',
  'height',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'dx',
  'dy',
  'd',
  'points',
  'class',
  'id',
  'transform',
  'role',
  'aria-label',
  'refX',
  'refY',
  'markerWidth',
  'markerHeight',
  'markerUnits',
  'orient',
  'marker-start',
  'marker-mid',
  'marker-end',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-dasharray',
  'stroke-linecap',
  'stroke-linejoin',
  'opacity',
  'text-anchor',
  'dominant-baseline',
  'font-size',
  'font-weight',
  'font-style',
]);

// SVG-Paint und Marker können externe Ressourcen laden. Nur einfache Farben und lokale Fragmente zulassen.
const FARBE = /^(?:[a-z]+|#[0-9a-f]{3,4}|#[0-9a-f]{6}|#[0-9a-f]{8}|(?:rgb|hsl)a?\([\d.,% +/−-]+\))$/i;
const FRAGMENT = /^url\(\s*#[\w-]+\s*\)$/i;

const TAG = /<(\/?)([A-Za-z][\w:-]*)((?:\s+[\w:-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/g;
const ATTR = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

/** Fehlermeldung, wenn das SVG nicht der Positivliste entspricht; sonst undefined. */
export function pruefeSvg(svg: string): string | undefined {
  const text = svg.trim();
  if (!/^<svg[\s>]/.test(text) || !/<\/svg>$/.test(text)) return 'Der Block muss mit <svg …> beginnen und mit </svg> enden.';
  for (const m of text.matchAll(TAG)) {
    const name = m[2];
    if (!ELEMENTE.has(name)) return `Element <${name}> ist in Diagrammen nicht erlaubt.`;
    for (const a of m[3].matchAll(ATTR)) {
      const attr = a[1];
      const wert = a[2] ?? a[3] ?? '';
      if (!ATTRIBUTE.has(attr)) return `Attribut „${attr}“ an <${name}> ist in Diagrammen nicht erlaubt.`;
      if ((attr === 'fill' || attr === 'stroke') && !FARBE.test(wert) && !FRAGMENT.test(wert))
        return `Unerlaubte Farbe oder externer Verweis in „${attr}“.`;
      if (attr.startsWith('marker-') && wert !== 'none' && !FRAGMENT.test(wert)) return `Nur lokale Marker sind in „${attr}“ erlaubt.`;
      // Verweise nur auf Marker im selben SVG: url(#id)
      for (const u of wert.matchAll(/url\(([^)]*)\)/g)) {
        if (!/^#[\w-]+$/.test(u[1].trim())) return `Nur lokale Verweise url(#id) sind erlaubt, nicht url(${u[1]}).`;
      }
      if (/javascript:|expression\s*\(/i.test(wert)) return `Unerlaubter Wert in „${attr}“.`;
    }
  }
  // Was nach dem Entfernen aller erlaubten Tags übrig bleibt, ist Text – ein „<“ darin wäre ein Kommentar, CDATA oder kaputtes Markup.
  if (text.replace(TAG, '').includes('<')) return 'Kommentare, CDATA oder unvollständige Tags sind in Diagrammen nicht erlaubt.';
  return undefined;
}

/** Alle ```svg-Blöcke eines Markdown-Texts (Inhalt ohne Zaun). */
export function svgBloecke(markdown: string): string[] {
  return [...markdown.matchAll(/^[ \t]*```svg[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```[ \t]*$/gm)].map((m) => m[1]);
}

/** ids, die ein SVG definiert (für die Prüfung, dass Marker-ids im ganzen Inhalt eindeutig sind). */
export function svgIds(svg: string): string[] {
  return [...svg.matchAll(/\sid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]);
}
