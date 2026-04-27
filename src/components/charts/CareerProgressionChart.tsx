'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import type { AdjustedSeason } from '@/types';

interface Props {
  seasons: AdjustedSeason[];
  useAdjusted: boolean;
}

const LEAGUE_COLORS: Record<string, string> = {
  shl: '#58a6ff',
  nhl: '#f0b429',
  ahl: '#3fb950',
  'j20-nationell': '#8b949e',
  'j18-nationell': '#484f58',
  allsvenskan: '#a78bfa',
};

function leagueColor(leagueId: string): string {
  return LEAGUE_COLORS[leagueId] ?? '#58a6ff';
}

function formatSeason(seasonId: string): string {
  // "2023-24-shl" → "23-24 SHL"  |  "2023-24" → "23-24"
  const parts = seasonId.split('-');
  const year = parts[0].slice(2) + '-' + parts[1];
  const tag = parts.slice(2).join('').toUpperCase();
  return tag ? `${year} ${tag}` : year;
}

export default function CareerProgressionChart({ seasons, useAdjusted }: Props) {
  const data = seasons.map((s) => ({
    season: formatSeason(s.seasonId),
    points: s.points,
    adjustedPPG: parseFloat((s.adjustedPPG * 82).toFixed(1)), // projected over 82 GP pace
    rawPPG: parseFloat((s.rawPPG * 82).toFixed(1)),
    leagueId: s.league.id,
    league: s.league.shortName,
    gp: s.gamesPlayed,
  }));

  return (
    <div>
      <p className="text-text-secondary text-xs mb-3">
        {useAdjusted
          ? 'Difficulty-adjusted points (projected 82-GP pace)'
          : 'Raw season points'}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
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
            formatter={(value, name) => {
              if (name === 'points') return [value, 'Raw Points'];
              if (name === 'adjustedPPG') return [value, 'Adj. 82-GP Pace'];
              return [value, String(name)];
            }}
            labelFormatter={(label) => `Season: ${label}`}
            contentStyle={{
              background: '#21262d',
              border: '1px solid #30363d',
              borderRadius: '6px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#8b949e' }}
            itemStyle={{ color: '#e6edf3' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px', color: '#8b949e', paddingTop: '8px' }}
          />
          <Bar dataKey="points" name="Raw Points" radius={[3, 3, 0, 0]} opacity={useAdjusted ? 0.3 : 1}>
            {data.map((entry, i) => (
              <Cell key={i} fill={leagueColor(entry.leagueId)} />
            ))}
          </Bar>
          {useAdjusted && (
            <Line
              type="monotone"
              dataKey="adjustedPPG"
              name="Adj. 82-GP Pace"
              stroke="#f0b429"
              strokeWidth={2}
              dot={{ fill: '#f0b429', r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-3">
        {Object.entries(LEAGUE_COLORS)
          .filter(([id]) => data.some((d) => d.leagueId === id))
          .map(([id, color]) => (
            <span key={id} className="flex items-center gap-1 text-xs text-text-secondary">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              {data.find((d) => d.leagueId === id)?.league}
            </span>
          ))}
      </div>
    </div>
  );
}
