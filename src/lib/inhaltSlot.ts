import { createContext, useContext } from 'react';

/**
 * Platz im Inhaltsverzeichnis des Buchs (components/Buch.tsx, linke Seite) für die Abschnitte der offenen Seite – z. B. die Teile
 * eines Lernblatts. Die Seite hängt ihre Liste per createPortal dort ein; ohne Platz (noch nicht gezeichnet) ist der Wert null.
 */
export const InhaltSlotContext = createContext<HTMLElement | null>(null);
export const useInhaltSlot = () => useContext(InhaltSlotContext);
