// Suchindex einmal je Sitzung (Umsetzungsplan Phase 10): je vollem Inhalt, Begriffsseiten und Einstellung gebaut und gemerkt.
// Der Suchdialog nimmt ihn von hier; bereiteSucheVor() baut ihn im Leerlauf vorab, damit die Suche beim Öffnen sofort antwortet.

import type { Settings } from '../../domain/progress';
import type { KernInhalt } from '../../domain/texte';
import type { BegriffsSeite, Content } from '../../domain/types';
import { ladeBegriffe, seitenFinder } from './begriffe';
import { glossarSuchEintraege, glossarVon } from './glossar';
import { baueSuchIndex, begriffSuchEintraege, type SuchEintrag } from './suche';
import { ladeAlleTexte } from './texte';

type SuchEinstellungen = Pick<Settings, 'prueferfragen' | 'fachgespraech'>;

const cache = new WeakMap<Content, Map<string, SuchEintrag[]>>();

/** Index über Begriffsseiten, Glossar-Einträge ohne Seite und den übrigen Inhalt – gemerkt je Inhalt, Seiten und Einstellung. */
export function suchIndex(inhalt: Content, seiten: BegriffsSeite[], settings: SuchEinstellungen): SuchEintrag[] {
  const schluessel = `${settings.prueferfragen}|${settings.fachgespraech}|${seiten.length}`;
  let jeEinstellung = cache.get(inhalt);
  if (!jeEinstellung) cache.set(inhalt, (jeEinstellung = new Map()));
  let index = jeEinstellung.get(schluessel);
  if (!index) {
    // Glossar-Einträge, die eine Begriffsseite haben (auch über eine andere Schreibweise), stehen als Seite im Index.
    const seiteZu = seitenFinder(seiten);
    const glossar = glossarSuchEintraege(
      glossarVon(inhalt).filter((e) => !seiteZu(e)),
      inhalt,
    );
    index = baueSuchIndex(inhalt, settings, [...begriffSuchEintraege(seiten), ...glossar]);
    jeEinstellung.set(schluessel, index);
  }
  return index;
}

/** Texte und Begriffsseiten laden und den Index bauen (Fehler egal – dann lädt der Dialog selbst). */
export async function bereiteSucheVor(kern: KernInhalt, settings: SuchEinstellungen): Promise<void> {
  try {
    const [inhalt, seiten] = await Promise.all([ladeAlleTexte(kern), ladeBegriffe()]);
    suchIndex(inhalt, seiten, settings);
  } catch {
    // Der Suchdialog versucht es beim Öffnen erneut und zeigt dann den Fehler.
  }
}
