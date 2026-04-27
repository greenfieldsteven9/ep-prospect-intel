'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import type { PlayerWithAdjusted } from '@/types';

interface Props {
  players: PlayerWithAdjusted[];
  useAdjusted: boolean;
}

const PLAYER_COLORS = ['#58a6ff', '#f0b429', '#3fb950', '#a78bfa'];

function latestSHLSeasons(player: PlayerWithAdjusted) {
  return player.adjustedSeasons
    .filter((s) => s.league.id === 'shl')
    .sort((a, b) => b.seasonId.localeCompare(a.seasonId));
}

export default function CompareBarChart({ players, useAdjusted }: Props) {
  // Build per-season data across all players for their most recent 3 SHL seasons
  const allSeasonIds = Array.from(
    new Set(
      players.flatMap((p) =>
        latestSHLSeasons(p)
          .slice(0, 3)
          .map((s) => s.seasonId)
      )
    )
  ).sort();

  const data = allSeasonIds.map((sid) => {
    const row: Record<string, string | number> = { season: sid.replace(/^20/, '').replace(/-shl$/, '') };
    players.forEach((p) => {
      const s = p.adjustedSeasons.find((as) => as.seasonId === sid);
      if (s) {
        row[p.slug] = useAdjusted
          ? parseFloat((s.adjustedPPG * 82).toFixed(2))
          : parseFloat((s.rawPPG * 82).toFixed(2));
      }
    });
    return row;
  });

  return (
    <div>
      <p className="text-text-secondary text-xs mb-3">
        {useAdjusted ? 'Difficulty-adjusted points (82-GP pace)' : 'Raw PPG × 82'}
        {' '}· SHL seasons only
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
          <XAxis
            dataKey="season"
            tick={{ fill: '#8b949e', fontSize: 11 }}
            axisLine={{ stroke: '#30363d' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8b949e', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: '#21262d',
              border: '1px solid #30363d',
              borderRadius: '6px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#8b949e' }}
            itemStyle={{ color: '#e6edf3' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#8b949e', paddingTop: '8px' }} />
          {players.map((p, i) => (
            <Bar
              key={p.slug}
              dataKey={p.slug}
              name={`${p.firstName} ${p.lastName}`}
              fill={PLAYER_COLORS[i % PLAYER_COLORS.length]}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
