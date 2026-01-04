
export interface Team {
  id: string;
  name: string;
  color: string;
  logo: string;
  primaryHex: string;
  leagueId: string;
}

export interface League {
  id: string;
  name: string;
  logo: string;
  logoVariants?: Record<string, string>;
  description: string;
  accentColor?: string;
}

export type AppStep = 'landing' | 'onboarding' | 'upload' | 'league-select' | 'customize' | 'processing' | 'result' | 'profile' | 'editor' | 'auth';

export interface SavedSwap {
  id: string;
  team: string;
  league: string;
  date: string;
  image: string;
  season: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string; // Simulated for local storage demo
  handle: string;
  role: 'Athlete' | 'Pro Designer' | 'Scout';
  leaguePreference: string;
  bio: string;
  avatar: string | null;
  stats: {
    precision: number;
    sync: number;
    speed: number;
  };
  ovr: number;
  vault: SavedSwap[];
}

export interface SwapState {
  image: string | null;
  league: League | null;
  team: Team | null;
  number: string;
  removeBackground: boolean;
}
