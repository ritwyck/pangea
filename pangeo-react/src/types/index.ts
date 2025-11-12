// Core game types
export interface GameData {
  userProfile: UserProfile;
  discoveries: Discovery[];
  discoveredSpecies: DiscoveredSpecies[];
  challenges: Challenge[];
  community: CommunityData;
  settings: GameSettings;
}

export interface UserProfile {
  totalPoints: number;
  totalXP: number;
  level: number;
  achievements: Achievement[];
  streakData: StreakData;
  joinedDate: string;
}

export interface Discovery {
  id: string;
  species: string;
  points: number;
  xp: number;
  photo: string;
  confidence: number;
  rarity: Rarity;
  location?: string;
  weather?: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
}

export interface DiscoveredSpecies {
  species: string;
  count: number;
  bestConfidence: number;
  firstDiscovered: string;
  totalPoints: number;
  rarity: Rarity;
  photo: string;
}

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  target: number;
  current: number;
  reward: ChallengeReward;
  completed: boolean;
  expiresAt?: string;
}

export type ChallengeType = 'daily' | 'weekly' | 'seasonal' | 'achievement';

export interface ChallengeReward {
  points: number;
  xp: number;
  title?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  points: number;
  rarity: Rarity;
  category: AchievementCategory;
  progress?: number;
  target?: number;
}

export type AchievementCategory = 'discovery' | 'collection' | 'social' | 'streak' | 'special';

export interface StreakData {
  daily: number;
  perfect: number;
  lastPerfectConfidence: number;
}

// Weather types
export interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  location: string;
  lastUpdated: string;
  weatherCode: number;
  cloudCover: number;
}

// Community types
export interface CommunityData {
  userNeighborhood?: Neighborhood;
  neighborhoods: Neighborhood[];
  communityPool: CommunityPool;
}

export interface Neighborhood {
  id: string;
  name: string;
  memberCount: number;
  totalPoints: number;
  avgPointsPerMember: number;
  rank: number;
  members: NeighborhoodMember[];
}

export interface NeighborhoodMember {
  username: string;
  points: number;
  joinDate: string;
  isCurrentUser?: boolean;
}

export interface CommunityPool {
  totalPoints: number;
  communityGoals: CommunityGoal[];
  individualRedemptions: RedemptionItem[];
  communityRedemptions: RedemptionItem[];
}

export interface CommunityGoal {
  id: string;
  name: string;
  description: string;
  targetPoints: number;
  currentPoints: number;
  deadline: string;
  rewards: GoalReward[];
}

export interface GoalReward {
  type: 'individual' | 'community';
  reward: string;
  cost: number;
}

export interface RedemptionItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  available: boolean;
}

// Detection types
export interface DetectionResult {
  species: string;
  confidence: number;
  points: number;
  rarity: Rarity;
  isNewSpecies: boolean;
}

export interface Species {
  name: string;
  category: string;
  basePoints: number;
  habitat: string[];
  season: string[];
  weatherBonus: { [key: string]: number };
}

// Camera types
export interface CameraState {
  isReady: boolean;
  isActive: boolean;
  stream: MediaStream | null;
  facingMode: 'user' | 'environment';
}

// UI types
export interface NotificationData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement';
  duration: number;
  timestamp: number;
}

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  data?: any;
}

export type ModalType =
  | 'discovery'
  | 'achievement'
  | 'community-registration'
  | 'community-dashboard'
  | 'map'
  | 'rewards'
  | 'data-export'
  | 'skill-tree';

// Mapping types
export interface MapMarker {
  id: string;
  position: [number, number];
  type: 'user' | 'community' | 'landmark';
  rarity: Rarity;
  discovery: Discovery;
}

// Rewards types
export interface Reward {
  id: string;
  name: string;
  description: string;
  partner: string;
  category: string;
  cost: number;
  value: string;
  expiryDays: number;
  available: boolean;
}

export interface Voucher {
  id: string;
  rewardId: string;
  code: string;
  redeemedAt: string;
  expiresAt: string;
  used: boolean;
  partner: string;
}

// Settings types
export interface GameSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  cameraFacingMode: 'user' | 'environment';
  autoDetection: boolean;
  locationEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface GameScreenProps extends BaseComponentProps {
  currentScreen: 'game' | 'collection';
  onScreenChange: (screen: 'game' | 'collection') => void;
}

// Hook return types
export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isReady: boolean;
  isActive: boolean;
  facingMode: 'user' | 'environment';
  startCamera: () => Promise<boolean>;
  stopCamera: () => void;
  capturePhoto: () => string | null;
  flipCamera: () => Promise<void>;
}

export interface UseDetectionReturn {
  isDetecting: boolean;
  currentDetection: DetectionResult | null;
  startDetection: () => void;
  stopDetection: () => void;
  getCurrentDetection: () => DetectionResult | null;
  resetDetection: () => void;
}

export interface UseStorageReturn {
  gameData: GameData;
  saveGameData: (data: Partial<GameData>) => void;
  addDiscovery: (discovery: Omit<Discovery, 'id'>) => Promise<{ discovery: Discovery; isNewSpecies: boolean }>;
  getUserProfile: () => UserProfile;
  getUniqueSpeciesCount: () => number;
  getSpeciesCollection: () => DiscoveredSpecies[];
  resetGameData: () => void;
  exportData: () => GameData;
}
