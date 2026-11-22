// XML lesen und mit XPath abfragen – rein, ohne DOM, damit Import, Tests und App dieselbe Prüfung benutzen.
// 1. `pruefeXmlSyntax`: Wohlgeformtheit nach XML 1.0 mit deutschen Meldungen zu den typischen Prüfungsfehlern (End-Tag fehlt, falsch
//    verschachtelt, Groß-/Kleinschreibung, zwei Wurzelelemente, Attributwert ohne Anführungszeichen, & und < im Text …). Ohne DTD-Auswertung:
//    Ein Dokument ist hier wohlgeformt oder nicht; ob es valide ist, kann ohne Schema niemand sagen.
// 2. `werteXpath`: XPath 1.0 in dem Umfang, den eine Prüfung braucht – Pfade mit / und //, *, @, text(), node(), . und .., die Achsen,
//    Prädikate mit Position und Vergleich, and/or, Rechenzeichen, | und die üblichen Funktionen (count, sum, contains, last …).

import { zeileSpalte } from './jsonUebungen.ts';

// ---------- Baum ----------

export interface XmlElement {
  art: 'element';
  name: string;
  attribute: XmlAttribut[];
  kinder: (XmlElement | XmlText)[];
  eltern: XmlElement | XmlDokument;
  /** Dokumentreihenfolge (für //, | und Positionen). */
  nr: number;
}
export interface XmlAttribut {
  art: 'attribut';
  name: string;
  wert: string;
  eltern: XmlElement;
  nr: number;
}
export interface XmlText {
  art: 'text';
  text: string;
  eltern: XmlElement;
  nr: number;
}
export interface XmlDokument {
  art: 'dokument';
  kinder: XmlElement[];
  nr: number;
}
export type XmlKnoten = XmlDokument | XmlElement | XmlAttribut | XmlText;

export interface XmlFehler {
  meldung: string;
  zeile: number;
  spalte: number;
  stelle: number;
}

export type XmlSyntax = { ok: true; dokument: XmlDokument } | { ok: false; fehler: XmlFehler };

class Abbruch extends Error {
  constructor(
    readonly stelle: number,
    meldung: string,
  ) {
    super(meldung);
  }
}

const NAMENSANFANG = /[\p{L}_:]/u;
const NAMENSZEICHEN = /[\p{L}\p{N}_:.\-·]/u;
const LEER = (c: string | undefined) => c === ' ' || c === '\t' || c === '\n' || c === '\r';
const ENTITAETEN: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function leseXml(text: string): XmlDokument {
  let i = 0;
  const fehler = (meldung: string, stelle = i): never => {
    throw new Abbruch(stelle, meldung);
  };
  const zeile = (stelle: number) => zeileSpalte(text, stelle).zeile;
  const ab = (s: string) => text.startsWith(s, i);
  const leerraum = () => {
    while (LEER(text[i])) i++;
  };
  const name = (was: 'Element' | 'Attribut'): string => {
    const c = text[i];
    if (c === undefined) return fehler('Das Dokument endet zu früh.');
    if (!NAMENSANFANG.test(c)) {
      if (/[0-9.-]/.test(c)) {
        const wort = /^[\p{L}\p{N}_:.-]*/u.exec(text.slice(i))![0];
        return fehler(`${was}namen dürfen nicht mit „${c}“ beginnen („${wort}“) – erlaubt sind Buchstaben und _ am Anfang.`);
      }
      return fehler(`„${c}“ ist kein gültiger Anfang eines ${was}namens.`);
    }
    const start = i;
    while (i < text.length && NAMENSZEICHEN.test(text[i])) i++;
    return text.slice(start, i);
  };
  const kommentar = () => {
    const start = i;
    const ende = text.indexOf('-->', i + 4);
    if (ende < 0) return fehler('Der Kommentar ist nicht geschlossen – das --> fehlt.', start);
    if (text.slice(i + 4, ende).includes('--')) return fehler('In einem Kommentar darf „--“ nicht vorkommen.', start);
    i = ende + 3;
  };
  const anweisung = () => {
    const start = i;
    if (/^<\?xml[\s?]/i.test(text.slice(i, i + 6)))
      return fehler(
        'Die XML-Deklaration <?xml …?> darf nur ganz am Anfang stehen – davor nichts, auch kein Leerzeichen und keine Leerzeile.',
      );
    const ende = text.indexOf('?>', i + 2);
    if (ende < 0) return fehler('Die Verarbeitungsanweisung ist nicht geschlossen – das ?> fehlt.', start);
    i = ende + 2;
  };
  const doctype = () => {
    const start = i;
    let tiefe = 0;
    for (i += 9; i < text.length; i++) {
      if (text[i] === '[') tiefe++;
      else if (text[i] === ']') tiefe--;
      else if (text[i] === '>' && tiefe <= 0) {
        i++;
        return;
      }
    }
    fehler('Die DOCTYPE-Angabe ist nicht geschlossen – das > fehlt.', start);
  };
  /** & … ; → Zeichen; prüft, dass es eine der fünf vordefinierten Entitäten oder ein Zeichenverweis ist. */
  const entitaet = (): string => {
    const m = /^&(#[0-9]+|#x[0-9a-fA-F]+|[\p{L}_][\p{L}\p{N}_.-]*);/u.exec(text.slice(i, i + 40));
    if (!m) return fehler('Ein & muss als &amp; geschrieben werden (z. B. „Müller &amp; Söhne“).');
    const n = m[1];
    let zeichen: string;
    if (n.startsWith('#x')) zeichen = String.fromCodePoint(parseInt(n.slice(2), 16));
    else if (n.startsWith('#')) zeichen = String.fromCodePoint(parseInt(n.slice(1), 10));
    else if (ENTITAETEN[n] !== undefined) zeichen = ENTITAETEN[n];
    else return fehler(`Die Entität „&${n};“ kennt XML ohne DTD nicht – vordefiniert sind nur &amp; &lt; &gt; &quot; &apos;.`);
    i += m[0].length;
    return zeichen;
  };

  let nr = 1;
  const dokument: XmlDokument = { art: 'dokument', kinder: [], nr: 0 };
  /** Offene Elemente (für die Meldung „falsch verschachtelt“). */
  const offen: { name: string; zeile: number }[] = [];

  function element(eltern: XmlElement | XmlDokument): XmlElement {
    const start = i;
    i++; // <
    if (LEER(text[i])) fehler('Nach < darf kein Leerzeichen stehen – der Elementname folgt direkt (<name>).');
    const n = name('Element');
    const el: XmlElement = { art: 'element', name: n, attribute: [], kinder: [], eltern, nr: nr++ };
    // Attribute
    for (let erstes = true; ; erstes = false) {
      const vorher = i;
      leerraum();
      const c = text[i];
      if (c === '>') {
        i++;
        break;
      }
      if (ab('/>')) {
        i += 2;
        return el;
      }
      if (c === undefined) return fehler(`Das Start-Tag <${n}> ist nicht geschlossen – das > fehlt.`, start);
      if (c === '<') return fehler(`Das Start-Tag <${n}> ist nicht geschlossen – vor diesem < fehlt das >.`);
      if (c === '/') return fehler(`Nach / muss direkt > folgen (<${n}/>).`);
      if (i === vorher)
        return fehler(
          NAMENSANFANG.test(c) ? 'Zwischen zwei Attributen fehlt ein Leerzeichen.' : `Unerwartetes Zeichen „${c}“ im Start-Tag <${n}>.`,
        );
      if (c === '"' || c === "'") return fehler('Hier steht ein Wert ohne Attributnamen.');
      if (!NAMENSANFANG.test(c))
        return fehler(`„${c}“ ist hier nicht erlaubt – erwartet ist ein Attribut (name="wert") oder das Ende des Tags (>).`);
      const attrStart = i;
      const an = name('Attribut');
      leerraum();
      if (text[i] !== '=')
        return fehler(
          erstes
            ? `Nach „${an}“ fehlt = mit einem Wert in Anführungszeichen. War „${n} ${an}“ als ein Name gemeint? Element- und Attributnamen dürfen keine Leerzeichen enthalten.`
            : `Nach dem Attributnamen „${an}“ fehlt = mit einem Wert in Anführungszeichen.`,
        );
      i++;
      leerraum();
      const q = text[i];
      if (q !== '"' && q !== "'") return fehler(`Attributwerte stehen in Anführungszeichen: ${an}="…".`);
      const wertStart = i;
      i++;
      let wert = '';
      for (;;) {
        const z = text[i];
        if (z === undefined) return fehler(`Der Wert von „${an}“ ist nicht geschlossen – das schließende ${q} fehlt.`, wertStart);
        if (z === q) {
          i++;
          break;
        }
        if (z === '<') return fehler(`Im Attributwert darf kein < stehen (dafür &lt;) – oder das schließende ${q} von „${an}“ fehlt.`);
        if (z === '&') {
          wert += entitaet();
          continue;
        }
        wert += z === '\n' || z === '\t' || z === '\r' ? ' ' : z;
        i++;
      }
      if (el.attribute.some((a) => a.name === an)) return fehler(`Das Attribut „${an}“ kommt in <${n}> zweimal vor.`, attrStart);
      el.attribute.push({ art: 'attribut', name: an, wert, eltern: el, nr: 0 });
    }
    // Inhalt
    offen.push({ name: n, zeile: zeile(start) });
    let puffer = '';
    const textAbschliessen = () => {
      if (puffer.trim()) el.kinder.push({ art: 'text', text: puffer, eltern: el, nr: 0 });
      puffer = '';
    };
    for (;;) {
      const c = text[i];
      if (c === undefined) return fehler(`<${n}> (Zeile ${zeile(start)}) wird nicht geschlossen – es fehlt </${n}>.`, start);
      if (ab('</')) {
        const endStart = i;
        i += 2;
        if (!NAMENSANFANG.test(text[i] ?? '')) return fehler('Nach </ muss direkt der Name des Elements folgen.');
        const en = name('Element');
        leerraum();
        if (text[i] !== '>')
          return fehler(
            NAMENSANFANG.test(text[i] ?? '')
              ? `End-Tags haben keine Attribute – nur </${en}>.`
              : `Das End-Tag </${en}> ist nicht geschlossen – das > fehlt.`,
          );
        if (en !== n) {
          if (en.toLowerCase() === n.toLowerCase())
            return fehler(
              `Groß-/Kleinschreibung: <${n}> wird mit </${en}> geschlossen. XML unterscheidet Groß- und Kleinbuchstaben.`,
              endStart,
            );
          if (offen.slice(0, -1).some((o) => o.name === en))
            return fehler(
              `Falsch verschachtelt: </${en}> kommt, bevor <${n}> (Zeile ${zeile(start)}) geschlossen ist. Was zuletzt geöffnet wurde, wird zuerst geschlossen.`,
              endStart,
            );
          return fehler(
            `</${en}> passt zu keinem offenen Element – hier wird </${n}> erwartet (geöffnet in Zeile ${zeile(start)}).`,
            endStart,
          );
        }
        i++;
        textAbschliessen();
        offen.pop();
        return el;
      }
      if (ab('<!--')) {
        kommentar();
        continue;
      }
      if (ab('<![CDATA[')) {
        const ende = text.indexOf(']]>', i + 9);
        if (ende < 0) return fehler('Der CDATA-Abschnitt ist nicht geschlossen – das ]]> fehlt.');
        puffer += text.slice(i + 9, ende);
        i = ende + 3;
        continue;
      }
      if (ab('<?')) {
        anweisung();
        continue;
      }
      if (ab('<!')) return fehler('„<!“ ist hier nicht erlaubt.');
      if (c === '<') {
        if (!NAMENSANFANG.test(text[i + 1] ?? '')) {
          if (LEER(text[i + 1]) || /[0-9=]/.test(text[i + 1] ?? '')) return fehler('Ein < im Text muss als &lt; geschrieben werden.');
          i++;
          name('Element'); // wirft mit passender Meldung
        }
        textAbschliessen();
        el.kinder.push(element(el));
        continue;
      }
      if (c === '&') {
        puffer += entitaet();
        continue;
      }
      if (ab(']]>')) return fehler('„]]>“ darf im Text nicht vorkommen.');
      puffer += c;
      i++;
    }
  }

  if (!text.trim()) throw new Abbruch(0, 'Noch nichts geschrieben.');
  if (text.charCodeAt(0) === 0xfeff) i = 1;
  if (/^<\?xml[\s?]/.test(text.slice(i, i + 6))) {
    const ende = text.indexOf('?>', i);
    if (ende < 0) fehler('Die XML-Deklaration ist nicht geschlossen – das ?> fehlt.');
    i = ende + 2;
  }
  // Prolog
  for (;;) {
    leerraum();
    if (i >= text.length) fehler('Das Dokument hat kein Wurzelelement.');
    if (ab('<!--')) kommentar();
    else if (ab('<?')) anweisung();
    else if (ab('<!DOCTYPE')) doctype();
    else if (ab('</')) fehler('Das Dokument beginnt mit einem End-Tag – vorher fehlt das Start-Tag.');
    else if (text[i] === '<') break;
    else fehler('Vor dem Wurzelelement darf kein Text stehen – alle Inhalte gehören in ein Element.');
  }
  dokument.kinder.push(element(dokument));
  // Epilog
  for (;;) {
    leerraum();
    if (i >= text.length) break;
    if (ab('<!--')) kommentar();
    else if (ab('<?')) anweisung();
    else if (ab('</')) {
      const s = i;
      i += 2;
      const en = /^[\p{L}\p{N}_:.-]*/u.exec(text.slice(i))![0];
      fehler(`</${en}> hat kein passendes Start-Tag – das Wurzelelement ist an dieser Stelle schon geschlossen.`, s);
    } else if (text[i] === '<')
      fehler(
        'Ein XML-Dokument hat genau ein Wurzelelement. Hier beginnt ein zweites – fasse alle Elemente in einem gemeinsamen Element zusammen (z. B. <kunden> … </kunden>).',
      );
    else fehler('Nach dem Wurzelelement darf kein Text mehr stehen.');
  }
  nummeriere(dokument);
  return dokument;
}

/** Dokumentreihenfolge: Element, seine Attribute, dann die Kinder. */
function nummeriere(d: XmlDokument) {
  let nr = 1;
  const gehe = (e: XmlElement) => {
    e.nr = nr++;
    for (const a of e.attribute) a.nr = nr++;
    for (const k of e.kinder) {
      if (k.art === 'element') gehe(k);
      else k.nr = nr++;
    }
  };
  d.kinder.forEach(gehe);
}

/** Wohlgeformt? Dann der Baum, sonst die erste fehlerhafte Stelle mit Hinweis. */
export function pruefeXmlSyntax(text: string): XmlSyntax {
  try {
    return { ok: true, dokument: leseXml(text) };
  } catch (e) {
    if (e instanceof Abbruch) return { ok: false, fehler: { meldung: e.message, stelle: e.stelle, ...zeileSpalte(text, e.stelle) } };
    throw e;
  }
}

/** Textwert eines Knotens wie in XPath (Element: aller Text darin). */
export function textwert(k: XmlKnoten): string {
  if (k.art === 'attribut') return k.wert;
  if (k.art === 'text') return k.text;
  return k.kinder.map((c) => (c.art === 'text' ? c.text : textwert(c))).join('');
}

/** Kurze Anzeige eines Knotens: <name>Text</name>, @nr="4711", „Text“. */
export function zeigeKnoten(k: XmlKnoten): string {
  const kurz = (s: string) => {
    const t = s.replace(/\s+/g, ' ').trim();
    return t.length > 60 ? `${t.slice(0, 57)}…` : t;
  };
  if (k.art === 'attribut') return `${k.name}="${k.wert}"`;
  if (k.art === 'text') return `„${kurz(k.text)}“`;
  if (k.art === 'dokument') return '(Dokument)';
  const attr = k.attribute.map((a) => ` ${a.name}="${a.wert}"`).join('');
  const kindElemente = k.kinder.filter((c) => c.art === 'element').length;
  if (!k.kinder.length) return `<${k.name}${attr}/>`;
  return kindElemente ? `<${k.name}${attr}> … </${k.name}>` : `<${k.name}${attr}>${kurz(textwert(k))}</${k.name}>`;
}

// ---------- XPath ----------

type Token =
  | { t: 'zeichen'; v: string; stelle: number }
  | { t: 'name'; v: string; stelle: number }
  | { t: 'zahl'; v: number; stelle: number }
  | { t: 'text'; v: string; stelle: number }
  | { t: 'operator'; v: string; stelle: number };

const ACHSEN = [
  'child',
  'attribute',
  'descendant',
  'descendant-or-self',
  'parent',
  'ancestor',
  'ancestor-or-self',
  'self',
  'following-sibling',
  'preceding-sibling',
] as const;
type Achse = (typeof ACHSEN)[number];
type Knotentest = { art: 'name'; name: string } | { art: 'stern' } | { art: 'text' } | { art: 'knoten' };
interface Schritt {
  achse: Achse;
  test: Knotentest;
  praedikate: Ausdruck[];
}
type Ausdruck =
  | { t: 'zahl'; v: number }
  | { t: 'text'; v: string }
  | { t: 'binaer'; op: string; l: Ausdruck; r: Ausdruck }
  | { t: 'minus'; e: Ausdruck }
  | { t: 'funktion'; name: string; args: Ausdruck[]; stelle: number }
  | { t: 'pfad'; absolut: boolean; start?: Ausdruck; schritte: Schritt[] }
  | { t: 'filter'; e: Ausdruck; praedikate: Ausdruck[] };

const FUNKTIONEN: Record<string, [min: number, max: number]> = {
  last: [0, 0],
  position: [0, 0],
  count: [1, 1],
  sum: [1, 1],
  string: [0, 1],
  number: [0, 1],
  boolean: [1, 1],
  not: [1, 1],
  true: [0, 0],
  false: [0, 0],
  contains: [2, 2],
  'starts-with': [2, 2],
  concat: [2, 99],
  'string-length': [0, 1],
  'normalize-space': [0, 1],
  substring: [2, 3],
  name: [0, 1],
  'local-name': [0, 1],
  round: [1, 1],
  floor: [1, 1],
  ceiling: [1, 1],
};

function zerlege(text: string, fehler: (m: string, s: number) => never): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  /** Steht vorher ein Operand? Dann sind * und and/or/div/mod Operatoren (Regel aus XPath 1.0, 3.7). */
  const nachOperand = () => {
    const v = tokens[tokens.length - 1];
    if (!v) return false;
    if (v.t === 'operator') return false;
    if (v.t === 'zeichen') return v.v === ')' || v.v === ']' || v.v === '.' || v.v === '..';
    return true;
  };
  while (i < text.length) {
    const c = text[i];
    if (LEER(c)) {
      i++;
      continue;
    }
    const s = i;
    const zwei = text.slice(i, i + 2);
    if (zwei === '//' || zwei === '::' || zwei === '..') {
      tokens.push({ t: 'zeichen', v: zwei, stelle: s });
      i += 2;
    } else if (zwei === '!=' || zwei === '<=' || zwei === '>=') {
      tokens.push({ t: 'operator', v: zwei, stelle: s });
      i += 2;
    } else if (zwei === '==') fehler('In XPath vergleicht man mit einem =, nicht mit ==.', s);
    else if (zwei === '&&' || zwei === '||') fehler(`Statt ${zwei} schreibt man in XPath ${zwei === '&&' ? 'and' : 'or'}.`, s);
    else if (c === '.' && /[0-9]/.test(text[i + 1] ?? '')) {
      const m = /^\.[0-9]+/.exec(text.slice(i))!;
      tokens.push({ t: 'zahl', v: Number(m[0]), stelle: s });
      i += m[0].length;
    } else if ('()[]@,/.'.includes(c)) {
      tokens.push({ t: 'zeichen', v: c, stelle: s });
      i++;
    } else if ('|+=<>'.includes(c) || (c === '-' && nachOperand())) {
      tokens.push({ t: 'operator', v: c, stelle: s });
      i++;
    } else if (c === '-') {
      tokens.push({ t: 'operator', v: 'neg', stelle: s });
      i++;
    } else if (c === '*') {
      if (nachOperand()) tokens.push({ t: 'operator', v: '*', stelle: s });
      else tokens.push({ t: 'name', v: '*', stelle: s });
      i++;
    } else if (c === '"' || c === "'" || c === '„' || c === '“') {
      if (c === '„' || c === '“') fehler('Texte stehen in XPath in geraden Anführungszeichen: \'…\' oder "…".', s);
      const ende = text.indexOf(c, i + 1);
      if (ende < 0) fehler(`Der Text ist nicht geschlossen – das schließende ${c} fehlt.`, s);
      tokens.push({ t: 'text', v: text.slice(i + 1, ende), stelle: s });
      i = ende + 1;
    } else if (/[0-9]/.test(c)) {
      const m = /^[0-9]+(\.[0-9]*)?/.exec(text.slice(i))!;
      if (text[i + m[0].length] === ',' && /[0-9]/.test(text[i + m[0].length + 1] ?? ''))
        fehler('Dezimalzahlen schreibt man in XPath mit Punkt (12.5), nicht mit Komma.', s);
      tokens.push({ t: 'zahl', v: Number(m[0]), stelle: s });
      i += m[0].length;
    } else if (NAMENSANFANG.test(c)) {
      const m = /^[\p{L}_][\p{L}\p{N}_.-]*(?::(?!:)[\p{L}_][\p{L}\p{N}_.-]*)?/u.exec(text.slice(i))!;
      let w = m[0];
      // „a-b“ ohne Leerzeichen bleibt ein Name (wie in XPath); ein Punkt am Ende gehört nicht dazu.
      while (w.endsWith('.')) w = w.slice(0, -1);
      if (nachOperand() && (w === 'and' || w === 'or' || w === 'div' || w === 'mod')) tokens.push({ t: 'operator', v: w, stelle: s });
      else tokens.push({ t: 'name', v: w, stelle: s });
      i += w.length;
    } else if (c === '$') fehler('Variablen ($…) kennt die Übung nicht.', s);
    else fehler(`Unerwartetes Zeichen „${c}“.`, s);
  }
  return tokens;
}

export interface XpathFehler {
  meldung: string;
  stelle: number;
}

function leseXpath(text: string): Ausdruck {
  const fehler = (meldung: string, stelle: number): never => {
    throw new Abbruch(stelle, meldung);
  };
  if (!text.trim()) fehler('Noch kein Ausdruck geschrieben.', 0);
  const tokens = zerlege(text, fehler);
  let p = 0;
  const peek = (k = 0) => tokens[p + k];
  const ende = () => text.length;
  const ist = (v: string, k = 0) => {
    const t = peek(k);
    return !!t && (t.t === 'zeichen' || t.t === 'operator') && t.v === v;
  };
  const erwarte = (v: string, meldung: string) => {
    if (!ist(v)) fehler(meldung, peek()?.stelle ?? ende());
    p++;
  };

  const binaer = (naechste: () => Ausdruck, ops: string[]) => (): Ausdruck => {
    let l = naechste();
    while (peek()?.t === 'operator' && ops.includes(peek()!.v as string)) {
      const op = peek()!.v as string;
      p++;
      if (!peek()) fehler(`Nach „${op}“ fehlt etwas.`, ende());
      l = { t: 'binaer', op, l, r: naechste() };
    }
    return l;
  };

  const kannSchrittBeginnen = (t: Token | undefined, k: number): boolean => {
    if (!t) return false;
    if (t.t === 'zeichen') return t.v === '@' || t.v === '.' || t.v === '..';
    if (t.t !== 'name') return false;
    if (t.v === '*') return true;
    if (ist('(', k + 1)) return t.v === 'text' || t.v === 'node';
    return true;
  };

  function schritt(): Schritt {
    const t = peek();
    if (!t) return fehler('Hier fehlt ein Schritt (Elementname, @Attribut, * oder text()).', ende());
    if (ist('.')) {
      p++;
      return { achse: 'self', test: { art: 'knoten' }, praedikate: praedikate() };
    }
    if (ist('..')) {
      p++;
      return { achse: 'parent', test: { art: 'knoten' }, praedikate: praedikate() };
    }
    let achse: Achse = 'child';
    if (ist('@')) {
      p++;
      achse = 'attribute';
      const n = peek();
      if (!n || n.t !== 'name') fehler('Nach @ muss ein Attributname folgen (z. B. @nr).', n?.stelle ?? ende());
    } else if (t.t === 'name' && ist('::', 1)) {
      if (!(ACHSEN as readonly string[]).includes(t.v)) fehler(`Die Achse „${t.v}::“ kennt die Übung nicht.`, t.stelle);
      achse = t.v as Achse;
      p += 2;
    }
    const n = peek();
    if (!n || n.t !== 'name') return fehler('Hier fehlt ein Elementname, * oder text().', n?.stelle ?? ende());
    p++;
    let test: Knotentest;
    if (n.v === '*') test = { art: 'stern' };
    else if (ist('(') && (n.v === 'text' || n.v === 'node')) {
      p++;
      erwarte(')', `Nach ${n.v}( fehlt die schließende Klammer.`);
      test = { art: n.v === 'text' ? 'text' : 'knoten' };
    } else if (ist('(')) return fehler(`„${n.v}()“ kann hier nicht stehen – an dieser Stelle steht ein Name, * oder text().`, n.stelle);
    else test = { art: 'name', name: n.v };
    return { achse, test, praedikate: praedikate() };
  }

  function praedikate(): Ausdruck[] {
    const aus: Ausdruck[] = [];
    while (ist('[')) {
      const s = peek()!.stelle;
      p++;
      if (ist(']')) fehler('Die eckigen Klammern sind leer – darin steht eine Bedingung oder eine Position.', s);
      aus.push(oder());
      if (!ist(']')) fehler('Hier fehlt die schließende eckige Klammer ].', peek()?.stelle ?? ende());
      p++;
    }
    return aus;
  }

  const ALLE: Schritt = { achse: 'descendant-or-self', test: { art: 'knoten' }, praedikate: [] };

  function relativ(schritte: Schritt[]): Schritt[] {
    schritte.push(schritt());
    while (ist('/') || ist('//')) {
      if (ist('//')) schritte.push(ALLE);
      p++;
      schritte.push(schritt());
    }
    return schritte;
  }

  function pfad(): Ausdruck {
    if (ist('/')) {
      p++;
      return { t: 'pfad', absolut: true, schritte: kannSchrittBeginnen(peek(), 0) ? relativ([]) : [] };
    }
    if (ist('//')) {
      p++;
      return { t: 'pfad', absolut: true, schritte: relativ([ALLE]) };
    }
    if (kannSchrittBeginnen(peek(), 0)) return { t: 'pfad', absolut: false, schritte: relativ([]) };
    // Filterausdruck: Primärausdruck mit Prädikaten, danach evtl. weiterer Pfad
    let e = primaer();
    const pr = praedikate();
    if (pr.length) e = { t: 'filter', e, praedikate: pr };
    if (ist('/') || ist('//')) {
      const schritte: Schritt[] = [];
      if (ist('//')) schritte.push(ALLE);
      p++;
      return { t: 'pfad', absolut: false, start: e, schritte: relativ(schritte) };
    }
    return e;
  }

  function primaer(): Ausdruck {
    const t = peek();
    if (!t) return fehler('Der Ausdruck endet zu früh.', ende());
    if (ist('(')) {
      p++;
      const e = oder();
      erwarte(')', 'Hier fehlt die schließende Klammer ).');
      return e;
    }
    if (t.t === 'zahl') {
      p++;
      return { t: 'zahl', v: t.v };
    }
    if (t.t === 'text') {
      p++;
      return { t: 'text', v: t.v };
    }
    if (t.t === 'name' && ist('(', 1)) {
      const f = FUNKTIONEN[t.v];
      if (!f)
        fehler(
          `Die Funktion „${t.v}()“ kennt die Übung nicht. Bekannt sind u. a. count(), sum(), contains(), starts-with(), last(), position(), not().`,
          t.stelle,
        );
      p += 2;
      const args: Ausdruck[] = [];
      if (!ist(')')) {
        args.push(oder());
        while (ist(',')) {
          p++;
          args.push(oder());
        }
      }
      erwarte(')', `Bei ${t.v}( fehlt die schließende Klammer ).`);
      if (args.length < f[0] || args.length > f[1])
        fehler(
          `${t.v}() erwartet ${f[0] === f[1] ? f[0] : `${f[0]} bis ${f[1]}`} ${f[1] === 1 ? 'Argument' : 'Argumente'}, hier ${args.length === 1 ? 'steht eins' : `stehen ${args.length}`}.`,
          t.stelle,
        );
      return { t: 'funktion', name: t.v, args, stelle: t.stelle };
    }
    if (t.t === 'zeichen' && t.v === ']') return fehler('Hier steht eine ] ohne öffnende [.', t.stelle);
    if (t.t === 'zeichen' && t.v === ')') return fehler('Hier steht eine ) ohne öffnende (.', t.stelle);
    return fehler(`„${t.v}“ kann hier nicht stehen.`, t.stelle);
  }

  const vereinigung = binaer(pfad, ['|']);
  const unaer = (): Ausdruck => {
    if (ist('neg')) {
      p++;
      return { t: 'minus', e: unaer() };
    }
    return vereinigung();
  };
  const mal = binaer(unaer, ['*', 'div', 'mod']);
  const plus = binaer(mal, ['+', '-']);
  const relation = binaer(plus, ['<', '>', '<=', '>=']);
  const gleich = binaer(relation, ['=', '!=']);
  const und = binaer(gleich, ['and']);
  const oder = binaer(und, ['or']);

  const e = oder();
  if (p < tokens.length) {
    const t = tokens[p];
    if (t.t === 'zeichen' && t.v === ']') fehler('Hier steht eine ] ohne öffnende [.', t.stelle);
    if (t.t === 'zeichen' && t.v === ')') fehler('Hier steht eine ) ohne öffnende (.', t.stelle);
    fehler(`Nach dem Ausdruck steht noch „${text.slice(t.stelle).trim().slice(0, 20)}“ – fehlt ein / oder ein Operator?`, t.stelle);
  }
  return e;
}

export type XpathWert = number | string | boolean | XmlKnoten[];
export type XpathErgebnis = { ok: true; wert: XpathWert } | { ok: false; fehler: XpathFehler };

interface Kontext {
  knoten: XmlKnoten;
  position: number;
  groesse: number;
}

const istMenge = (w: XpathWert): w is XmlKnoten[] => Array.isArray(w);

export function alsZahl(w: XpathWert): number {
  if (istMenge(w)) return w.length ? alsZahl(textwert(w[0])) : NaN;
  if (typeof w === 'number') return w;
  if (typeof w === 'boolean') return w ? 1 : 0;
  const t = w.trim();
  return /^-?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/.test(t) ? Number(t) : NaN;
}

export function alsText(w: XpathWert): string {
  if (istMenge(w)) return w.length ? textwert(w[0]) : '';
  if (typeof w === 'boolean') return w ? 'true' : 'false';
  if (typeof w === 'number') {
    if (Number.isNaN(w)) return 'NaN';
    if (Number.isInteger(w)) return String(w);
    return String(Math.round(w * 1e10) / 1e10);
  }
  return w;
}

const alsWahrheit = (w: XpathWert): boolean =>
  istMenge(w) ? w.length > 0 : typeof w === 'number' ? w !== 0 && !Number.isNaN(w) : typeof w === 'string' ? w.length > 0 : w;

function vergleicheEinfach(a: XpathWert, op: string, b: XpathWert): boolean {
  if (op === '=' || op === '!=') {
    let gleich: boolean;
    if (typeof a === 'boolean' || typeof b === 'boolean') gleich = alsWahrheit(a) === alsWahrheit(b);
    else if (typeof a === 'number' || typeof b === 'number') gleich = alsZahl(a) === alsZahl(b);
    else gleich = alsText(a) === alsText(b);
    return op === '=' ? gleich : !gleich;
  }
  const x = alsZahl(a);
  const y = alsZahl(b);
  return op === '<' ? x < y : op === '>' ? x > y : op === '<=' ? x <= y : x >= y;
}

function vergleiche(a: XpathWert, op: string, b: XpathWert): boolean {
  if (istMenge(a) && istMenge(b)) return a.some((x) => b.some((y) => vergleicheEinfach(textwert(x), op, textwert(y))));
  if (istMenge(a)) {
    if (typeof b === 'boolean') return vergleicheEinfach(alsWahrheit(a), op, b);
    return a.some((x) => vergleicheEinfach(typeof b === 'number' ? alsZahl(textwert(x)) : textwert(x), op, b));
  }
  if (istMenge(b)) {
    if (typeof a === 'boolean') return vergleicheEinfach(a, op, alsWahrheit(b));
    return b.some((y) => vergleicheEinfach(a, op, typeof a === 'number' ? alsZahl(textwert(y)) : textwert(y)));
  }
  return vergleicheEinfach(a, op, b);
}

const sortiere = (k: XmlKnoten[]): XmlKnoten[] => [...new Set(k)].sort((a, b) => a.nr - b.nr);

function kinderVon(k: XmlKnoten): XmlKnoten[] {
  return k.art === 'dokument' || k.art === 'element' ? k.kinder : [];
}
function nachfahren(k: XmlKnoten, aus: XmlKnoten[] = []): XmlKnoten[] {
  for (const c of kinderVon(k)) {
    aus.push(c);
    nachfahren(c, aus);
  }
  return aus;
}
const elternVon = (k: XmlKnoten): XmlKnoten | undefined => (k.art === 'dokument' ? undefined : k.eltern);

/** Knoten entlang der Achse – bei Rückwärtsachsen in umgekehrter Dokumentreihenfolge (wichtig für Positionen). */
function achse(k: XmlKnoten, a: Achse): XmlKnoten[] {
  switch (a) {
    case 'child':
      return kinderVon(k);
    case 'attribute':
      return k.art === 'element' ? k.attribute : [];
    case 'descendant':
      return nachfahren(k);
    case 'descendant-or-self':
      return [k, ...nachfahren(k)];
    case 'self':
      return [k];
    case 'parent': {
      const e = elternVon(k);
      return e ? [e] : [];
    }
    case 'ancestor':
    case 'ancestor-or-self': {
      const aus: XmlKnoten[] = a === 'ancestor-or-self' ? [k] : [];
      for (let e = elternVon(k); e; e = elternVon(e)) aus.push(e);
      return aus;
    }
    case 'following-sibling':
    case 'preceding-sibling': {
      if (k.art === 'attribut' || k.art === 'dokument') return [];
      const geschwister = kinderVon(k.eltern);
      const i = geschwister.indexOf(k);
      return a === 'following-sibling' ? geschwister.slice(i + 1) : geschwister.slice(0, i).reverse();
    }
  }
}

function passt(k: XmlKnoten, test: Knotentest, a: Achse): boolean {
  const haupt = a === 'attribute' ? 'attribut' : 'element';
  switch (test.art) {
    case 'knoten':
      return true;
    case 'text':
      return k.art === 'text';
    case 'stern':
      return k.art === haupt;
    case 'name':
      return k.art === haupt && k.name === test.name;
  }
}

function filtere(knoten: XmlKnoten[], praedikate: Ausdruck[]): XmlKnoten[] {
  let liste = knoten;
  for (const pr of praedikate) {
    const groesse = liste.length;
    liste = liste.filter((k, i) => {
      const w = werte(pr, { knoten: k, position: i + 1, groesse });
      return typeof w === 'number' ? w === i + 1 : alsWahrheit(w);
    });
  }
  return liste;
}

function wurzel(k: XmlKnoten): XmlKnoten {
  let w = k;
  for (let e = elternVon(w); e; e = elternVon(e)) w = e;
  return w;
}

function werte(e: Ausdruck, ctx: Kontext): XpathWert {
  switch (e.t) {
    case 'zahl':
    case 'text':
      return e.v;
    case 'minus':
      return -alsZahl(werte(e.e, ctx));
    case 'filter': {
      const w = werte(e.e, ctx);
      if (!istMenge(w)) throw new Abbruch(0, 'Eckige Klammern stehen nur hinter Knoten, nicht hinter einer Zahl oder einem Text.');
      return filtere(sortiere(w), e.praedikate);
    }
    case 'pfad': {
      let menge: XmlKnoten[];
      if (e.start) {
        const w = werte(e.start, ctx);
        if (!istMenge(w)) throw new Abbruch(0, 'Ein / folgt nur auf Knoten, nicht auf eine Zahl oder einen Text.');
        menge = w;
      } else menge = [e.absolut ? wurzel(ctx.knoten) : ctx.knoten];
      for (const s of e.schritte) {
        const neu: XmlKnoten[] = [];
        for (const k of menge)
          neu.push(
            ...filtere(
              achse(k, s.achse).filter((x) => passt(x, s.test, s.achse)),
              s.praedikate,
            ),
          );
        menge = sortiere(neu);
      }
      return menge;
    }
    case 'binaer': {
      if (e.op === 'or') return alsWahrheit(werte(e.l, ctx)) || alsWahrheit(werte(e.r, ctx));
      if (e.op === 'and') return alsWahrheit(werte(e.l, ctx)) && alsWahrheit(werte(e.r, ctx));
      const l = werte(e.l, ctx);
      const r = werte(e.r, ctx);
      if (e.op === '|') {
        if (!istMenge(l) || !istMenge(r)) throw new Abbruch(0, '| verbindet nur Knotenmengen (Pfade).');
        return sortiere([...l, ...r]);
      }
      if (['=', '!=', '<', '>', '<=', '>='].includes(e.op)) return vergleiche(l, e.op, r);
      const x = alsZahl(l);
      const y = alsZahl(r);
      return e.op === '+' ? x + y : e.op === '-' ? x - y : e.op === '*' ? x * y : e.op === 'div' ? x / y : x % y;
    }
    case 'funktion': {
      const a = e.args.map((x) => werte(x, ctx));
      const menge = (i: number, f: string): XmlKnoten[] => {
        if (!istMenge(a[i])) throw new Abbruch(e.stelle, `${f}() braucht Knoten als Argument (einen Pfad), keinen einzelnen Wert.`);
        return a[i];
      };
      const textArg = (i: number) => (a.length > i ? alsText(a[i]) : textwert(ctx.knoten));
      switch (e.name) {
        case 'last':
          return ctx.groesse;
        case 'position':
          return ctx.position;
        case 'count':
          return menge(0, 'count').length;
        case 'sum':
          return menge(0, 'sum').reduce((s, k) => s + alsZahl(textwert(k)), 0);
        case 'string':
          return textArg(0);
        case 'number':
          return a.length ? alsZahl(a[0]) : alsZahl(textwert(ctx.knoten));
        case 'boolean':
          return alsWahrheit(a[0]);
        case 'not':
          return !alsWahrheit(a[0]);
        case 'true':
          return true;
        case 'false':
          return false;
        case 'contains':
          return alsText(a[0]).includes(alsText(a[1]));
        case 'starts-with':
          return alsText(a[0]).startsWith(alsText(a[1]));
        case 'concat':
          return a.map(alsText).join('');
        case 'string-length':
          return [...textArg(0)].length;
        case 'normalize-space':
          return textArg(0).replace(/\s+/g, ' ').trim();
        case 'substring': {
          const s = [...alsText(a[0])];
          const von = Math.round(alsZahl(a[1]));
          const bis = a.length > 2 ? von + Math.round(alsZahl(a[2])) : Infinity;
          return s.filter((_, i) => i + 1 >= von && i + 1 < bis).join('');
        }
        case 'name':
        case 'local-name': {
          const k = a.length ? menge(0, e.name)[0] : ctx.knoten;
          return k && (k.art === 'element' || k.art === 'attribut') ? k.name : '';
        }
        case 'round':
          return Math.round(alsZahl(a[0]));
        case 'floor':
          return Math.floor(alsZahl(a[0]));
        case 'ceiling':
          return Math.ceil(alsZahl(a[0]));
      }
      throw new Abbruch(e.stelle, `Unbekannte Funktion ${e.name}().`);
    }
  }
}

/** Liest den Ausdruck (ohne ihn auszuwerten) – für die laufende Anzeige beim Tippen. */
export function pruefeXpathSyntax(ausdruck: string): { ok: true } | { ok: false; fehler: XpathFehler } {
  try {
    leseXpath(ausdruck);
    return { ok: true };
  } catch (e) {
    if (e instanceof Abbruch) return { ok: false, fehler: { meldung: e.message, stelle: e.stelle } };
    throw e;
  }
}

/** Wertet einen XPath-Ausdruck auf dem Dokument aus (Kontext: der Dokumentknoten). */
export function werteXpath(dokument: XmlDokument, ausdruck: string): XpathErgebnis {
  try {
    const e = leseXpath(ausdruck);
    return { ok: true, wert: werte(e, { knoten: dokument, position: 1, groesse: 1 }) };
  } catch (e) {
    if (e instanceof Abbruch) return { ok: false, fehler: { meldung: e.message, stelle: e.stelle } };
    throw e;
  }
}

/** Ergebnis als Liste lesbarer Werte – zum Vergleichen (Textwerte) und Anzeigen. */
export function ergebnisListe(w: XpathWert): { anzeige: string; wert: string }[] {
  if (istMenge(w)) return w.map((k) => ({ anzeige: zeigeKnoten(k), wert: textwert(k).replace(/\s+/g, ' ').trim() }));
  return [{ anzeige: alsText(w), wert: alsText(w) }];
}

export { istMenge as istKnotenmenge };
