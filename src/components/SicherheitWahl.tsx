import type { Sicherheit } from '../../domain/progress';
import { SICHERHEIT_STUFEN } from '../lib/kalibrierung';

/** „Wie sicher bist du?“ (1–3) vor dem Abgeben (ROADMAP 8.3). Freiwillig; ein zweiter Klick auf die gewählte Stufe hebt sie auf. */
export function SicherheitWahl({
  value,
  onChange,
  disabled,
}: {
  value: Sicherheit | undefined;
  onChange: (s: Sicherheit | undefined) => void;
  disabled?: boolean;
}) {
  return (
    <div className="sicherheit" role="group" aria-label="Wie sicher bist du?">
      <span className="sicherheit-frage">Wie sicher bist du?</span>
      {SICHERHEIT_STUFEN.map((s) => (
        <button
          key={s.wert}
          type="button"
          className="secondary"
          aria-pressed={value === s.wert}
          disabled={disabled}
          onClick={() => onChange(value === s.wert ? undefined : s.wert)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
