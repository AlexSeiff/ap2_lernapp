// Hoch- und Tiefstellung in Klartext-Formeln (Karteikarten, Begriffsseiten, Hinweise): Die Karten schreiben Formeln ohne KaTeX,
// z. B. „e^(−z)“, „(180 / 120)^(1/7)“, „p_i“ oder „s_xy“. Ohne Hilfe stehen ^ und _ dann wörtlich im Text.
// teileHochTief() zerlegt einen Text in Stücke, rehypeHochTief() setzt sie im fertigen HTML-Baum als <sup>/<sub>.
// Code, Formeln (KaTeX) und Links bleiben unberührt; Bezeichner wie kunden_id oder M_ID auch (Tiefstellung nur nach einem
// einzelnen Kleinbuchstaben, z. B. x_i).

import type { Element, ElementContent, Root } from 'hast';

export type HochTiefTeil = { text: string; art?: 'sup' | 'sub' };

const MUSTER = /\^\(([^()\s][^()]{0,15})\)|\^([−+-]?[\p{L}\p{N}]{1,3})|(?<![\p{L}\p{N}_.])(\p{Ll}\p{M}?)_([a-z0-9]{1,2})(?![\p{L}0-9_])/gu;

/** Text in normale, hoch- und tiefgestellte Stücke zerlegen; ohne Treffer genau ein Stück. */
export function teileHochTief(text: string): HochTiefTeil[] {
  if (!text.includes('^') && !text.includes('_')) return [{ text }];
  const teile: HochTiefTeil[] = [];
  let pos = 0;
  const normal = (bis: number) => {
    if (bis > pos) teile.push({ text: text.slice(pos, bis) });
  };
  for (const m of text.matchAll(MUSTER)) {
    const [ganz, klammer, kurz, basis, index] = m;
    if (basis !== undefined) {
      normal(m.index + basis.length);
      teile.push({ text: index, art: 'sub' });
    } else {
      normal(m.index);
      teile.push({ text: klammer ?? kurz, art: 'sup' });
    }
    pos = m.index + ganz.length;
  }
  normal(text.length);
  return teile.length ? teile : [{ text }];
}

/** Darin wird nichts gesetzt (Code, Links, Formeln). */
const AUSLASSEN = new Set(['code', 'pre', 'a', 'kbd', 'script', 'style', 'svg', 'math', 'sup', 'sub']);

const istKatex = (el: Element) => {
  const cls = el.properties.className;
  return Array.isArray(cls) && cls.some((c) => String(c).startsWith('katex'));
};

function besuche(node: Root | Element) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === 'element') {
      if (!AUSLASSEN.has(child.tagName) && !istKatex(child)) besuche(child);
      continue;
    }
    if (child.type !== 'text') continue;
    const teile = teileHochTief(child.value);
    if (teile.length === 1 && !teile[0].art) continue;
    const neu: ElementContent[] = teile.map((t) =>
      t.art
        ? { type: 'element', tagName: t.art, properties: {}, children: [{ type: 'text', value: t.text }] }
        : { type: 'text', value: t.text },
    );
    node.children.splice(i, 1, ...(neu as typeof node.children));
    i += neu.length - 1;
  }
}

/** rehype-Plugin: „^(…)“, „^x“ und „x_i“ in Textknoten als <sup>/<sub> setzen. */
export function rehypeHochTief() {
  return (tree: Root) => besuche(tree);
}
