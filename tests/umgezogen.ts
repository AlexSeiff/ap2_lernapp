// Seit Version 9 ziehen die Aufgaben-IDs der umgebauten Übungsklausuren um (domain/aufgabenUmzug.ts). So sehen alte Fixtures nach dem
// Laden aus – sonst bleibt alles gleich.

import { AUFGABEN_UMZUG_V9 } from '../domain/aufgabenUmzug';
import { zieheAufgabenUm } from '../domain/progress';

export const umgezogen = <T extends object>(p: T): T => zieheAufgabenUm(p as Record<string, unknown>, AUFGABEN_UMZUG_V9) as T;
