'use client';

import { useState } from 'react';
import type { PlayerWithAdjusted } from '@/types';
import CompareBarChart from '@/components/charts/CompareBarChart';
import ProspectRadar from '@/components/charts/ProspectRadar';
import CompareTable from '@/components/compare/CompareTable';

interface Props {
  allPlayers: PlayerWithAdjusted[];
}

const DEFAULT_SLUGS = ['viggo-bjorck', 'otto-stenberg', 'axel-frondell'];

export default function CompareClient({ allPlayers }: Props) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(DEFAULT_SLUGS);
  const [useAdjusted, setUseAdjusted] = useState(true);
  const [view, setView] = useState<'bar' | 'radar' | 'table'>('bar');

  const selected = allPlayers.filter((p) => selectedSlugs.includes(p.slug));

  function togglePlayer(slug: string) {
    setSelectedSlugs((prev) =>
      prev.includes(slug)
        ? prev.length > 1 ? prev.filter((s) => s !== slug) : prev
        : [...prev, slug].slice(0, 4)
    );
  }

  return (
    <div className="space-y-6">
      {/* Player selector */}
      <div className="flex flex-wrap gap-2">
        {allPlayers.map((p) => {
          const active = selectedSlugs.includes(p.slug);
          return (
            <button
              key={p.slug}
              onClick={() => togglePlayer(p.slug)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                active
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-border text-text-secondary hover:text-text-primary hover:border-border/80'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${active ? 'bg-accent' : 'bg-text-muted'}`}
              />
              {p.firstName} {p.lastName}
              <span className="text-text-muted text-xs">{p.position}</span>
            </button>
          );
        })}
      </div>

      {/* View tabs + difficulty toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-surface-2 p-1 rounded-lg">
          {(['bar', 'radar', 'table'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                view === v
                  ? 'bg-accent text-background'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {v === 'bar' ? 'Season Trend' : v === 'radar' ? 'Radar' : 'Table'}
            </button>
          ))}
        </div>

        {view !== 'radar' && (
          <button
            onClick={() => setUseAdjusted((v) => !v)}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              useAdjusted
                ? 'border-accent-gold/50 bg-accent-gold/10 text-accent-gold'
                : 'border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${useAdjusted ? 'bg-accent-gold' : 'bg-text-muted'}`} />
            Difficulty-adjusted
          </button>
        )}
      </div>

      {/* Chart panel */}
      <div className="bg-surface border border-border rounded-xl p-5">
        {view === 'bar' && <CompareBarChart players={selected} useAdjusted={useAdjusted} />}
        {view === 'radar' && <ProspectRadar players={selected} />}
        {view === 'table' && <CompareTable players={selected} useAdjusted={useAdjusted} />}
      </div>

      {/* Difficulty coefficient reference */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-text-muted hover:text-text-secondary select-none">
          About difficulty coefficients ▸
        </summary>
        <div className="mt-2 text-xs text-text-secondary bg-surface-2 border border-border rounded-lg p-4 space-y-1">
          <p>Adjusted PPG = Raw PPG × League Difficulty Coefficient.</p>
          <p>Coefficients are modeled on historical NHL translation rates (similar to GVT/NHLE methodology).</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {[
              { l: 'NHL', c: '1.00' },
              { l: 'SHL', c: '0.82' },
              { l: 'AHL', c: '0.72' },
              { l: 'Allsvenskan', c: '0.56' },
              { l: 'WHL', c: '0.58' },
              { l: 'OHL', c: '0.56' },
              { l: 'NCAA', c: '0.58' },
              { l: 'J20 Nat.', c: '0.25' },
            ].map(({ l, c }) => (
              <div key={l} className="flex justify-between bg-surface rounded px-2 py-1">
                <span>{l}</span>
                <span className="text-accent-gold font-mono">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
