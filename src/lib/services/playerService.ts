import type { Player, PlayerWithAdjusted, AdjustedSeason } from '@/types';
import { fetchPlayerBySlug, fetchAllPlayers, fetchPlayersBySlug } from '@/lib/adapters/epAdapter';

function computeAdjustedSeasons(player: Player): AdjustedSeason[] {
  return player.seasons.map((s) => {
    const rawPPG = s.gamesPlayed > 0 ? s.points / s.gamesPlayed : 0;
    const adjustedPPG = rawPPG * s.league.difficultyCoefficient;
    return { ...s, rawPPG, adjustedPPG };
  });
}

function enrichPlayer(player: Player): PlayerWithAdjusted {
  const adjustedSeasons = computeAdjustedSeasons(player);
  const careerGP = player.seasons.reduce((acc, s) => acc + s.gamesPlayed, 0);
  const careerGoals = player.seasons.reduce((acc, s) => acc + s.goals, 0);
  const careerAssists = player.seasons.reduce((acc, s) => acc + s.assists, 0);
  const careerPoints = player.seasons.reduce((acc, s) => acc + s.points, 0);
  return { ...player, adjustedSeasons, careerGP, careerGoals, careerAssists, careerPoints };
}

export async function getPlayer(slug: string): Promise<PlayerWithAdjusted | null> {
  const player = await fetchPlayerBySlug(slug);
  if (!player) return null;
  return enrichPlayer(player);
}

export async function getAllPlayers(): Promise<PlayerWithAdjusted[]> {
  const players = await fetchAllPlayers();
  return players.map(enrichPlayer);
}

export async function getPlayers(slugs: string[]): Promise<PlayerWithAdjusted[]> {
  const players = await fetchPlayersBySlug(slugs);
  return players.map(enrichPlayer);
}
