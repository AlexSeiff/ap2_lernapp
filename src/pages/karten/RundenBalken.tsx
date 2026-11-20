/** Fortschrittsbalken der Lernrunde (Karte x von y). */
export function RundenBalken({ index, gesamt }: { index: number; gesamt: number }) {
  return (
    <div
      className="runden-balken"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={gesamt}
      aria-valuenow={index}
      aria-label="Fortschritt der Runde"
    >
      <div style={{ width: `${Math.min(100, (index / Math.max(1, gesamt)) * 100)}%` }} />
    </div>
  );
}
