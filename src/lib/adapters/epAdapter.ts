/**
 * EP Adapter — single place to swap JSON fixtures for real Elite Prospects API calls.
 *
 * When you have EP API credentials, replace the fixture imports below with
 * fetch() calls to https://api.eliteprospects.com/v1/players/{id} and
 * transform the response through normalizeEPPlayer().
 */

import type { Player } from '@/types';

// --- Fixture imports (dev only) ---
import viggoRaw from '@/data/players/viggo-bjorck.json';
import ottoRaw from '@/data/players/otto-stenberg.json';
import axelRaw from '@/data/players/axel-frondell.json';

type RawPlayerJson = Omit<typeof viggoRaw, '_note'>;

function normalizePlayer(raw: RawPlayerJson & { _note?: string }): Player {
  // Strip the dev-only _note field before typing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _note, ...data } = raw as typeof raw & { _note?: string };
  return data as unknown as Player;
}

const FIXTURE_MAP: Record<string, RawPlayerJson & { _note?: string }> = {
  'viggo-bjorck': viggoRaw,
  'otto-stenberg': ottoRaw,
  'axel-frondell': axelRaw,
};

export async function fetchPlayerBySlug(slug: string): Promise<Player | null> {
  const raw = FIXTURE_MAP[slug];
  if (!raw) return null;
  return normalizePlayer(raw);
}

export async function fetchAllPlayers(): Promise<Player[]> {
  return Object.values(FIXTURE_MAP).map(normalizePlayer);
}

export async function fetchPlayersBySlug(slugs: string[]): Promise<Player[]> {
  const results = await Promise.all(slugs.map(fetchPlayerBySlug));
  return results.filter((p): p is Player => p !== null);
}
