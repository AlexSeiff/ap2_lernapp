import { Icon } from '../Icon';

/** Hinweise der Formprüfung (oder: alles in Ordnung). */
export function Formhinweise({ meldungen }: { meldungen: string[] }) {
  if (!meldungen.length)
    return <p className="ok small">Keine Formfehler gefunden. Ob Inhalt und Beschriftungen stimmen, zeigt dir die Musterlösung.</p>;
  return (
    <ul className="diagramm-regeln">
      {meldungen.map((m) => (
        <li key={m}>
          <Icon name="triangle-alert" /> {m}
        </li>
      ))}
    </ul>
  );
}
