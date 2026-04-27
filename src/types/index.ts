// EP-aligned data schema — swap JSON fixtures for real API responses in epAdapter.ts

export interface LeagueInfo {
  id: string;
  name: string;
  shortName: string;
  country: string;
  tier: number; // 1 = top pro, 2 = second tier, 3 = major junior/top dev, 4 = junior
  difficultyCoefficient: number; // 0–1, relative to NHL = 1.0
}

export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  country: string;
}

export interface PlayoffStats {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
}

export interface Season {
  seasonId: string; // e.g. "2023-24"
  team: TeamInfo;
  league: LeagueInfo;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
  playoffs?: PlayoffStats;
}

export interface DraftInfo {
  year: number;
  round: number;
  overall: number;
  team: string;
  teamId: string;
}

export interface Milestone {
  date: string; // ISO 8601
  label: string;
  type: 'draft' | 'debut' | 'goal' | 'point' | 'award' | 'contract' | 'other';
}

export interface Player {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO 8601
  birthplace: string;
  nationality: string;
  position: string; // "C" | "LW" | "RW" | "D" | "G"
  shoots: 'L' | 'R';
  height: number; // cm
  weight: number; // kg
  imageUrl?: string;
  draftInfo?: DraftInfo;
  currentTeam: TeamInfo;
  seasons: Season[];
  milestones: Milestone[];
}

// Derived types used in UI components

export interface AdjustedSeason extends Season {
  rawPPG: number;
  adjustedPPG: number; // rawPPG × leagueDifficultyCoefficient
}

export interface PlayerWithAdjusted extends Player {
  adjustedSeasons: AdjustedSeason[];
  careerGP: number;
  careerGoals: number;
  careerAssists: number;
  careerPoints: number;
}
