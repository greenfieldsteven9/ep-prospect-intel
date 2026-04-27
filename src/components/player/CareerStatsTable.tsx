import type { AdjustedSeason } from '@/types';

interface Props {
  seasons: AdjustedSeason[];
}

function pct(value: number, dp = 2): string {
  return value.toFixed(dp);
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
          {seasons.map((s) => (
            <tr key={s.seasonId} className="hover:bg-surface-2/50 transition-colors">
              <td className="py-2.5 pr-4 font-medium text-text-primary whitespace-nowrap">
                {s.seasonId.replace(/-shl$|-j20$|-j18$/, '')}
              </td>
              <td className="py-2.5 pr-4 text-text-secondary whitespace-nowrap">{s.team.shortName}</td>
              <td className="py-2.5 pr-4 whitespace-nowrap">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: s.league.tier === 1 ? 'rgba(88,166,255,0.1)' : 'rgba(139,148,158,0.1)',
                    color: s.league.tier === 1 ? '#58a6ff' : '#8b949e',
                  }}
                >
                  {s.league.shortName}
                </span>
              </td>
              <td className="py-2.5 pr-3 text-right text-text-secondary">{s.gamesPlayed}</td>
              <td className="py-2.5 pr-3 text-right text-text-primary">{s.goals}</td>
              <td className="py-2.5 pr-3 text-right text-text-primary">{s.assists}</td>
              <td className="py-2.5 pr-3 text-right font-semibold text-text-primary">{s.points}</td>
              <td className={`py-2.5 pr-3 text-right ${s.plusMinus >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                {s.plusMinus >= 0 ? '+' : ''}{s.plusMinus}
              </td>
              <td className="py-2.5 pr-3 text-right text-text-secondary">{pct(s.rawPPG)}</td>
              <td className="py-2.5 text-right font-semibold text-accent-gold">{pct(s.adjustedPPG)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
