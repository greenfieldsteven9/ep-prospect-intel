'use client';

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { PlayerWithAdjusted } from '@/types';

interface Props {
  players: PlayerWithAdjusted[];
}

const PLAYER_COLORS = ['#58a6ff', '#f0b429', '#3fb950', '#a78bfa'];

function latestSHLSeason(player: PlayerWithAdjusted) {
  return player.adjustedSeasons
    .filter((s) => s.league.id === 'shl')
    .sort((a, b) => b.seasonId.localeCompare(a.seasonId))[0];
}

function normalize(value: number, max: number): number {
  return max > 0 ? Math.round((value / max) * 100) : 0;
}

export default function ProspectRadar({ players }: Props) {
  const shlSeasons = players.map((p) => ({ player: p, season: latestSHLSeason(p) }))
    .filter((x) => x.season);

  if (shlSeasons.length === 0) return null;

  // Find max values across all players to normalize 0–100
  const maxPPG = Math.max(...shlSeasons.map(({ season: s }) => s.rawPPG));
  const maxGoals = Math.max(...shlSeasons.map(({ season: s }) => s.goals));
  const maxAssists = Math.max(...shlSeasons.map(({ season: s }) => s.assists));
  const maxGP = Math.max(...shlSeasons.map(({ season: s }) => s.gamesPlayed));
  const maxAdjPPG = Math.max(...shlSeasons.map(({ season: s }) => s.adjustedPPG));

  const dimensions = ['Adj. PPG', 'Goals/GP', 'Assists/GP', 'Durability', 'Raw PPG'];

  const chartData = dimensions.map((dim) => {
    const entry: Record<string, string | number> = { dimension: dim };
    shlSeasons.forEach(({ player, season: s }) => {
      let val = 0;
      if (dim === 'Adj. PPG') val = normalize(s.adjustedPPG, maxAdjPPG);
      if (dim === 'Goals/GP') val = normalize(s.goals / s.gamesPlayed, maxGoals / maxGP);
      if (dim === 'Assists/GP') val = normalize(s.assists / s.gamesPlayed, maxAssists / maxGP);
      if (dim === 'Durability') val = normalize(s.gamesPlayed, maxGP);
      if (dim === 'Raw PPG') val = normalize(s.rawPPG, maxPPG);
      entry[player.slug] = val;
    });
    return entry;
  });

  return (
    <div>
      <p className="text-text-secondary text-xs mb-3">Most recent SHL season · normalized 0–100</p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#30363d" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#8b949e', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#484f58', fontSize: 9 }}
            tickCount={4}
          />
          {shlSeasons.map(({ player }, i) => (
            <Radar
              key={player.slug}
              name={`${player.firstName} ${player.lastName}`}
              dataKey={player.slug}
              stroke={PLAYER_COLORS[i % PLAYER_COLORS.length]}
              fill={PLAYER_COLORS[i % PLAYER_COLORS.length]}
              fillOpacity={0.12}
              strokeWidth={2}
            />
          ))}
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
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
