import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameData, UserProfile, Discovery, DiscoveredSpecies, Challenge, CommunityData, GameSettings, NotificationData, ModalState } from '../types';

interface GameStore {
  // Core game data
  gameData: GameData;

  // UI state
  currentScreen: 'game' | 'collection';
  notifications: NotificationData[];
  modal: ModalState;

  // Game state
  isGameActive: boolean;
  dailyChallenges: Challenge[];
  streakData: { daily: number; perfect: number; lastPerfectConfidence: number };
  hasShownWelcome: boolean;

  // Actions
  setCurrentScreen: (screen: 'game' | 'collection') => void;
  updateGameData: (data: Partial<GameData>) => void;
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  setModal: (modal: ModalState) => void;
  closeModal: () => void;
  setGameActive: (active: boolean) => void;
  updateDailyChallenges: (challenges: Challenge[]) => void;
  updateStreakData: (data: Partial<{ daily: number; perfect: number; lastPerfectConfidence: number }>) => void;
  setHasShownWelcome: (shown: boolean) => void;

  // Initialization
  initializeGame: () => void;
  resetGame: () => void;
}

const defaultUserProfile: UserProfile = {
  totalPoints: 0,
  totalXP: 0,
  level: 1,
  achievements: [],
  streakData: { daily: 0, perfect: 0, lastPerfectConfidence: 0 },
  joinedDate: new Date().toISOString(),
};

const defaultGameData: GameData = {
  userProfile: defaultUserProfile,
  discoveries: [],
  discoveredSpecies: [],
  challenges: [],
  community: {
    neighborhoods: [],
    communityPool: {
      totalPoints: 0,
      communityGoals: [],
      individualRedemptions: [],
      communityRedemptions: [],
    },
  },
    settings: {
      soundEnabled: true,
      notificationsEnabled: true,
      cameraFacingMode: 'environment' as const,
      autoDetection: true,
      locationEnabled: true,
      theme: 'auto' as const,
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium' as const,
    },
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameData: defaultGameData,
      currentScreen: 'game',
      notifications: [],
      modal: { isOpen: false, type: 'discovery' },
      isGameActive: false,
      dailyChallenges: [],
      streakData: { daily: 0, perfect: 0, lastPerfectConfidence: 0 },
      hasShownWelcome: false,

      // Actions
      setCurrentScreen: (screen) => set({ currentScreen: screen }),

      updateGameData: (data) =>
        set((state) => ({
          gameData: { ...state.gameData, ...data },
        })),

      addNotification: (notification) =>
        set((state) => {
          const newNotification: NotificationData = {
            ...notification,
            id: Date.now().toString(),
            timestamp: Date.now(),
          };
          return {
            notifications: [...state.notifications, newNotification],
          };
        }),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      setModal: (modal) => set({ modal }),

      closeModal: () => set({ modal: { isOpen: false, type: 'discovery' } }),

      setGameActive: (active) => set({ isGameActive: active }),

      updateDailyChallenges: (challenges) => set({ dailyChallenges: challenges }),

      updateStreakData: (data) =>
        set((state) => ({
          streakData: { ...state.streakData, ...data },
        })),

      setHasShownWelcome: (shown) => set({ hasShownWelcome: shown }),

      initializeGame: () => {
        const state = get();
        // Load community data
        const savedNeighborhood = localStorage.getItem('userNeighborhood');
        if (savedNeighborhood) {
          try {
            const neighborhood = JSON.parse(savedNeighborhood);
            state.updateGameData({
              community: {
                ...state.gameData.community,
                userNeighborhood: neighborhood,
              },
            });
          } catch (error) {
            console.warn('Failed to load user neighborhood:', error);
          }
        }

        // Load neighborhoods data
        const savedNeighborhoods = localStorage.getItem('neighborhoods');
        if (savedNeighborhoods) {
          try {
            const neighborhoods = JSON.parse(savedNeighborhoods);
            state.updateGameData({
              community: {
                ...state.gameData.community,
                neighborhoods,
              },
            });
          } catch (error) {
            console.warn('Failed to load neighborhoods:', error);
          }
        }

        // Load community pool data
        const savedCommunityPool = localStorage.getItem('communityPool');
        if (savedCommunityPool) {
          try {
            const communityPool = JSON.parse(savedCommunityPool);
            state.updateGameData({
              community: {
                ...state.gameData.community,
                communityPool,
              },
            });
          } catch (error) {
            console.warn('Failed to load community pool:', error);
          }
        }

        // Load daily challenges
        const today = new Date().toDateString();
        const savedChallenges = localStorage.getItem(`dailyChallenges_${today}`);
        if (savedChallenges) {
          try {
            const challenges = JSON.parse(savedChallenges);
            state.updateDailyChallenges(challenges);
          } catch (error) {
            console.warn('Failed to load daily challenges:', error);
          }
        }

        // Check for camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          state.addNotification({
            message: 'Camera access is not supported in this browser.',
            type: 'error',
            duration: 5000,
          });
        }

        // Only show welcome notification once
        if (!state.hasShownWelcome) {
          state.addNotification({
            message: '🌟 Welcome to PanGEO!',
            type: 'success',
            duration: 4000,
          });
          state.setHasShownWelcome(true);
        }
      },

      resetGame: () => {
        // Clear localStorage
        localStorage.clear();

        // Reset state
        set({
          gameData: defaultGameData,
          currentScreen: 'game',
          notifications: [],
          modal: { isOpen: false, type: 'discovery' },
          isGameActive: false,
          dailyChallenges: [],
          streakData: { daily: 0, perfect: 0, lastPerfectConfidence: 0 },
        });

        get().addNotification({
          message: '🔄 Game completely reset!',
          type: 'success',
          duration: 4000,
        });
      },
    }),
    {
      name: 'pangeo-game-storage',
      partialize: (state) => ({
        gameData: state.gameData,
        streakData: state.streakData,
      }),
    }
  )
);
