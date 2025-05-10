import { Match } from '../types/Match';

// TheSportsDB API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_SPORTS_API_BASE_URL || 'https://www.thesportsdb.com/api/v1/json/3';
const API_KEY = process.env.NEXT_PUBLIC_SPORTS_API_KEY || '3'; // Default to free tier if not specified

// Generate random odds for matches
const generateRandomOdds = (sport: string): { teamA: number; draw?: number; teamB: number } => {
  // Create more realistic odds based on sport
  if (sport === 'Soccer') {
    return {
      teamA: parseFloat((Math.random() * 3 + 1.5).toFixed(2)),
      draw: parseFloat((Math.random() * 2 + 2.5).toFixed(2)),
      teamB: parseFloat((Math.random() * 3 + 1.5).toFixed(2))
    };
  } else if (sport === 'Cricket') {
    return {
      teamA: parseFloat((Math.random() * 2 + 1.4).toFixed(2)),
      draw: parseFloat((Math.random() * 3 + 3.5).toFixed(2)),
      teamB: parseFloat((Math.random() * 2 + 1.4).toFixed(2))
    };
  } else {
    // Default odds for other sports
    return {
      teamA: parseFloat((Math.random() * 2 + 1.3).toFixed(2)),
      teamB: parseFloat((Math.random() * 2 + 1.3).toFixed(2))
    };
  }
};

// Format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Convert TheSportsDB event to our Match format
const convertEventToMatch = (event: any, isToday: boolean): Match => {
  const sportType = event.strSport.toLowerCase() === 'soccer' ? 'football' : event.strSport.toLowerCase();
  
  return {
    id: parseInt(event.idEvent),
    sport: sportType as any, // Cast to our sport types
    league: event.strLeague,
    teamA: event.strHomeTeam,
    teamB: event.strAwayTeam,
    time: event.strTime || '00:00',
    date: isToday ? 'Today' : 'Tomorrow',
    isLive: isToday && Math.random() > 0.7, // Randomly mark some of today's matches as live
    odds: generateRandomOdds(event.strSport),
    stats: isToday && Math.random() > 0.7 ? {
      teamAScore: sportType === 'cricket' 
        ? `${Math.floor(Math.random() * 150 + 50)}/${Math.floor(Math.random() * 10)}` 
        : Math.floor(Math.random() * 3),
      teamBScore: sportType === 'cricket' 
        ? `${Math.floor(Math.random() * 120 + 30)}/${Math.floor(Math.random() * 10)}`
        : Math.floor(Math.random() * 3),
      period: sportType === 'cricket' ? '2nd Innings' : '1st Half',
      timeElapsed: sportType === 'cricket' ? `${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 6)} overs` : `${Math.floor(Math.random() * 45)}'`
    } : undefined
  };
};

// Fetch events for a specific date
const fetchEventsByDate = async (date: string, sport: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${API_KEY}/eventsday.php?d=${date}&s=${sport}`);
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error(`Error fetching ${sport} events:`, error);
    return [];
  }
};

// Fetch cricket and football matches for today and tomorrow
export const fetchMatches = async (): Promise<Match[]> => {
  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);
  
  // API calls in parallel
  const [
    todayFootball,
    todayCricket,
    tomorrowFootball,
    tomorrowCricket
  ] = await Promise.all([
    fetchEventsByDate(todayStr, 'Soccer'),
    fetchEventsByDate(todayStr, 'Cricket'),
    fetchEventsByDate(tomorrowStr, 'Soccer'),
    fetchEventsByDate(tomorrowStr, 'Cricket')
  ]);
  
  // Convert events to our Match format
  const matches: Match[] = [
    ...todayFootball.map((event: any) => convertEventToMatch(event, true)),
    ...todayCricket.map((event: any) => convertEventToMatch(event, true)),
    ...tomorrowFootball.map((event: any) => convertEventToMatch(event, false)),
    ...tomorrowCricket.map((event: any) => convertEventToMatch(event, false))
  ];
  
  return matches;
};

// Fetch league events
export const fetchLeagueEvents = async (leagueId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${API_KEY}/eventspastleague.php?id=${leagueId}`);
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error(`Error fetching league events:`, error);
    return [];
  }
}; 