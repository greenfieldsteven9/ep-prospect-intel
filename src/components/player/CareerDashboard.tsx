'use client';

import { useState } from 'react';
import type { PlayerWithAdjusted } from '@/types';
import CareerProgressionChart from '@/components/charts/CareerProgressionChart';
import CareerStatsTable from '@/components/player/CareerStatsTable';
import MilestonesPanel from '@/components/player/MilestonesPanel';

interface Props {
  player: PlayerWithAdjusted;
}

export default function CareerDashboard({ player }: Props) {
  const [useAdjusted, setUseAdjusted] = useState(false);
  const [tab, setTab] = useState<'chart' | 'table' | 'milestones'>('chart');

  return (
    <div className="space-y-6">
      {/* Tab bar + toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-surface-2 p-1 rounded-lg">
          {(['chart', 'table', 'milestones'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-accent text-background'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'chart' && (
          <button
            onClick={() => setUseAdjusted((v) => !v)}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              useAdjusted
                ? 'border-accent-gold/50 bg-accent-gold/10 text-accent-gold'
                : 'border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${useAdjusted ? 'bg-accent-gold' : 'bg-text-muted'}`}
            />
            Difficulty-adjusted
          </button>
        )}
      </div>

      {/* Panel */}
      <div className="bg-surface border border-border rounded-xl p-5">
        {tab === 'chart' && (
          <CareerProgressionChart seasons={player.adjustedSeasons} useAdjusted={useAdjusted} />
        )}
        {tab === 'table' && (
          <CareerStatsTable seasons={player.adjustedSeasons} />
        )}
        {tab === 'milestones' && (
          <MilestonesPanel milestones={player.milestones} />
        )}
      </div>
    </div>
  );
}
