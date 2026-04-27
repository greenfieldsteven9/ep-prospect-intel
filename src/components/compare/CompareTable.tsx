import type { PlayerWithAdjusted } from '@/types';

interface Props {
  players: PlayerWithAdjusted[];
  useAdjusted: boolean;
}

function latestSHLSeasons(player: PlayerWithAdjusted, n = 3) {
  return player.adjustedSeasons
    .filter((s) => s.league.id === 'shl')
    .sort((a, b) => b.seasonId.localeCompare(a.seasonId))
    .slice(0, n);
}

export default function CompareTable({ players, useAdjusted }: Props) {
  // Collect all SHL seasons per player
  const rows = players.map((p) => ({
    player: p,
    seasons: latestSHLSeasons(p),
  }));

  return (
    <div className="overflow-x-auto space-y-6">
      {rows.map(({ player, seasons }) => (
        <div key={player.slug}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            {player.firstName} {player.lastName}
            <span className="ml-2 text-text-muted font-normal text-xs">{player.position} · {player.currentTeam.shortName}</span>
          </h3>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border text-text-secondary text-xs uppercase tracking-wider">
                <th className="py-1.5 pr-4 font-medium">Season</th>
                <th className="py-1.5 pr-3 text-right font-medium">GP</th>
                <th className="py-1.5 pr-3 text-right font-medium">PTS</th>
                <th className="py-1.5 pr-3 text-right font-medium">PPG</th>
                <th className="py-1.5 text-right font-medium text-accent-gold">
                  {useAdjusted ? 'Adj PPG' : 'Raw PPG'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {seasons.map((s) => (
                <tr key={s.seasonId} className="hover:bg-surface-2/50 transition-colors">
                  <td className="py-2 pr-4 text-text-primary">{s.seasonId.replace(/-shl$/, '')}</td>
                  <td className="py-2 pr-3 text-right text-text-secondary">{s.gamesPlayed}</td>
                  <td className="py-2 pr-3 text-right font-medium text-text-primary">{s.points}</td>
                  <td className="py-2 pr-3 text-right text-text-secondary">{s.rawPPG.toFixed(2)}</td>
                  <td className="py-2 text-right font-semibold text-accent-gold">
                    {useAdjusted ? s.adjustedPPG.toFixed(2) : s.rawPPG.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
