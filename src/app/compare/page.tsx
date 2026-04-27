import type { Metadata } from 'next';
import { getAllPlayers } from '@/lib/services/playerService';
import CompareClient from '@/components/compare/CompareClient';

export const metadata: Metadata = {
  title: 'Scout Comparison · EP Prospect Intel',
  description: 'Difficulty-weighted prospect comparison with radar profiles and season-by-season breakdowns.',
};

export default async function ComparePage() {
  const players = await getAllPlayers();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Scout Comparison</h1>
        <p className="text-text-secondary text-sm mt-1">
          Compare prospects with difficulty-adjusted production across leagues.
          Toggle weighting to see raw vs. normalized output.
        </p>
      </div>
      <CompareClient allPlayers={players} />
    </div>
  );
}
