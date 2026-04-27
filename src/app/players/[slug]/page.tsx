import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPlayer, getAllPlayers } from '@/lib/services/playerService';
import PlayerHeader from '@/components/player/PlayerHeader';
import CareerDashboard from '@/components/player/CareerDashboard';
import MilestonesPanel from '@/components/player/MilestonesPanel';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const players = await getAllPlayers();
  return players.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayer(slug);
  if (!player) return {};
  return {
    title: `${player.firstName} ${player.lastName} · EP Prospect Intel`,
    description: `Career stats, progression, and scouting data for ${player.firstName} ${player.lastName}.`,
  };
}

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params;
  const player = await getPlayer(slug);
  if (!player) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PlayerHeader player={player} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Career Progression
          </h2>
          <CareerDashboard player={player} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Milestones
          </h2>
          <div className="bg-surface border border-border rounded-xl p-5">
            <MilestonesPanel milestones={player.milestones} />
          </div>
        </div>
      </div>
    </div>
  );
}
