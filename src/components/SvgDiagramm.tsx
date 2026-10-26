import type { CSSProperties } from 'react';

/**
 * Handgezeichnetes Diagramm aus einem ```svg-Block oder einer Karte (vorher mit pruefeSvg geprüft).
 * Die Breite aus dem width-Attribut geht als --dg-breite ans CSS: Auf schmalen Bildschirmen wird das Diagramm höchstens
 * auf 85 % verkleinert und ist dann seitlich scrollbar – sonst wäre die Schrift großer Diagramme (EPK, BPMN) unleserlich klein.
 */
export function SvgDiagramm({ svg }: { svg: string }) {
  const breite = Number(svg.match(/^\s*<svg\b[^>]*?\swidth="(\d+(?:\.\d+)?)"/)?.[1]);
  const style = breite ? ({ '--dg-breite': breite } as CSSProperties) : undefined;
  return <figure className="diagramm" style={style} dangerouslySetInnerHTML={{ __html: svg.trim() }} />;
}
