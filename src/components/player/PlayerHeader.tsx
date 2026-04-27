import type { PlayerWithAdjusted } from '@/types';
import StatCard from '@/components/ui/StatCard';

interface Props {
  player: PlayerWithAdjusted;
}

function ageFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) age--;
  return age;
}

function formatHeight(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  const ft = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${ft}'${inches}"`;
}

export default function PlayerHeader({ player }: Props) {
  const age = ageFromBirthDate(player.birthDate);
  const latestSHL = player.adjustedSeasons
    .filter((s) => s.league.id === 'shl')
    .sort((a, b) => b.seasonId.localeCompare(a.seasonId))[0];

  return (
    <div>
      {/* Identity bar */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5 rounded-full">
              {player.position}
            </span>
            {player.draftInfo && (
              <span className="bg-accent-gold/10 text-accent-gold text-xs font-semibold px-2 py-0.5 rounded-full">
                {player.draftInfo.year} · Rd {player.draftInfo.round} · #{player.draftInfo.overall} {player.draftInfo.team}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            {player.firstName}{' '}
            <span className="text-accent">{player.lastName}</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {player.currentTeam.name} · {player.nationality} · Age {age} · {formatHeight(player.height)} / {player.weight} kg · Shoots {player.shoots}
          </p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Career GP" value={player.careerGP} />
        <StatCard label="Career Points" value={player.careerPoints} accent />
        <StatCard label="Goals / Assists" value={`${player.careerGoals} / ${player.careerAssists}`} />
        {latestSHL && (
          <StatCard
            label={`${latestSHL.seasonId.replace(/-shl$/, '')} SHL PPG`}
            value={(latestSHL.rawPPG).toFixed(2)}
            sub={`Adj: ${latestSHL.adjustedPPG.toFixed(2)}`}
            accent
          />
        )}
      </div>
    </div>
  );
}
