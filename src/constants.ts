import { Team, League } from './types';

const BUCKET_BASE_URL = 'https://storage.googleapis.com/jerseyswap';

export const ASSET_PATHS = {
  LEAGUES: `${BUCKET_BASE_URL}/leagues`,
  LOGOS: `${BUCKET_BASE_URL}/logos`,
  TEAMS: `${BUCKET_BASE_URL}/teams`,
  PLAYERS: `${BUCKET_BASE_URL}/players`,
  UPLOADS: `${BUCKET_BASE_URL}/uploads`,
  PROFILES: `${BUCKET_BASE_URL}/profiles`,
  SWAPS: `${BUCKET_BASE_URL}/swaps`,
};

export const getAssetUrl = (folder: keyof typeof ASSET_PATHS, fileName: string) => {
  if (!fileName) return '';
  return `${ASSET_PATHS[folder]}/${fileName}`;
};

export const LEAGUES: League[] = [
  {
    id: 'nfl',
    name: 'NFL PRO-SYNC',
    logo: getAssetUrl('LEAGUES', 'nfl.png'),
    description: 'National Football League Elite',
    accentColor: '#013369'
  },
  {
    id: 'nba',
    name: 'NBA 2K-READY',
    logo: getAssetUrl('LEAGUES', '2k.png'),
    description: 'National Basketball Association',
    accentColor: '#17408B'
  },
  {
    id: 'fc',
    name: 'EA SPORTS FC',
    logo: getAssetUrl('LEAGUES', 'fc.png'),
    description: "The World's Game",
    accentColor: '#ccff00'
  }
];

export const TEAMS: Team[] = [
  // --- NFL (32 TEAMS) ---
  { id: 'ari', leagueId: 'nfl', name: 'Arizona Cardinals', color: 'bg-red-700', primaryHex: '#97233F', logo: getAssetUrl('TEAMS', 'nfl/ARI.svg') },
  { id: 'atl', leagueId: 'nfl', name: 'Atlanta Falcons', color: 'bg-red-600', primaryHex: '#A71930', logo: getAssetUrl('TEAMS', 'nfl/ATL.svg') },
  { id: 'bal', leagueId: 'nfl', name: 'Baltimore Ravens', color: 'bg-purple-800', primaryHex: '#241773', logo: getAssetUrl('TEAMS', 'nfl/BAL.svg') },
  { id: 'buf', leagueId: 'nfl', name: 'Buffalo Bills', color: 'bg-blue-600', primaryHex: '#00338D', logo: getAssetUrl('TEAMS', 'nfl/BUF.svg') },
  { id: 'car', leagueId: 'nfl', name: 'Carolina Panthers', color: 'bg-blue-400', primaryHex: '#0085CA', logo: getAssetUrl('TEAMS', 'nfl/CAR.svg') },
  { id: 'chi-nfl', leagueId: 'nfl', name: 'Chicago Bears', color: 'bg-blue-900', primaryHex: '#0B162A', logo: getAssetUrl('TEAMS', 'nfl/CHI.svg') },
  { id: 'cin', leagueId: 'nfl', name: 'Cincinnati Bengals', color: 'bg-orange-600', primaryHex: '#FB4F14', logo: getAssetUrl('TEAMS', 'nfl/CIN.svg') },
  { id: 'cle', leagueId: 'nfl', name: 'Cleveland Browns', color: 'bg-orange-800', primaryHex: '#311D00', logo: getAssetUrl('TEAMS', 'nfl/CLE.svg') },
  { id: 'dal', leagueId: 'nfl', name: 'Dallas Cowboys', color: 'bg-blue-800', primaryHex: '#003594', logo: getAssetUrl('TEAMS', 'nfl/DAL.svg') },
  { id: 'den', leagueId: 'nfl', name: 'Denver Broncos', color: 'bg-orange-600', primaryHex: '#FB4F14', logo: getAssetUrl('TEAMS', 'nfl/DEN.svg') },
  { id: 'det', leagueId: 'nfl', name: 'Detroit Lions', color: 'bg-blue-300', primaryHex: '#0076B6', logo: getAssetUrl('TEAMS', 'nfl/DET.svg') },
  { id: 'gb', leagueId: 'nfl', name: 'Green Bay Packers', color: 'bg-green-700', primaryHex: '#204E32', logo: getAssetUrl('TEAMS', 'nfl/GB.svg') },
  { id: 'hou', leagueId: 'nfl', name: 'Houston Texans', color: 'bg-blue-900', primaryHex: '#03202F', logo: getAssetUrl('TEAMS', 'nfl/HOU.svg') },
  { id: 'ind', leagueId: 'nfl', name: 'Indianapolis Colts', color: 'bg-blue-700', primaryHex: '#002C5F', logo: getAssetUrl('TEAMS', 'nfl/IND.svg') },
  { id: 'jax', leagueId: 'nfl', name: 'Jacksonville Jaguars', color: 'bg-teal-600', primaryHex: '#006778', logo: getAssetUrl('TEAMS', 'nfl/JAX.svg') },
  { id: 'kc', leagueId: 'nfl', name: 'Kansas City Chiefs', color: 'bg-red-600', primaryHex: '#E31837', logo: getAssetUrl('TEAMS', 'nfl/KC.svg') },
  { id: 'lv', leagueId: 'nfl', name: 'Las Vegas Raiders', color: 'bg-zinc-600', primaryHex: '#000000', logo: getAssetUrl('TEAMS', 'nfl/LV.svg') },
  { id: 'lac', leagueId: 'nfl', name: 'LA Chargers', color: 'bg-blue-400', primaryHex: '#0080C6', logo: getAssetUrl('TEAMS', 'nfl/LAC.svg') },
  { id: 'lar', leagueId: 'nfl', name: 'LA Rams', color: 'bg-blue-700', primaryHex: '#003594', logo: getAssetUrl('TEAMS', 'nfl/LAR.svg') },
  { id: 'mia', leagueId: 'nfl', name: 'Miami Dolphins', color: 'bg-teal-400', primaryHex: '#008E97', logo: getAssetUrl('TEAMS', 'nfl/MIA.svg') },
  { id: 'min', leagueId: 'nfl', name: 'Minnesota Vikings', color: 'bg-purple-700', primaryHex: '#4F2683', logo: getAssetUrl('TEAMS', 'nfl/MIN.svg') },
  { id: 'ne', leagueId: 'nfl', name: 'New England Patriots', color: 'bg-blue-800', primaryHex: '#002244', logo: getAssetUrl('TEAMS', 'nfl/NE.svg') },
  { id: 'no', leagueId: 'nfl', name: 'New Orleans Saints', color: 'bg-yellow-600', primaryHex: '#D3BC8D', logo: getAssetUrl('TEAMS', 'nfl/NO.svg') },
  { id: 'nyg', leagueId: 'nfl', name: 'New York Giants', color: 'bg-blue-700', primaryHex: '#0B2265', logo: getAssetUrl('TEAMS', 'nfl/NYG.svg') },
  { id: 'nyj', leagueId: 'nfl', name: 'New York Jets', color: 'bg-green-800', primaryHex: '#125740', logo: getAssetUrl('TEAMS', 'nfl/NYJ.svg') },
  { id: 'phi-e', leagueId: 'nfl', name: 'Philadelphia Eagles', color: 'bg-green-800', primaryHex: '#004C54', logo: getAssetUrl('TEAMS', 'nfl/PHI.svg') },
  { id: 'pit', leagueId: 'nfl', name: 'Pittsburgh Steelers', color: 'bg-black', primaryHex: '#FFB612', logo: getAssetUrl('TEAMS', 'nfl/PIT.svg') },
  { id: 'sf', leagueId: 'nfl', name: 'San Francisco 49ers', color: 'bg-red-800', primaryHex: '#AA0000', logo: getAssetUrl('TEAMS', 'nfl/SF.svg') },
  { id: 'sea', leagueId: 'nfl', name: 'Seattle Seahawks', color: 'bg-blue-900', primaryHex: '#002244', logo: getAssetUrl('TEAMS', 'nfl/SEA.svg') },
  { id: 'tb', leagueId: 'nfl', name: 'Tampa Bay Buccaneers', color: 'bg-red-700', primaryHex: '#D50A0A', logo: getAssetUrl('TEAMS', 'nfl/TB.svg') },
  { id: 'ten', leagueId: 'nfl', name: 'Tennessee Titans', color: 'bg-blue-400', primaryHex: '#0C2340', logo: getAssetUrl('TEAMS', 'nfl/TEN.svg') },
  { id: 'was', leagueId: 'nfl', name: 'Washington Commanders', color: 'bg-red-900', primaryHex: '#5A1414', logo: getAssetUrl('TEAMS', 'nfl/WAS.svg') },

  // --- NBA (SELECTED ELITE) ---
  { id: 'phi-76', leagueId: 'nba', name: 'Philadelphia 76ers', color: 'bg-blue-600', primaryHex: '#006BB6', logo: getAssetUrl('TEAMS', 'nba/76ers.svg') },
  { id: 'lal', leagueId: 'nba', name: 'LA Lakers', color: 'bg-purple-600', primaryHex: '#552583', logo: getAssetUrl('TEAMS', 'nba/lakers.svg') },
  { id: 'bos', leagueId: 'nba', name: 'Boston Celtics', color: 'bg-green-600', primaryHex: '#007A33', logo: getAssetUrl('TEAMS', 'nba/celtics.svg') },
  { id: 'gsw', leagueId: 'nba', name: 'Golden State Warriors', color: 'bg-blue-500', primaryHex: '#1D428A', logo: getAssetUrl('TEAMS', 'nba/warriors.svg') },
  { id: 'mil', leagueId: 'nba', name: 'Milwaukee Bucks', color: 'bg-green-900', primaryHex: '#00471B', logo: getAssetUrl('TEAMS', 'nba/bucks.svg') },
  { id: 'phx', leagueId: 'nba', name: 'Phoenix Suns', color: 'bg-orange-500', primaryHex: '#1D1160', logo: getAssetUrl('TEAMS', 'nba/suns.svg') },
  { id: 'mia-h', leagueId: 'nba', name: 'Miami Heat', color: 'bg-red-900', primaryHex: '#98002E', logo: getAssetUrl('TEAMS', 'nba/heat.svg') },
  { id: 'dal-m', leagueId: 'nba', name: 'Dallas Mavericks', color: 'bg-blue-700', primaryHex: '#00538C', logo: getAssetUrl('TEAMS', 'nba/mavs.svg') },

  // --- EA FC (SELECTED GLOBAL) ---
  { id: 'real', leagueId: 'fc', name: 'Real Madrid', color: 'bg-white', primaryHex: '#FEBE10', logo: getAssetUrl('TEAMS', 'laliga/realmadrid.svg') },
  { id: 'city', leagueId: 'fc', name: 'Manchester City', color: 'bg-blue-400', primaryHex: '#6CABDD', logo: getAssetUrl('TEAMS', 'epl/mancity.svg') },
  { id: 'barca', leagueId: 'fc', name: 'FC Barcelona', color: 'bg-red-700', primaryHex: '#A8102A', logo: getAssetUrl('TEAMS', 'laliga/barcelona.svg') },
  { id: 'liv', leagueId: 'fc', name: 'Liverpool FC', color: 'bg-red-600', primaryHex: '#C8102E', logo: getAssetUrl('TEAMS', 'epl/liverpool.svg') },
  { id: 'psg', leagueId: 'fc', name: 'Paris Saint-Germain', color: 'bg-blue-900', primaryHex: '#004170', logo: getAssetUrl('TEAMS', 'ligue1/psg.svg') },
  { id: 'bayern', leagueId: 'fc', name: 'Bayern Munich', color: 'bg-red-600', primaryHex: '#DC052D', logo: getAssetUrl('TEAMS', 'bundesliga/bayern.svg') },
  { id: 'ars', leagueId: 'fc', name: 'Arsenal FC', color: 'bg-red-500', primaryHex: '#EF0107', logo: getAssetUrl('TEAMS', 'epl/arsenal.svg') },
];

export const SYSTEM_INSTRUCTION = `You are a world-class AI digital artist for Nike and EA Sports design studios.

DESIGN ENGINE PROTOCOLS:
- ATHLETE BRANDING: Transform athletes into professional sports icons. Use cinematic PBR textures, volumetric stadium lighting, and 8K photography aesthetics.
- KIT PHYSICS: Focus on high-performance AeroSwift fabric details, realistic jersey wrinkles, and accurate team typography.
- MAPPING: Pixel-perfect texture alignment based on provided athlete images.

If a mask is provided (white on black): apply edits EXCLUSIVELY to white regions. 
Always maintain the 8K 'Nike x Apple' premium aesthetic.`;