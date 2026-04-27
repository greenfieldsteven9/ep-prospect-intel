import Link from 'next/link';
import { getAllPlayers } from '@/lib/services/playerService';

export default async function HomePage() {
  const players = await getAllPlayers();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Prospect Profiles</h1>
        <p className="text-text-secondary text-sm mt-1">
          Career progression, league-adjusted production, and scouting context.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((p) => {
          const latestSHL = p.adjustedSeasons
            .filter((s) => s.league.id === 'shl')
            .sort((a, b) => b.seasonId.localeCompare(a.seasonId))[0];

          return (
            <Link
              key={p.slug}
              href={`/players/${p.slug}`}
              className="group bg-surface border border-border rounded-xl p-5 hover:border-accent/40 hover:bg-surface-2 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex gap-1.5 mb-1.5">
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                      {p.position}
                    </span>
                    {p.draftInfo && (
                      <span className="text-xs bg-accent-gold/10 text-accent-gold px-2 py-0.5 rounded-full font-medium">
                        {p.draftInfo.year} · #{p.draftInfo.overall}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                    {p.firstName} {p.lastName}
                  </h2>
                  <p className="text-text-secondary text-xs">{p.currentTeam.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                <div>
                  <p className="text-text-muted text-xs">Career PTS</p>
                  <p className="text-text-primary font-semibold">{p.careerPoints}</p>
                </div>
                {latestSHL && (
                  <>
                    <div>
                      <p className="text-text-muted text-xs">SHL PPG</p>
                      <p className="text-text-primary font-semibold">{latestSHL.rawPPG.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-xs">Adj PPG</p>
                      <p className="text-accent-gold font-semibold">{latestSHL.adjustedPPG.toFixed(2)}</p>
                    </div>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 font-medium transition-colors"
        >
          Open Scout Comparison Tool →
        </Link>
      </div>
    </div>
  );
}
