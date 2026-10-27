// Benötigte Formeln direkt unter der Rechenübung: die Formeln der Formelsammlung (src/rechnen/formeln.ts), die zur Vorlage der
// Übung gehören – allgemein, ohne Zahlen und ohne Rechenschritte, damit sie nichts vom Lösungsweg verraten.
// Zieht KaTeX nach (Tex): nur lazy laden.

import { formelnDerVorlage } from '../rechnen/formeln';
import { Icon } from './Icon';
import { Tex } from './Rechenweg';

export function AufgabenFormeln({ vorlage }: { vorlage: string }) {
  const formeln = formelnDerVorlage(vorlage);
  if (!formeln.length) return null;
  const titel = formeln.length === 1 ? 'Benötigte Formel' : 'Benötigte Formeln';
  return (
    <section className="aufgaben-formeln" aria-label={titel}>
      <p className="small muted">
        <Icon name="sigma" /> {titel}
      </p>
      <ul>
        {formeln.map((f) => (
          <li key={f.id}>
            <span className="small">{f.name}</span>
            <Tex tex={f.latex} />
          </li>
        ))}
      </ul>
    </section>
  );
}
