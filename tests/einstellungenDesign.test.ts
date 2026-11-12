import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { emptyProgress } from '../shared/progress';

// Design-Umschalter (Umsetzungsplan Phase 2): zog aus der Seitenleiste in die Einstellungen.

vi.mock('../src/lib/store', () => ({
  useStore: () => ({ progress: emptyProgress(), update: () => {} }),
  useStartStore: () => ({ progress: emptyProgress(), update: () => {} }),
}));

const { Einstellungen } = await import('../src/pages/Einstellungen');
const { THEMES } = await import('../src/lib/theme');

describe('Einstellungen → Design', () => {
  it('Segmented Control System / Hell / Dunkel, ohne gespeicherte Wahl ist „System“ gewählt', () => {
    const html = renderToString(createElement(MemoryRouter, null, createElement(Einstellungen))).replace(/<!-- -->/g, '');
    expect(html).toContain('<div class="mode-switch" role="group" aria-label="Farbschema">');
    expect(THEMES.map((t) => t.label)).toEqual(['System', 'Hell', 'Dunkel']);
    expect(html).toMatch(/aria-pressed="true"><svg.*?<\/svg> System<\/button>/);
    expect(html.match(/aria-pressed="false"><svg.*?<\/svg> (Hell|Dunkel)<\/button>/g)).toHaveLength(2);
    expect(html).not.toContain('unten in der Navigation');
  });
});
