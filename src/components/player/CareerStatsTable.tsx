import type { AdjustedSeason } from '@/types';

interface Props {
  seasons: AdjustedSeason[];
}

function pct(value: number, dp = 2): string {
  return value.toFixed(dp);
}

function leagueBadgeStyle(leagueId: string, tier: number): React.CSSProperties {
  if (leagueId === 'nhl') return { background: 'rgba(240,180,41,0.15)', color: '#f0b429' };
  if (tier === 1) return { background: 'rgba(88,166,255,0.1)', color: '#58a6ff' };
  if (tier === 2) return { background: 'rgba(167,139,250,0.1)', color: '#a78bfa' };
  return { background: 'rgba(139,148,158,0.08)', color: '#8b949e' };
}

function formatSeasonId(seasonId: string): string {
  // "2025-26-nhl" → "25-26"  (strip trailing league tag)
  return seasonId.replace(/^20/, '').replace(/-[a-z0-9]+$/, '');
}

export default function CareerStatsTable({ seasons }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
            <th className="py-2 pr-4 font-medium">Season</th>
            <th className="py-2 pr-4 font-medium">Team</th>
            <th className="py-2 pr-4 font-medium">League</th>
            <th className="py-2 pr-3 font-medium text-right">GP</th>
            <th className="py-2 pr-3 font-medium text-right">G</th>
            <th className="py-2 pr-3 font-medium text-right">A</th>
            <th className="py-2 pr-3 font-medium text-right">PTS</th>
            <th className="py-2 pr-3 font-medium text-right">+/-</th>
            <th className="py-2 pr-3 font-medium text-right">PPG</th>
            <th className="py-2 font-medium text-right text-accent-gold">Adj PPG</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {seasons.map((s) => {
            const isNHL = s.league.id === 'nhl';
            return (
              <tr
                key={s.seasonId}
                className={`hover:bg-surface-2/50 transition-colors ${isNHL ? 'bg-accent-gold/5' : ''}`}
              >
                <td className="py-2.5 pr-4 font-medium text-text-primary whitespace-nowrap">
                  {formatSeasonId(s.seasonId)}
                  {isNHL && (
                    <span className="ml-1.5 text-[10px] font-bold text-accent-gold bg-accent-gold/10 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      NHL
                    </span>
                  )}
                </td>
                <td className="py-2.5 pr-4 text-text-secondary whitespace-nowrap">{s.team.shortName}</td>
                <td className="py-2.5 pr-4 whitespace-nowrap">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={leagueBadgeStyle(s.league.id, s.league.tier)}
                  >
                    {s.league.shortName}
                  </span>
                </td>
                <td className="py-2.5 pr-3 text-right text-text-secondary">{s.gamesPlayed}</td>
                <td className="py-2.5 pr-3 text-right text-text-primary">{s.goals}</td>
                <td className="py-2.5 pr-3 text-right text-text-primary">{s.assists}</td>
                <td className={`py-2.5 pr-3 text-right font-semibold ${isNHL ? 'text-accent-gold' : 'text-text-primary'}`}>
                  {s.points}
                </td>
                <td className={`py-2.5 pr-3 text-right ${s.plusMinus >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {s.plusMinus >= 0 ? '+' : ''}{s.plusMinus}
                </td>
                <td className="py-2.5 pr-3 text-right text-text-secondary">{pct(s.rawPPG)}</td>
                <td className="py-2.5 text-right font-semibold text-accent-gold">{pct(s.adjustedPPG)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
