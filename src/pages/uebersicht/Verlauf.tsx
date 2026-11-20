/** Mini-Verlauf der Klausurergebnisse (0–100 %) als Inline-SVG; die gestrichelte Linie markiert 50 % (bestanden). */
export function Sparkline({ values }: { values: number[] }) {
  const w = 110;
  const h = 26;
  const pad = 3;
  const x = (i: number) => (values.length === 1 ? w / 2 : pad + (i * (w - 2 * pad)) / (values.length - 1));
  const y = (v: number) => pad + ((100 - Math.max(0, Math.min(100, v))) * (h - 2 * pad)) / 100;
  const label = `Klausurergebnisse: ${values.map((v) => `${Math.round(v)} %`).join(', ')}`;
  return (
    <svg className="sparkline" width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
      <title>{label}</title>
      <line className="sparkline-pass" x1={0} x2={w} y1={y(50)} y2={y(50)} />
      {values.length > 1 && <polyline points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />}
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 3 : 2} />
      ))}
    </svg>
  );
}

export function Delta({ value }: { value?: number }) {
  if (value === undefined) return <span className="muted small">erst ab 2 Klausuren</span>;
  const rounded = Math.round(value);
  if (rounded === 0) return <span className="muted">± 0</span>;
  return (
    <span className={rounded > 0 ? 'ok' : 'bad'}>
      {rounded > 0 ? '▲ +' : '▼ −'}
      {Math.abs(rounded)} %-Pkt.
    </span>
  );
}
