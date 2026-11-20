import type { ReactNode } from 'react';
import type { DiagrammKnoten, Form } from '../../../domain/diagrammUebungen';

/** Zeilen für SVG-Text: Wörter umbrechen, damit sie in `breite` Pixel passen (grob 6,6 px je Zeichen bei 12 px Schrift). */
export function umbrechen(text: string, breite: number, zeichenBreite = 6.6): string[] {
  const max = Math.max(4, Math.floor(breite / zeichenBreite));
  const zeilen: string[] = [];
  let zeile = '';
  for (const wort of text.split(/\s+/)) {
    if (!zeile) zeile = wort;
    else if ((zeile + ' ' + wort).length <= max) zeile += ' ' + wort;
    else {
      zeilen.push(zeile);
      zeile = wort;
    }
  }
  if (zeile) zeilen.push(zeile);
  return zeilen;
}

export function Text({ x, y, w, text, klasse }: { x: number; y: number; w: number; text: string; klasse?: string }) {
  const zeilen = umbrechen(text, w);
  const hoehe = 14;
  const start = y - ((zeilen.length - 1) * hoehe) / 2;
  return (
    <text x={x} y={start} textAnchor="middle" dominantBaseline="middle" className={klasse ?? 'dg-klein'}>
      {zeilen.map((z, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : hoehe}>
          {z}
        </tspan>
      ))}
    </text>
  );
}

/** Beschriftung eines Ereignisses: unten (Standard) oder – wenn `lage` es verlangt – darüber bzw. daneben. */
function EreignisText({ k, text }: { k: DiagrammKnoten; text: string }) {
  const breite = Math.max(k.w, 110);
  const zeilen = umbrechen(text, breite).length;
  const cx = k.x + k.w / 2;
  const cy = k.y + k.h / 2;
  if (k.lage === 'links' || k.lage === 'rechts') {
    // Neben dem Kreis, knapp unterhalb der Mittellinie: so bleibt der Rand eines Tasks, auf dem ein Grenzereignis sitzt, frei.
    const seite = k.lage === 'links' ? -1 : 1;
    const b = 110;
    const z = umbrechen(text, b).length;
    return <Text x={cx + seite * (k.w / 2 + 6 + b / 2)} y={cy + 4 + z * 7} w={b} text={text} />;
  }
  if (k.lage === 'oben') return <Text x={cx} y={k.y - 12 - (zeilen - 1) * 7} w={breite} text={text} />;
  return <Text x={cx} y={k.y + k.h + 12 + (zeilen - 1) * 7} w={breite} text={text} />;
}

/** Eine Form im Rechteck (x, y, w, h). */
export function FormZeichnung({ form, k, text }: { form: Form; k: DiagrammKnoten; text?: string }): ReactNode {
  const { x, y, w, h } = k;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.min(w, h) / 2;
  const beschriftung = text ? <Text x={cx} y={cy} w={w - 12} text={text} /> : null;
  switch (form) {
    case 'ereignis':
      return (
        <>
          <polygon
            points={`${x + 14},${y} ${x + w - 14},${y} ${x + w},${cy} ${x + w - 14},${y + h} ${x + 14},${y + h} ${x},${cy}`}
            className="dg-rot"
          />
          {text && <Text x={cx} y={cy} w={w - 28} text={text} />}
        </>
      );
    case 'funktion':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} rx={10} className="dg-gut" />
          {beschriftung}
        </>
      );
    case 'xor':
    case 'and':
    case 'or':
      return (
        <>
          <circle cx={cx} cy={cy} r={r} className="dg-form" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
            {form === 'xor' ? 'XOR' : form === 'and' ? '∧' : '∨'}
          </text>
        </>
      );
    case 'org':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} className="dg-mittel" />
          <line x1={x + w * 0.1} y1={cy - h * 0.3} x2={x + w * 0.1} y2={cy + h * 0.3} className="dg-linie dg-duenn" />
          {text && <Text x={cx + 4} y={cy} w={w - 30} text={text} />}
        </>
      );
    case 'info':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-akzent" />
          {beschriftung}
        </>
      );
    case 'start':
    case 'zwischen':
    case 'ende':
      return (
        <>
          <circle cx={cx} cy={cy} r={r} className={form === 'ende' ? 'dg-form dg-dick' : 'dg-form'} />
          {form === 'zwischen' && <circle cx={cx} cy={cy} r={r - 4} className="dg-linie" />}
          {text && <EreignisText k={k} text={text} />}
        </>
      );
    case 'task':
    case 'aktion':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} rx={form === 'aktion' ? 16 : 10} className="dg-form" />
          {beschriftung}
        </>
      );
    case 'zustand':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} rx={14} className="dg-form" />
          {beschriftung}
        </>
      );
    case 'gw-xor':
    case 'gw-and':
    case 'gw-or':
    case 'entscheidung': {
      const d = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
      const m = Math.min(w, h) * 0.18;
      return (
        <>
          <polygon points={d} className="dg-form" />
          {form === 'gw-xor' && (
            <>
              <line x1={cx - m} y1={cy - m} x2={cx + m} y2={cy + m} className="dg-linie" />
              <line x1={cx + m} y1={cy - m} x2={cx - m} y2={cy + m} className="dg-linie" />
            </>
          )}
          {form === 'gw-and' && (
            <>
              <line x1={cx} y1={cy - m * 1.3} x2={cx} y2={cy + m * 1.3} className="dg-linie" />
              <line x1={cx - m * 1.3} y1={cy} x2={cx + m * 1.3} y2={cy} className="dg-linie" />
            </>
          )}
          {form === 'gw-or' && <circle cx={cx} cy={cy} r={m * 1.1} className="dg-linie" />}
          {/* Nur das XOR-Gateway trägt seine Frage; AND/OR und die UML-Raute bleiben ohne Text (die Form sagt alles). */}
          {text && form === 'gw-xor' && <Text x={cx} y={y - 10} w={Math.max(w, 120)} text={text} />}
        </>
      );
    }
    case 'aufruf': {
      // Aufrufaktion: Aktion mit dem Gabelsymbol (Harke) rechts unten – ruft eine eigene Aktivität auf.
      const hx = x + w - 16;
      const hy = y + h - 17;
      return (
        <>
          <rect x={x} y={y} width={w} height={h} rx={16} className="dg-form" />
          <path d={`M${hx},${hy} v6 M${hx - 6},${hy + 12} v-6 h12 v6 M${hx},${hy + 6} v6`} className="dg-linie" />
          {text && <Text x={cx} y={cy} w={w - 48} text={text} />}
        </>
      );
    }
    case 'gabel':
      return <rect x={x} y={y} width={w} height={h} className="dg-voll" />;
    case 'startpunkt':
      return <circle cx={cx} cy={cy} r={r} className="dg-voll" />;
    case 'endpunkt':
      return (
        <>
          <circle cx={cx} cy={cy} r={r} className="dg-form" />
          <circle cx={cx} cy={cy} r={r * 0.55} className="dg-voll" />
        </>
      );
    case 'ablaufende': {
      const d = r * 0.7;
      return (
        <>
          <circle cx={cx} cy={cy} r={r} className="dg-form" />
          <path d={`M${cx - d},${cy - d} L${cx + d},${cy + d} M${cx + d},${cy - d} L${cx - d},${cy + d}`} className="dg-linie" />
        </>
      );
    }
    case 'schwimmbahn': {
      // Senkrechte Bahn mit dem Namen im Kopf – die Aktionen darunter gehören zu dieser Rolle.
      const kopf = Math.min(32, h / 3);
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-linie" />
          <line x1={x} y1={y + kopf} x2={x + w} y2={y + kopf} className="dg-linie" />
          {text && (
            <text x={cx} y={y + kopf / 2} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
              {text}
            </text>
          )}
        </>
      );
    }
    case 'pool':
    case 'lane':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className={form === 'pool' ? 'dg-form' : 'dg-linie'} />
          <line x1={x + 26} y1={y} x2={x + 26} y2={y + h} className="dg-linie" />
          {text && (
            <text
              x={x + 13}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              className="dg-klein"
              transform={`rotate(-90 ${x + 13} ${cy})`}
            >
              {text}
            </text>
          )}
        </>
      );
    case 'lebenslinie':
      return (
        <>
          <rect x={x} y={y} width={w} height={36} className="dg-form" />
          <line x1={cx} y1={y + 36} x2={cx} y2={y + h} className="dg-linie dg-strich" />
          {text && <Text x={cx} y={y + 18} w={w - 10} text={text} />}
        </>
      );
    case 'fragment': {
      // Reiter links oben so breit wie der Text; „alt“ teilt das Fragment mit einer gestrichelten Linie in zwei Bereiche.
      const reiter = Math.min(w, (text?.length ?? 4) * 6.4 + 22);
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-linie" />
          <polygon
            points={`${x},${y} ${x + reiter},${y} ${x + reiter},${y + 14} ${x + reiter - 10},${y + 24} ${x},${y + 24}`}
            className="dg-grau"
          />
          {text?.startsWith('alt') && <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} className="dg-linie dg-strich" />}
          {text && (
            <text x={x + 6} y={y + 12} dominantBaseline="middle" className="dg-klein dg-fett">
              {text}
            </text>
          )}
        </>
      );
    }
    case 'entitaet':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-form" />
          {beschriftung}
        </>
      );
    case 'beziehung':
      return (
        <>
          <polygon points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} className="dg-akzent" />
          {text && <Text x={cx} y={cy} w={w * 0.6} text={text} />}
        </>
      );
    case 'attribut':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} className="dg-form" />
          {text && <Text x={cx} y={cy} w={w - 16} text={text} />}
        </>
      );
    case 'anwendungsfall':
      return (
        <>
          <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} className="dg-akzent" />
          {text && <Text x={cx} y={cy} w={w - 24} text={text} />}
        </>
      );
    case 'klasse': {
      // Text: „Name“ oder „Name|Attribute|Methoden“ (Abschnitte mit „;“ getrennt) – drei Fächer wie in UML.
      const [name, attrs, meth] = (text ?? '').split('|');
      const kopf = 26;
      const zeilen = (t?: string) => (t ? t.split(';').map((z) => z.trim()) : []);
      const a = zeilen(attrs);
      const m = zeilen(meth);
      const hatFaecher = attrs !== undefined;
      const hoeheA = hatFaecher ? Math.max(20, a.length * 15 + 8) : 0;
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-form" />
          <text x={cx} y={y + kopf / 2} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
            {name}
          </text>
          {hatFaecher && (
            <>
              <line x1={x} y1={y + kopf} x2={x + w} y2={y + kopf} className="dg-linie" />
              <line x1={x} y1={y + kopf + hoeheA} x2={x + w} y2={y + kopf + hoeheA} className="dg-linie" />
              {a.map((z, i) => (
                <text key={`a${i}`} x={x + 8} y={y + kopf + 14 + i * 15} className="dg-klein">
                  {z}
                </text>
              ))}
              {m.map((z, i) => (
                <text key={`m${i}`} x={x + 8} y={y + kopf + hoeheA + 14 + i * 15} className="dg-klein">
                  {z}
                </text>
              ))}
            </>
          )}
        </>
      );
    }
    case 'systemgrenze':
      return (
        <>
          <rect x={x} y={y} width={w} height={h} className="dg-linie" />
          {text && (
            <text x={cx} y={y + 14} textAnchor="middle" dominantBaseline="middle" className="dg-klein dg-fett">
              {text}
            </text>
          )}
        </>
      );
    case 'text':
      return text ? <Text x={cx} y={cy} w={w} text={text} /> : null;
    case 'akteur':
      return (
        <>
          <circle cx={cx} cy={y + 9} r={8} className="dg-form" />
          <line x1={cx} y1={y + 17} x2={cx} y2={y + 38} className="dg-linie" />
          <line x1={cx - 12} y1={y + 26} x2={cx + 12} y2={y + 26} className="dg-linie" />
          <line x1={cx} y1={y + 38} x2={cx - 10} y2={y + 54} className="dg-linie" />
          <line x1={cx} y1={y + 38} x2={cx + 10} y2={y + 54} className="dg-linie" />
          {text && <Text x={cx} y={y + 66} w={Math.max(w, 90)} text={text} />}
        </>
      );
    case 'notiz':
      return (
        <>
          <polygon points={`${x},${y} ${x + w - 12},${y} ${x + w},${y + 12} ${x + w},${y + h} ${x},${y + h}`} className="dg-grau" />
          {beschriftung}
        </>
      );
  }
}
