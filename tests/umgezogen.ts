// Seit Version 9 ziehen die Aufgaben-IDs der umgebauten Übungsklausuren um (shared/aufgabenUmzug.ts). So sehen alte Fixtures nach dem
// Laden aus – sonst bleibt alles gleich.

import { AUFGABEN_UMZUG_V9 } from '../shared/aufgabenUmzug';
import { zieheAufgabenUm } from '../shared/progress';

export const umgezogen = <T extends object>(p: T): T => zieheAufgabenUm(p as Record<string, unknown>, AUFGABEN_UMZUG_V9) as T;
