export interface Match {
  id: number;
  sport: 'cricket' | 'football' | 'basketball' | 'tennis' | 'horse-racing';
  league: string;
  teamA: string;
  teamB: string;
  time: string;
  date: string;
  isLive?: boolean;
  odds: {
    teamA: number;
    draw?: number;
    teamB: number;
  };
  stats?: {
    teamAScore?: string | number;
    teamBScore?: string | number;
    period?: string;
    timeElapsed?: string;
  };
} 